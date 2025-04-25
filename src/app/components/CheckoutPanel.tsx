"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Product } from "../lib/types/Product";
import { useRouter } from "next/navigation";

interface CheckoutPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const CheckoutPanel: React.FC<CheckoutPanelProps> = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCartItems(storedCart);
        }
    }, [isOpen]);

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleProceedToPayment = () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        if (!isLoggedIn) {
            router.push("/status"); // Arahkan ke halaman status jika belum login
        } else {
            router.push("/payment"); // Ganti ke halaman pembayaran kamu
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
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-black">Checkout</h1>
                    <button
                        onClick={onClose}
                        className="text-black hover:text-red-500 transition text-sm"
                    >
                        Close
                    </button>
                </div>

                {/* Items */}
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
                    <div className="text-center text-gray-500 mt-10">
                        Your cart is empty.
                    </div>
                )}

                {/* Discount Input */}
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

                {/* Summary */}
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

                {/* Total */}
                <div className="flex justify-between font-bold text-black text-lg">
                    <span>Total</span>
                    <span>Rp {totalPrice.toLocaleString()}</span>
                </div>

                {/* Pay Button */}
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
