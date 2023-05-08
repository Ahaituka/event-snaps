import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface ImageFile {
  id: string;
  url: string;
}

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [matchingImages, setMatchingImages] = useState<string[] | null>(null);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const { t, i18n } = useTranslation();

  const apiUrl = "http://localhost:3001/api";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(e.target.files);
    }
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const handleCompareFaces = async () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append("image", selectedImage);

    const response = await axios.post(`${apiUrl}/compare`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setMatchingImages(response.data.urls);
    setImageFiles(response.data.images);
  };

  const handleUploadImages = async () => {
    if (!selectedImages) return;
    const formData = new FormData();
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("images", selectedImages[i]);
    }

    await axios.post(`${apiUrl}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const handleDownloadImages = async (fileIds: string[]) => {
    const zip = new JSZip();

    try {
      const blobs = await Promise.all(
        fileIds.map(async (fileId) => {
          const response = await fetch(`${apiUrl}/download/${fileId}`);

          if (!response.ok) {
            throw new Error(`Failed to download image with fileId: ${fileId}`);
          }

          return response.blob();
        })
      );

      blobs.forEach((blob, index) => {
        const file = new File([blob], `${fileIds[index]}.jpg`, {
          type: "image/jpeg",
        });
        zip.file(`${fileIds[index]}.jpg`, file, { binary: true });
      });

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "images.zip");
    } catch (error) {
      console.error("Error downloading images:", error);
    }
  };

  const handleImageSelection = (fileId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedImageIds((prevSelectedImageIds) => [
        ...prevSelectedImageIds,
        fileId,
      ]);
    } else {
      setSelectedImageIds((prevSelectedImageIds) =>
        prevSelectedImageIds.filter((id) => id !== fileId)
      );
    }
  };

  return (
    <div className="App min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-10 text-center">EventSnaps</h1>
        <div className="mb-4">
          <button onClick={() => changeLanguage("en")} className="mr-2">
            English
          </button>
          <button onClick={() => changeLanguage("hi")}>हिन्दी</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              {t("compareFacesHeading")}
            </h2>
            <input
              className="bg-gray-200 w-full p-2 rounded"
              type="file"
              onChange={handleImageChange}
            />
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
              onClick={handleCompareFaces}
            >
              {t("viewImagesHeading")}
            </button>
          </div>
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              {t("uploadImagesHeading")}
            </h2>
            <input
              className="bg-gray-200 w-full p-2 rounded"
              type="file"
              multiple
              onChange={handleImagesChange}
            />
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
              onClick={handleUploadImages}
            >
              {t("upload")}
            </button>
          </div>
        </div>
        {matchingImages && matchingImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-4">
              {t("matchingImagesHeading")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {matchingImages.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt="Matching faces"
                    className="w-full h-auto rounded shadow-md"
                  />
                  <input
                    type="checkbox"
                    className="absolute top-0 right-0 m-1"
                    onChange={(e) => {
                      if (imageFiles[index]) {
                        handleImageSelection(
                          imageFiles[index].id,
                          e.target.checked
                        );
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded mr-4"
                onClick={() => handleDownloadImages(selectedImageIds)}
              >
                {t("downloadSelectedImages")}
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={() =>
                  handleDownloadImages(
                    matchingImages.map((_, index) => imageFiles[index].id)
                  )
                }
              >
                {t("downloadAllImages")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
