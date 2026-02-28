import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Mateusz Goszczycki — Junior/Mid Full Stack Developer",
  description:
    "Junior/Mid Full Stack Developer building production-ready web apps from concept to deployment. React, Next.js, Node.js, TypeScript.",
  keywords: [
    "Junior Full Stack Developer",
    "Mid Full Stack Developer",
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "Portfolio",
    "Mateusz Goszczycki",
  ],
  authors: [{ name: "Mateusz Goszczycki" }],
  creator: "Mateusz Goszczycki",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mateusz-goszczycki.vercel.app",
    siteName: "Mateusz Goszczycki — Portfolio",
    title: "Mateusz Goszczycki — Junior/Mid Full Stack Developer",
    description:
      "Transitioned from Head Chef to Full Stack Developer. Built and shipped 3 production apps. React · Next.js · Node.js · TypeScript.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mateusz Goszczycki — Junior/Mid Full Stack Developer",
    description:
      "Transitioned from Head Chef to Full Stack Developer. Built and shipped 3 production apps. React · Next.js · Node.js · TypeScript.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
