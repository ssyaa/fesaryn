"use client";

import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingOverlay from "./components/loadingOverlay";

// Load font dengan CSS variable
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sarynthelabel</title>
      </head>
      <body className="flex flex-col min-h-screen bg-white text-black" suppressHydrationWarning>
        <Suspense fallback={<LoadingOverlay />}>
          <main className="flex-grow">{children}</main>
        </Suspense>
      </body>
    </html>
  );
}
