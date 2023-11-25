// ImageGallery.tsx
import { useTranslation } from "react-i18next";

interface ImageGalleryProps {
    matchingImages: string[];
    selectedImageIds: string[];
    imageFiles: any;
    handleImageSelection: (fileId: string, isSelected: boolean) => void;
    handleDownloadImages: (fileIds: string[]) => Promise<void>;
  }
  
  const ImageGallery: React.FC<ImageGalleryProps> = ({ matchingImages, imageFiles, handleImageSelection, handleDownloadImages, selectedImageIds }) => {
    const { t } = useTranslation();
    
    return (
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
    );
  };
  
  export default ImageGallery;
  