"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Pagination from "./Pagination";
import { Product } from "../lib/types/Product";
import Image from "next/image";

const PRODUCTS_PER_PAGE = 8;

export default function AvailableProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();

        if (Array.isArray(data?.data)) {
          const formatted = data.data.map((product: any) => {
            // console.log("RAW IMAGE VALUE:", product.image);
            let rawImages = [];

            if (typeof product.image === "string") {
              try {
                rawImages = JSON.parse(product.image);
              } catch (e) {
                console.error(
                  "Image is not a valid JSON array string:",
                  product.image
                );
              }
            } else if (Array.isArray(product.image)) {
              rawImages = product.image;
            }

            const images = rawImages.map((imgPath: string) =>
              imgPath.startsWith("http")
                ? imgPath
                : `http://127.0.0.1:8000/storage/${imgPath}`
            );

            return {
              ...product,
              images,
            };
          });

          // const formatted = data.data.map((product: any) => {
          //   const imagePath = product.images?.[0] || product.image || null;
          //   const imageUrl = imagePath
          //     ? imagePath.startsWith("http")
          //       ? imagePath
          //       : `http://127.0.0.1:8000/storage/${imagePath}`
          //     : null;

          //   return {
          //     ...product,
          //     imageUrl,
          //   };
          // });

          setProducts(formatted);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const availableProducts = useMemo(
    () => products.filter((product) => product?.stock > 0),
    [products]
  );

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
      <h2 className="text-2xl font-semibold mb-10">Available Products</h2>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : availableProducts.length === 0 ? (
        <p className="text-gray-500">
          No products available yet, but they&apos;re coming ☺🙌🏻
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="cursor-pointer">
                  <div className="aspect-[3/4] bg-gray-100 relative mb-2 border border-gray-200 group overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}

                    {/* {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized // only use this in development
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )} */}

                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <p className="text-white text-sm font-semibold">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-black">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </p>
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
