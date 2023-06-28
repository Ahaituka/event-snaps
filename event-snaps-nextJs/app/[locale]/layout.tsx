import "./globals.css";
import { Inter } from "next/font/google";
import Provider from "../context/AuthContext";
import ToasterContext from "../context/ToasterContext";
import { NextIntlClientProvider } from "next-intl";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "de" }];
}

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    // redirect('/');
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Provider>
            <ToasterContext />
            {children}
            <Analytics />
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}