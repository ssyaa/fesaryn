"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Profile from "../components/profile";
import Order from "../components/Order";

export default function UserPage() {
    const [activeTab, setActiveTab] = useState<"profile" | "order">("profile");

    return (
        <>
            <Navbar />

            <div className="max-w-6xl mx-auto p-6 mt-[100px]">
                {/* Tab Navigation */}
                <div className="relative flex border-b border-gray-300">
                    {["profile", "order"].map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <motion.button
                                key={tab}
                                className={`flex-1 px-4 py-2 font-semibold text-center transition-colors duration-200 ${
                                    isActive ? "text-black" : "text-gray-500"
                                }`}
                                onClick={() => setActiveTab(tab as "profile" | "order")}
                                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 20,
                                }}
                            >
                                {tab === "profile" ? "Profil" : "Order"}
                            </motion.button>
                        );
                    })}

                    {/* Animated Underline */}
                    <motion.div
                        layoutId="underline"
                        className="absolute bottom-0 left-0 h-0.5 bg-black"
                        initial={false}
                        animate={{
                            width: "50%",
                            x: activeTab === "profile" ? "0%" : "100%",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === "profile" && <Profile />}
                    {activeTab === "order" && <Order />}
                </div>
            </div>
        </>
    );
}
