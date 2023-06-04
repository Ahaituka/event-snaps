'use client'

import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Header from './Header';
import ImageDownloader from './ImageDownloader';
import MultiImageUploader from './MultiImageUploader';
import ImageGallery from './ImageGallery';
import LoadingSpinner from './LoadingSpinner';


interface ImageFile {
  id: string;
  url: string;
}

const Guest: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [matchingImages, setMatchingImages] = useState<string[] | null>(null);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const [role, setRole] = useState<string | null>(null);




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
    setIsLoading(true);  // Start loading
    document.body.style.cursor = 'wait'; // Set cursor to wait
  
    const formData = new FormData();
    formData.append("image", selectedImage);  
    const response = await axios.post(`${apiUrl}/compare`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });    
    setMatchingImages(response.data.urls);
    setImageFiles(response.data.images);    
    setIsLoading(false);  // End loading
    document.body.style.cursor = 'default'; // Set cursor back to default

  };
  
  const handleUploadImages = async () => {
    if (!selectedImages) return;
    document.body.style.cursor = 'wait'; // Set cursor to wait

    const formData = new FormData();
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("images", selectedImages[i]);
    }

    await axios.post(`${apiUrl}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    document.body.style.cursor = 'default'; // Set cursor back to default
    alert("Images uploaded successfully!");

  };

  const handleDownloadImages = async (fileIds: string[]) => {
    const zip = new JSZip();
    document.body.style.cursor = 'wait'; // Set cursor to wait

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
    document.body.style.cursor = 'default'; // Set cursor back to default

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
    
      <LoadingSpinner isLoading={isLoading} />

      <div className="container mx-auto px-4">
        <Header changeLanguage={changeLanguage} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageDownloader 
            handleImageChange={handleImageChange}
            handleCompareFaces={handleCompareFaces}
          />
          
          <MultiImageUploader 
            handleImagesChange={handleImagesChange}
            handleUploadImages={handleUploadImages}
          />
        </div>

        {matchingImages && matchingImages.length > 0 && 
          <ImageGallery 
            matchingImages={matchingImages} 
            imageFiles={imageFiles} 
            handleImageSelection={handleImageSelection}
            handleDownloadImages={handleDownloadImages}
            selectedImageIds={selectedImageIds}
          />
        }
      </div>
    </div>
  );  
}

export default Guest;
