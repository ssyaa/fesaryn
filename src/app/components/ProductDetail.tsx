"use client";

import { FC, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";
import { AuthContext } from "../../context/Authcontext"; // ⬅️ pastikan path ini benar

// ⬇️ Tipe Product didefinisikan langsung di sini, bukan dari lib
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  images: string[]; // Sudah diolah jadi array dari Laravel
  category_id: number;
  details?: string[]; // <- Disamakan
}

interface ProductDetailProps {
  product: Product | null;
}

const ProductDetail: FC<ProductDetailProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [buttonText, setButtonText] = useState("Order");
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useContext(AuthContext); // Ambil user dan token dari context

  if (!product) return <div>Loading...</div>;

  const handleOrder = async () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk memesan.");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setButtonText("Add to Cart...");

    try {
      const response = await fetch("https://admin.sarynthelabel.my.id/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      if (!response.ok) throw new Error("Gagal menambahkan ke keranjang");

      setButtonText("Success");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menambahkan ke cart.");
      setButtonText("Order");
    } finally {
      setTimeout(() => {
        setButtonText("Order");
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen bg-white px-6 md:px-16 pt-22 text-black">
        {/* Gambar produk dan thumbnail */}
        <div className="flex flex-col md:w-1/2">
          <Link href="/home" className="text-sm text-gray-500 mb-4 hover:underline w-fit">
            &lt; BACK
          </Link>

          <div className="flex">
            <div
              className="flex flex-col gap-3 mr-4 overflow-y-auto max-h-[800px]"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {product.images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  width={100}
                  height={120}
                  className={`cursor-pointer border ${
                    selectedImage === idx ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>

            <div className="flex justify-center items-center w-full">
              <Image
                src={product.images[selectedImage]}
                alt="Main product"
                width={600}
                height={800}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Detail produk */}
        <div className="md:w-1/2 px-6 md:px-10 mt-12 flex flex-col justify-start">
          <h1 className="text-4xl font-bold mb-1">{product.name}</h1>
          <p className="text-base text-gray-500 mb-2">
            Rp {Number(product.price).toLocaleString()} ・ {product.stock} left
          </p>

          <hr className="my-3 border-gray-300" />

          <h2 className="text-sm text-gray-400 tracking-widest font-medium mt-1 mb-2">
            PRODUCT DETAIL
          </h2>

          <p className="text-sm text-gray-700 mb-4 whitespace-pre-line leading-relaxed">
            {product.description}
          </p>

          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mb-10">
            {product.details?.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>

          <div className="flex gap-2">
            <button
              className="bg-black text-white text-xl font-semibold py-2 w-[300px] hover:bg-gray-900 transition"
              onClick={handleOrder}
              disabled={isLoading}
            >
              {buttonText}
            </button>

            <button className="bg-black text-white w-[48px] py-3 text-xl font-bold hover:bg-gray-900 transition">
              +
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
