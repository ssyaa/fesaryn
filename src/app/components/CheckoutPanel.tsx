"use client";

// Tambahkan deklarasi global agar TypeScript mengenali window.snap
declare global {
    interface Window {
        snap: {
            pay: (token: string, options: any) => void;
        };
    }
}

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Product } from "../lib/types/Product";
import { useRouter } from "next/navigation";
import axios from "axios";

interface CheckoutPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const CheckoutPanel: React.FC<CheckoutPanelProps> = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const router = useRouter();
    const [loginMessage, setLoginMessage] = useState("");

    useEffect(() => {
    // Ambil cart dari localStorage saat panel dibuka
    if (isOpen) {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(storedCart);
    }

    // Tambahkan script Snap Midtrans
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-elkGxR3Ncj-adVXz"); // Ganti dengan CLIENT KEY kamu dari Midtrans
    document.body.appendChild(script);

    return () => {
        document.body.removeChild(script); // Clean up saat komponen unmount
    };
}, [isOpen]);

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleProceedToPayment = async () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        if (!isLoggedIn) {
            setLoginMessage("Silahkan login terlebih dahulu");
            return;
        }

        try {
            const token = localStorage.getItem("user-token");
            const userResponse = await axios.get("http://localhost:8000/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userData = userResponse.data.user || userResponse.data;
            const isComplete = userData.name && userData.address && userData.phone;

            if (!isComplete) {
                router.push("/user");
                return;
            }

            // Create order first
            const orderResponse = await axios.post(
                "http://localhost:8000/api/order",
                {
                    items: cartItems,
                    total: totalPrice,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const orderId = orderResponse.data.id;

            // Get Snap token from backend
            const snapResponse = await axios.post(
                "http://localhost:8000/api/midtrans/token",
                { order_id: orderId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            window.snap.pay(snapResponse.data.token, {
                onSuccess: (result: any) => {
                    alert("Pembayaran sukses!");
                    console.log(result);
                },
                onPending: (result: any) => {
                    alert("Pembayaran pending!");
                    console.log(result);
                },
                onError: (result: any) => {
                    alert("Pembayaran gagal!");
                    console.log(result);
                },
            });
        } catch (error) {
            console.error("Payment Error:", error);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-40"
                        onClick={handleBackdropClick}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </AnimatePresence>

            {/* Checkout Panel */}
            <motion.div
                animate={{ x: isOpen ? 0 : "100%" }}
                transition={{ type: "tween", duration: 0.4 }}
                className="fixed top-0 right-0 h-full w-[400px] bg-white p-6 z-50 shadow-lg overflow-y-auto"
                style={{ transform: "translateX(100%)" }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-black">Checkout</h1>
                    <button
                        onClick={onClose}
                        className="text-black hover:text-red-500 transition text-sm"
                    >
                        Close
                    </button>
                </div>

                {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 mb-4">
                            <div className="relative">
                                <img
                                    src={item.images?.[0] || "/placeholder.jpg"}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                {item.quantity > 1 && (
                                    <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full">
                                        {item.quantity}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-semibold text-black">{item.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {item.quantity || 1} × Rp {item.price.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 mt-10">Your cart is empty.</div>
                )}

                <div className="flex gap-2 mt-6 mb-4">
                    <input
                        type="text"
                        placeholder="Discount code"
                        className="flex-1 border rounded px-3 py-2 text-sm"
                    />
                    <button className="bg-gray-800 text-white text-sm px-4 rounded hover:bg-gray-700 transition">
                        Apply
                    </button>
                </div>

                <div className="text-sm text-gray-600 space-y-2 mb-6">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>Rp {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Rp 0</span>
                    </div>
                </div>

                <hr className="mb-6" />

                <div className="flex justify-between font-bold text-black text-lg">
                    <span>Total</span>
                    <span>Rp {totalPrice.toLocaleString()}</span>
                </div>

                <button
                    onClick={handleProceedToPayment}
                    className="mt-6 w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
                >
                    Proceed to Payment
                </button>
            </motion.div>
        </>
    );
};

export default CheckoutPanel;
