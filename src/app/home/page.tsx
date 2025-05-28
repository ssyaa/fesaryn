"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Categories from "../components/Categories";
import AvailableProducts from "../components/AvailableProducts";
import RestockedSection from "../components/RestockedSection";
import Footer from "../components/Footer";
import { Product } from "../lib/types/Product";
import axios from "../utils/axios";

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("/products");
                const data = res.data?.products || []; // <-- jika undefined, fallback ke array kosong
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]); // jaga-jaga fallback
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const availableProducts = products?.filter((p) => p.stock > 0) || [];
    const restockedProducts = products?.filter((p) => p.stock === 0) || [];

    return (
        <>
            <Navbar />
            <HeroSection />
            <Categories />
            <AvailableProducts products={availableProducts} />
            <RestockedSection products={restockedProducts} />
            <Footer />
        </>
    );
}
