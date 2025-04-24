import Image from "next/image";

const categories = [
  { name: "abayas", image: "/images/abayas.jpg" },
  { name: "dress", image: "/images/dress.jpg" },
  { name: "shirt", image: "/images/shirt.jpg" },
];

const Categories = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white px-6">
      <h2 className="text-2xl font-semibold text-black mt-10 mb-10">Categories</h2>
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">
        {categories.map((category) => (
          <div
            key={category.name}
            className="relative w-40 h-20 rounded-2xl overflow-hidden group"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 150px, 160px"
            />
            <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-50 transition-opacity" />
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg capitalize">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
