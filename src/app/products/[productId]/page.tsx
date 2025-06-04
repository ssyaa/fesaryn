"use client";

import React, { useEffect, useState } from "react";
import { Product } from "../../lib/types/Product";
import { useParams } from "next/navigation";
import ProductDetail from "@/app/components/ProductDetail";
import RelatedProducts from "../../components/RelatedProducts";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil detail produk
        const res = await fetch(
          `http://localhost:8000/api/products/${productId}`
        );
        if (!res.ok) throw new Error("Failed to fetch product");
        const data: Product = await res.json();
        setProduct(data);

        // Ambil daftar produk untuk "You might like"
        const resAll = await fetch(`http://localhost:8000/api/products`);
        const all = await resAll.json();
        const list = all?.data || [];

        const formatted = list.map((item: any) => {
          const rawImages = Array.isArray(item.image)
            ? item.image
            : typeof item.image === "string"
            ? JSON.parse(item.image)
            : [];

          const images = rawImages.map((img: string) =>
            img.startsWith("http")
              ? img
              : `http://localhost:8000/storage/${img}`
          );

          return { ...item, images };
        });

        setRelatedProducts(
          formatted.filter((p: { id: number }) => p.id !== Number(productId))
        );
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
          categoryId: p.category_id, // 👈 tambahkan ini
        }))}
        currentProductId={product.id}
        currentCategoryId={product.category_id} // 👈 pastikan ini juga dikirim
      />
    </>
  );
};

export default ProductPage;
