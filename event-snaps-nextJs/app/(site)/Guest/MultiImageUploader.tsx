// MultiImageUploader.tsx
import { useTranslation } from "react-i18next";

interface MultiImageUploaderProps {
  handleImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadImages: () => Promise<void>;
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ handleImagesChange, handleUploadImages }) => {
  const { t } = useTranslation();

  return (
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
  );
};

export default MultiImageUploader;
