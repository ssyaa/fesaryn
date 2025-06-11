import React from "react";

export default function HeroSection() {
  return (
    <section className="w-full h-screen flex items-center justify-center bg-white overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <img 
          src="/images/beranda.jpg" 
          alt="Hero Section"
          className="
            w-full               // mobile: penuh
            h-auto              // mobile: tinggi otomatis
            max-h-[60vh]        // mobile: batasi tinggi
            sm:max-h-full       // PC: tetap full (tidak berubah)
            object-contain
          "
        />
      </div>
    </section>
  );
}
