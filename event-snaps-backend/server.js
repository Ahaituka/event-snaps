const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { google } = require('googleapis');
const key = require('./credentials.json');
const AWS = require('aws-sdk');
const upload = multer();
const { Readable } = require('stream');

const app = express();
app.use(cors());
app.use(express.json());

const dotenv = require('dotenv');

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const FOLDER_ID = process.env.FOLDER_ID;

const jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, SCOPES, null);
const drive = google.drive({ version: 'v3', auth: jwtClient });


const rekognition = new AWS.Rekognition({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'An internal server error occurred' });
});


app.post('/api/compare', upload.single('image'), asyncHandler(async (req, res) => {
    const uploadedImage = req.file.buffer;
  
    // Fetch all images from Google Drive folder
    try {
      const driveResponse = await drive.files.list({
        q: `'${FOLDER_ID}' in parents`,
      });
  
      const imageFiles = driveResponse.data.files.filter((file) => file.mimeType.startsWith('image/'));
  
      // Download images from Google Drive folder
      const folderImages = await Promise.all(
          imageFiles.map(async (file) => {
            const imageData = await drive.files.get(
              { fileId: file.id, alt: 'media' },
              { responseType: 'arraybuffer' }
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
              SourceImage: { Bytes: Buffer.from(uploadedImage, 'base64') },
              TargetImage: { Bytes: Buffer.from(folderImage.buffer, 'base64') },              
              SimilarityThreshold: 70,
            })
            .promise();
  
          if (rekognitionResponse.FaceMatches.length > 0) {
            matchingImages.push(folderImage);
          }
        } catch (error) {
          console.error('Error comparing faces:', error);
        }
      }
  
      // Generate signed URLs for matched images
      const signedUrls = await Promise.all(
        matchingImages.map(async (image) => {
          const urlResponse = await drive.files.get({
            fileId: image.id,
            fields: 'webContentLink',
          });
  
          return urlResponse.data.webContentLink;
        })
      );
  
      res.status(200).json({
        urls: signedUrls,
        images: matchingImages,
      });
      } catch (error) {   
      throw new Error('Error fetching images from Google Drive folder:');
    }
  }));
  

 app.post('/api/upload', upload.array('images'), asyncHandler(async (req, res) => {
    const uploadedImages = req.files;
  
    try {
      const uploadedImageResponses = await Promise.all(
        uploadedImages.map(async (image) => {
          const driveUploadResponse = await drive.files.create({
            requestBody: {
              name: image.originalname,
              mimeType: image.mimetype,
              parents: [FOLDER_ID],
            },
            media: {
              mimeType: image.mimetype,
              body: Readable.from(image.buffer), // Create a stream from the buffer
            },
          });
  
          return driveUploadResponse.data;
        })
      );  
      res.status(200).json({ message: 'Images uploaded successfully' });
    } catch (error) {     
      throw new Error('Error uploading images to Google Drive');
    }
  }));


  app.get('/api/download/:fileId', asyncHandler(async (req, res) => {
    try {
      const fileId = req.params.fileId;
  
      // Get file metadata
      const fileMetadata = await drive.files.get({
        fileId: fileId,
        fields: 'mimeType,name',
      });
  
      // Download file from Google Drive
      const file = await drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'arraybuffer' }
      );
        
      // Set headers for the browser to download the file
      res.setHeader('Content-Disposition', `attachment; filename=${fileMetadata.data.name}`);
      res.setHeader('Content-Type', fileMetadata.data.mimeType);
  
      res.send(Buffer.from(file.data));
    } catch (error) {
      throw new Error('Error downloading file from Google Drive');
    }
  }));
  
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

