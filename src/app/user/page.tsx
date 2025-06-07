"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Profile from "../components/profile";
import Order from "../components/Order";

export default function UserPage() {
    const [activeTab, setActiveTab] = useState<"profile" | "order">("profile");

    return (
        <>
            <Navbar />

            <div className="max-w-6xl mx-auto p-6 mt-[100px]">
                <div className="flex border-gray-300">
                    <button
                        className={`flex-1 px-4 py-2 font-semibold text-center transition ${
                            activeTab === "profile"
                                ? "border-b-2 border-black text-black"
                                : "border-b border-gray-300 text-gray-500"
                        }`}
                        onClick={() => setActiveTab("profile")}
                    >
                        Profil
                    </button>
                    <button
                        className={`flex-1 px-4 py-2 font-semibold text-center transition ${
                            activeTab === "order"
                                ? "border-b-2 border-black text-black"
                                : "border-b border-gray-300 text-gray-500"
                        }`}
                        onClick={() => setActiveTab("order")}
                    >
                        Order
                    </button>
                </div>

                <div className="mt-6">
                    {activeTab === "profile" && <Profile />}
                    {activeTab === "order" && <Order />}
                </div>
            </div>
        </>
    );
}
