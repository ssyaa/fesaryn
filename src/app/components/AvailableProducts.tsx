"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Pagination from "./Pagination";
import { Product } from "../lib/types/Product";
import Image from "next/image";

interface AvailableProductsProps {
  products: Product[];
}

const PRODUCTS_PER_PAGE = 8;

export default function AvailableProducts({ products }: AvailableProductsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const availableProducts = useMemo(() => {
    return products.filter((product) => product.stock > 0);
  }, [products]);

  useEffect(() => {
    setCurrentPage(1);
  }, [availableProducts.length]);

  const totalPages = Math.ceil(availableProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return availableProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [availableProducts, currentPage]);

  return (
    <div className="bg-white px-6 md:px-16 py-12 text-black items-center">
      <h2 className="text-2xl font-semibold mb-10">Available</h2>
      {availableProducts.length === 0 ? (
        <p className="text-gray-500">
        No products available yet, but they&apos;re coming ☺️🙌🏻
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="cursor-pointer">
                  <div className="aspect-[3/4] bg-gray-100 relative mb-2 border border-gray-200">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-black">/{product.name.toLowerCase()}</p>
                  <p className="text-sm text-gray-600">Rp {product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                totalItems={availableProducts.length}
                itemsPerPage={PRODUCTS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
