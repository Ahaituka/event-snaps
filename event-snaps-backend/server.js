const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { google } = require("googleapis");
const AWS = require("aws-sdk");
const upload = multer();
const { Readable } = require("stream");
const { PrismaClient } = require("@prisma/client");

const app = express();
app.use(cors());
app.use(express.json());

const dotenv = require("dotenv");

dotenv.config();

const rekognition = new AWS.Rekognition({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );

const prisma = new PrismaClient();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.post(
  "/api/compare",
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const uploadedImage = req.file.buffer;
    const userId = req.body.userId;
    const accountDetails = await getAccountDetails(userId);
    const refreshToken = accountDetails.refresh_token;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({ refresh_token: refreshToken });
    await oauth2Client.refreshAccessToken();
    const folderId = accountDetails.folderId;

    const gdrive = google.drive({ version: "v3", auth: oauth2Client });

    // Fetch all images from Google Drive folder
    try {
      const driveResponse = await gdrive.files.list({
        q: `'${folderId}' in parents`,
      });

      const imageFiles = driveResponse.data.files.filter((file) =>
        file.mimeType.startsWith("image/")
      );

      // Download images from Google Drive folder
      const folderImages = await Promise.all(
        imageFiles.map(async (file) => {
          const imageData = await gdrive.files.get(
            { fileId: file.id, alt: "media" },
            { responseType: "arraybuffer" }
          );

          return {
            id: file.id,
            name: file.name,
            buffer: Buffer.from(imageData.data),
          };
        })
      );

      // Compare faces using AWS Rekognition
      const matchingImages = [];
      for (const folderImage of folderImages) {
        try {
          const rekognitionResponse = await rekognition
            .compareFaces({
              SourceImage: { Bytes: Buffer.from(uploadedImage, "base64") },
              TargetImage: { Bytes: Buffer.from(folderImage.buffer, "base64") },
              SimilarityThreshold: 70,
            })
            .promise();

          if (rekognitionResponse.FaceMatches.length > 0) {
            matchingImages.push(folderImage);
          }
        } catch (error) {
          console.error("Error comparing faces:", error.message);
        }
      }

      // Generate signed URLs for matched images
      const signedUrls = await Promise.all(
        matchingImages.map(async (image) => {
          const urlResponse = await gdrive.files.get({
            fileId: image.id,
            fields: "webContentLink",
          });

          return urlResponse.data.webContentLink;
        })
      );

      res.status(200).json({
        urls: signedUrls,
        images: matchingImages,
      });
    } catch (error) {
      throw new Error(
        "Error fetching images from Google Drive folder:",
        error.message
      );
    }
  })
);

const getAccountDetails = async (userId) => {
  const accountDetails = await prisma.account.findUniqueOrThrow({
    where: {
      userId: userId,
    },
  });
  console.log(accountDetails);
  return accountDetails;
};

app.post(
  "/api/upload",
  upload.array("images"),
  asyncHandler(async (req, res) => {
    const uploadedImages = req.files;
    const userId = req.body.userId;
    const accountDetails = await getAccountDetails(userId);
    const refreshToken = accountDetails.refresh_token;
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    oauth2Client.refreshAccessToken();
    // oauth2Client.refreshAccessToken((err, tokens) => {
    //   if (err) {s
    //     console.error('Error refreshing access token:', err);
    //   } else {
    //     console.log('New access token:', tokens.access_token);
    //   }
    // });
    const folderId = accountDetails.folderId;
    const gdrive = google.drive({ version: "v3", auth: oauth2Client });
    try {
      const uploadedImageResponses = await Promise.all(
        uploadedImages.map(async (image) => {
          const driveUploadResponse = await gdrive.files.create({
            requestBody: {
              name: image.originalname,
              mimeType: image.mimetype,
              parents: [folderId],
            },
            media: {
              mimeType: image.mimetype,
              body: Readable.from(image.buffer), // Create a stream from the buffer
            },
          });

          return driveUploadResponse.data;
        })
      );

      res.status(200).json({ message: "Images uploaded successfully" });
    } catch (error) {
      throw new Error(error.message);
    }
  })
);

app.get(
  "/api/download/:fileId",
  asyncHandler(async (req, res) => {
    try {
      const fileId = req.params.fileId;

      // Get file metadata
      const fileMetadata = await gdrive.files.get({
        fileId: fileId,
        fields: "mimeType,name",
      });

      // Download file from Google Drive
      const file = await gdrive.files.get(
        { fileId: fileId, alt: "media" },
        { responseType: "arraybuffer" }
      );

      // Set headers for the browser to download the file
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileMetadata.data.name}`
      );
      res.setHeader("Content-Type", fileMetadata.data.mimeType);

      res.send(Buffer.from(file.data));
    } catch (error) {
      throw new Error(
        "Error downloading file from Google Drive",
        error.message
      );
    }
  })
);

//display hello message on the home page
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// module.exports = app;
