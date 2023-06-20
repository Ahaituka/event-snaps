'use client'

import {useTranslations} from 'next-intl';

interface ImageDownloaderProps {
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCompareFaces: () => Promise<void>;
  }
  
  const ImageDownloader: React.FC<ImageDownloaderProps> = ({ handleImageChange, handleCompareFaces }) => {
    const t = useTranslations('Index');
  
    return (
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
    );
  };
  
  export default ImageDownloader;
  