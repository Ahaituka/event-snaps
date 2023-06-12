// Header.tsx
import { useTranslation } from "react-i18next";

interface HeaderProps {
  changeLanguage: (language: string) => void;
}

const Header: React.FC<HeaderProps> = ({ changeLanguage }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-10 text-center">EventSnaps</h1>
      <div className="mb-4">
        <button onClick={() => changeLanguage("en")} className="mr-2">
          {t("English")}
        </button>
        <button onClick={() => changeLanguage("hi")}>
          {t("हिन्दी")}
        </button>
      </div>
    </div>
  );
};

export default Header;
