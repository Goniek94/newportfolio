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
  title: "Mateusz Goszczycki — Full Stack Engineer",
  description:
    "Production-grade web apps built solo — from concept to deployment. React, Next.js, Node.js, TypeScript. Open for full-time & contract roles.",
  keywords: [
    "Full Stack Developer",
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
    title: "Mateusz Goszczycki — Full Stack Engineer",
    description:
      "3 production apps shipped solo. Enterprise marketplace with real users & payments. React · Next.js · Node.js · TypeScript.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mateusz Goszczycki — Full Stack Engineer",
    description:
      "3 production apps shipped solo. Enterprise marketplace with real users & payments. React · Next.js · Node.js · TypeScript.",
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
