"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Profile from "../components/profile";
import Order from "../components/Order";

export default function UserPage() {
    const [activeTab, setActiveTab] = useState<"profile" | "order">("profile");

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError("");
                const token = localStorage.getItem("user-token");
                const response = await axios.get("http://localhost:8000/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data.user || response.data);
            } catch (err: any) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        setError("Token tidak valid atau sudah kadaluarsa. Silakan login ulang.");
                    } else {
                        setError("Gagal memuat data user.");
                    }
                } else {
                    setError("Gagal memuat data user.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

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
                    {loading && <p>Loading user data...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {!loading && !error && activeTab === "profile" && <Profile user={user} />}
                    {!loading && !error && activeTab === "order" && <Order />}
                </div>
            </div>
        </>
    );
}
