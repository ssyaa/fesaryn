"use client";

import { useEffect, useState } from "react";
import ProductDetail from "./ProductDetail/page";
import { CartProvider } from "../context/Contextcart";
import { AuthProvider } from "../context/Authcontext";
import Navbar from "../app/components/Navbar";
import HeroSection from "../app/components/HeroSection";
import Categories from "../app/components/Categories";
import AvailableProducts from "../app/components/AvailableProducts";
import RestockedSection from "./RestockedSection/page";
import Footer from "../app/components/Footer";
import { Product } from "../app/lib/types/Product";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const availableProducts = products.filter(p => p.stock > 0);
  const restockedProducts = products.filter(p => p.stock === 0);

  return (
    <AuthProvider>
      <CartProvider>
        <>
          <Navbar />
          <HeroSection />
          <Categories />
          <AvailableProducts products={availableProducts} />
          <RestockedSection products={restockedProducts} />
          
          {/* Add ProductDetail to render the first product */}
          {products.length > 0 && <ProductDetail product={products[0]} />}

          <Footer />
        </>
      </CartProvider>
    </AuthProvider>
  );
}
