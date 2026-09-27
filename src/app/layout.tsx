import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { SiteFrame } from "@/components/site-frame";
import { home } from "@/content/home";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: home.name,
  description: home.introduction,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
