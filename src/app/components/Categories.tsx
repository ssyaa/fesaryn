"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

// Define the category type
type Category = {
  name: string;
  image: string;
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call the API to fetch the categories
    axios
      .get("https://admin.sarynthelabel.my.id/api/categories")
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (categories.length === 0) {
    return <div>No categories available.</div>; // Display message if no categories are available
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-12 bg-white px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-black mt-6 sm:mt-10 mb-6 sm:mb-10">
        Categories
      </h2>
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">
        {categories.map((category) => (
          <div
            key={category.name}
            className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden group"
          >
            <Image
              src={category.image}
              alt={category.name}
              width={144}
              height={144}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-50 transition-opacity" />
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm sm:text-lg capitalize">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
