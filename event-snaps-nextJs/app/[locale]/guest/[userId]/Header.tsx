// Header.tsx
import {useTranslations} from 'next-intl';
import Link from 'next-intl/link';
import {usePathname} from 'next-intl/client';

interface HeaderProps {
  changeLanguage: (language: string) => void;
}

const Header: React.FC<HeaderProps> = ({ changeLanguage }) => {
  const t = useTranslations('Index');
  const pathname = usePathname();
  console.log("🚀 ~ file: Header.tsx:13 ~ pathname:", pathname)


  return (
    <div>
      <h1 className="text-4xl font-bold mb-10 text-center">EventSnaps</h1>
      <div className="mb-4">
      <Link href={`/${pathname}`} locale="en">English </Link>

        <Link href={`/${pathname}`} locale="hi">हिन्दी</Link>


      </div>
    </div>
  );
};

export default Header;
