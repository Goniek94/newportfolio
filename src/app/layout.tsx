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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: "Mateusz Goszczycki — Full Stack Engineer",
  description:
    "Full Stack Engineer building production-ready web apps from concept to deployment. React, Next.js, Node.js, TypeScript.",
  keywords: [
    "Full Stack Engineer",
    "Full Stack Engineer",
    "React Developer",
    "Next.js Developer",
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
      "Full Stack Engineer. Built and shipped 3 production apps — one for a paying client (autosell.pl). React · Next.js · Node.js · TypeScript.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mateusz Goszczycki — Full Stack Engineer",
    description:
      "Full Stack Engineer. Built and shipped 3 production apps — one for a paying client (autosell.pl). React · Next.js · Node.js · TypeScript.",
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
