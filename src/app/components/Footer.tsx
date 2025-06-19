"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t w-full">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-6 relative">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Image src="/sarynlogo.png" alt="Logo" width={32} height={32} />
          <span className="text-lg font-semibold text-black">sarynthelebel</span>
        </div>

        {/* Center: Navigation */}
        <nav className="flex space-x-6 text-black text-sm font-medium mb-4 md:mb-0 md:absolute md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2">
          <Link href="/about" className="hover:underline">About</Link>
        </nav>

        {/* Right: Social icons */}
        <div className="flex space-x-6">
          <Image src="/instagram.svg" alt="Instagram" width={24} height={24} className="cursor-pointer" />
          <Image src="/gmail.svg" alt="Gmail" width={24} height={24} className="cursor-pointer" />
        </div>
      </div>

      <div className="py-2 bg-gray-100 w-full text-center">
        <p className="text-gray-500 text-xs">© 2025 Sarynthelebel. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
