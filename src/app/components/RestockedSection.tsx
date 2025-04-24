import React, { useState } from "react";
import Pagination from "./Pagination";
import { Product } from "../lib/types/Product";
import Image from "next/image";

interface RestockedSectionProps {
  products: Product[];
}

const PRODUCTS_PER_PAGE = 8;

const RestockedSection: React.FC<RestockedSectionProps> = ({ products }) => {
  const soldOutProducts = products.filter((product) => product.stock === 0);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = soldOutProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="bg-white px-6 md:px-16 py-12 text-black">
      <h2 className="text-2xl font-semibold mb-10">Soon on Restocked</h2>

      {soldOutProducts.length === 0 ? (
        <p className="text-gray-500">We still have all the products available 😊</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div key={product.id} className="relative text-center">
              <div className="aspect-[3/4] bg-gray-100 relative mb-2 border border-gray-200">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover opacity-50"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                    No image
                  </div>
                )}
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                  Sold Out
                </span>
              </div>
              <p className="text-sm font-medium text-black">/{product.name.toLowerCase()}</p>
              <p className="text-sm text-gray-600">Rp {product.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {soldOutProducts.length > PRODUCTS_PER_PAGE && (
        <div className="mt-10">
          <Pagination
            totalItems={soldOutProducts.length}
            itemsPerPage={PRODUCTS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default RestockedSection;