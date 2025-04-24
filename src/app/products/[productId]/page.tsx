"use client";

import React, { useEffect, useState } from "react";
import { Product } from "../../lib/types/Product";
import { useParams } from "next/navigation";
import ProductDetail from "@/app/components/ProductDetail";
import RelatedProducts from "../../components/RelatedProducts";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");

        const data: Product[] = await res.json();
        setProducts(data);

        const selected = data.find((p) => p.id.toString() === productId);
        setProduct(selected || null);
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
        products={products
          .filter((p) => p.id !== product.id)
          .slice(0, 4)
          .map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            imageUrl: p.images?.[0] || "",
          }))}
        currentProductId={product.id}
      />
    </>
  );
};

export default ProductPage;
