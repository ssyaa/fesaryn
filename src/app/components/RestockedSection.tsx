"use client";

import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import axios from "axios";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: string | number;
  stock: number;
}

interface RestockItem {
  id: number;
  notes: string;
  quantity: number;
  image: string | null;
  restocked_at: string;
  price: string | number;
  product: Product;
}

const PRODUCTS_PER_PAGE = 8;

const RestockedSection: React.FC = () => {
  const [restocks, setRestocks] = useState<RestockItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get<RestockItem[]>("https://admin.sarynthelabel.my.id/api/restockeds")
      .then((res) => {
        const formatted = res.data.map((item) => ({
          ...item,
          image: item.image
            ? `https://admin.sarynthelabel.my.id/api/storage/${item.image}`
            : null,
        }));
        setRestocks(formatted);
      })
      .catch((err) => console.error("Failed to fetch restock data", err));
  }, []);

  const soonProducts = restocks.filter((r) => r.quantity === 0);

  const indexOfLast = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirst = indexOfLast - PRODUCTS_PER_PAGE;
  const currentItems = soonProducts.slice(indexOfFirst, indexOfLast);

  return (
    <div className="bg-white px-6 md:px-16 py-12 text-black">
      <h2 className="text-2xl font-semibold mb-10">Soon on Restocked</h2>

      {soonProducts.length === 0 ? (
        <p className="text-gray-500">
          We still have all the products available 😊
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {currentItems.map((restock) => (
            <div key={restock.id} className="relative text-center">
              <div className="aspect-[3/4] bg-gray-100 relative mb-2 border border-gray-200">
                {restock.image ? (
                  <Image
                    src={restock.image}
                    alt={restock.product.name}
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
              <p className="text-sm font-medium text-black">
                {restock.product.name}
              </p>
              <p className="text-sm text-gray-600">
                Rp {Number(restock.price).toLocaleString("id-ID")}
              </p>
              <p className="text-sm italic text-gray-500">
                Restocked on{" "}
                {new Date(restock.restocked_at).toLocaleDateString("id-ID")}
              </p>
            </div>
          ))}
        </div>
      )}

      {soonProducts.length > PRODUCTS_PER_PAGE && (
        <div className="mt-10">
          <Pagination
            totalItems={soonProducts.length}
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
