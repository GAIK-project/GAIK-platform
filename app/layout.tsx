import type { Metadata } from "next";
import { ABeeZee, Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const aBeeZee = ABeeZee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-abee-zee",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GAIK Dashboard",
  description: "Generative AI-Enhanced Knowledge Management in Business",
  metadataBase: new URL('https://dashboard.2.rahtiapp.fi/'),
  openGraph: {
    title: "GAIK Dashboard",
    description: "Generative AI-Enhanced Knowledge Management in Business (GAIK) - Advanced AI tools for organizational knowledge management",
    images: [
      {
        url: "/logos/gaik_logo_medium.png",
        width: 1200,
        height: 630,
        alt: "GAIK Dashboard logo",
      },
    ],
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${aBeeZee.variable} `}>
      <body className={`antialiased min-h-screen`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
