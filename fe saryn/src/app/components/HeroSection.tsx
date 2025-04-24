import React from "react";

export default function HeroSection() {
  return (
    <section className="w-full h-screen flex items-center justify-center bg-white overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <img 
          src="/images/beranda.jpg" 
          alt="Hero Section"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </section>
  );
}