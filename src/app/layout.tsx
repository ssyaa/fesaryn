"use client";

import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingOverlay from "./components/loadingOverlay";
import { AuthProvider } from "../context/Authcontext"; // <- Import contextnya

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
        <script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key="SB-Mid-client-elkGxR3Ncj-adVXz"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-white text-black" suppressHydrationWarning>
        <AuthProvider>
          <Suspense fallback={<LoadingOverlay />}>
            <main className="flex-grow">{children}</main>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
