import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full h-screen flex items-center justify-center bg-white overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src="/images/beranda.jpg"
          alt="Hero Section"
          width={1920}
          height={1080}
          className="
            w-full
            h-auto
            max-h-[60vh]
            sm:max-h-full
            object-contain
          "
          priority
        />
      </div>
    </section>
  );
}
