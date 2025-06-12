"use client";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Categories from "../components/Categories";
import AvailableProducts from "../components/AvailableProducts";
import RestockedSection from "../components/RestockedSection";
import Footer from "../components/Footer";

export default function HomePage() {
    return (
        <>
        <Navbar />
        <HeroSection />
        <Categories />
        <AvailableProducts />
        <RestockedSection />
        <Footer />
        </>
    );
}
