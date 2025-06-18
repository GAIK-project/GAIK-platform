import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import "nextra-theme-docs/style.css";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GAIK - Generative AI-Enhanced Knowledge Management",
  description: "Documentation for GAIK project AI toolkit, Python components, JavaScript tools, and API references",
  icons: {
    icon: "/logos/favicon.ico",
  },
};

const banner = (
  <Banner storageKey="gaik-banner">🚀 GAIK Project - AI-Enhanced Knowledge Management</Banner>
);

const navbar = <Navbar logo={
  <div className="flex items-center gap-2">
    <Image 
      src="/logos/only-gaik-text.png" 
      alt="GAIK Logo" 
      width={80}
      height={24}
      className="h-6 w-auto" 
      priority
      quality={100}
      unoptimized={true}
    />
    <span className="font-bold text-lg">Toolkit</span>
  </div>
} />;

const footer = <Footer>MIT {new Date().getFullYear()} © GAIK Project.</Footer>;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          // docsRepositoryBase="https://github.com/orgs/GAIK-project/repositories"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
