"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetail from "@/app/components/ProductDetail";
import RelatedProducts from "../../components/RelatedProducts";

// ✅ Definisi tipe produk lokal
type Product = {
  id: string; // ← perbaikan utama di sini
  name: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
  category_id: number;
  details?: string[];
  image?: string[] | string;
};

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/products/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        const rawImages = Array.isArray(data.image)
          ? data.image
          : typeof data.image === "string"
          ? JSON.parse(data.image)
          : [];

        const images = rawImages.map((img: string) =>
          img.startsWith("http") ? img : `http://localhost:8000/storage/${img}`
        );

        const formattedProduct: Product = {
          ...data,
          id: String(data.id), // pastikan id-nya string
          images,
          details: data.details ?? [],
        };

        setProduct(formattedProduct);

        const resAll = await fetch(`http://localhost:8000/api/products`);
        const all = await resAll.json();
        const list = all?.data || [];

        const formattedList: Product[] = list.map((item: Partial<Product>) => {
        const rawImgs = Array.isArray(item.image)
          ? item.image
          : typeof item.image === "string"
          ? JSON.parse(item.image)
          : [];

        const imgs = rawImgs.map((img: string) =>
          img.startsWith("http") ? img : `http://localhost:8000/storage/${img}`
        );

        return {
          ...item,
          id: String(item.id),
          images: imgs,
        } as Product;
      });

        setRelatedProducts(formattedList.filter((p) => p.id !== String(productId)));
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <>
      <ProductDetail product={product} />
      <RelatedProducts
        products={relatedProducts.slice(0, 4).map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          imageUrl: p.images?.[0] || "",
          categoryId: p.category_id,
        }))}
        currentProductId={product.id}
        currentCategoryId={product.category_id}
      />
    </>
  );
};

export default ProductPage;
