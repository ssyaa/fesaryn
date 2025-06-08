"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Product } from "../lib/types/Product";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authcontext";
import axios from "axios";

interface CheckoutPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const CheckoutPanel: React.FC<CheckoutPanelProps> = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [loginMessage, setLoginMessage] = useState("");
    const { isAuthenticated, token } = useAuth();
    const router = useRouter();
    const [isSnapReady, setIsSnapReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!isOpen || !isAuthenticated) return;

        const fetchCart = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/cart", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) throw new Error("Gagal mengambil data cart");

                const data = await res.json();
                const mappedCart = data.cart.map((item: any) => ({
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    images: item.product.images,
                    quantity: item.quantity,
                }));
                setCartItems(mappedCart);
            } catch (err) {
                console.error("Fetch cart error:", err);
                setCartItems([]);
            }
        };

        fetchCart();

        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", "SB-Mid-client-elkGxR3Ncj-adVXz");
        script.onload = () => setIsSnapReady(true);
        script.onerror = () => console.error("Gagal memuat script Midtrans Snap.");
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
            setIsSnapReady(false);
        };
    }, [isOpen, isAuthenticated, token]);

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * (item.quantity || 1),
        0
    );

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleProceedToPayment = async () => {
        if (!isAuthenticated) {
            setLoginMessage("Silahkan login terlebih dahulu");
            return;
        }

        if (!isSnapReady || !window.snap) {
            alert("Midtrans belum siap. Silakan tunggu beberapa detik dan coba lagi.");
            return;
        }

        if (isProcessing) return;
        setIsProcessing(true);

        try {
            // Ambil data user
            const userResponse = await axios.get("http://localhost:8000/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const user = userResponse.data.user || userResponse.data;

            const isComplete = user.name && user.address && user.phone && user.email;
            if (!isComplete) {
                router.push("/user");
                return;
            }

            // Step 1: Buat order
            const orderRes = await axios.post(
                "http://localhost:8000/api/order",
                {
                    items: cartItems,
                    total: totalPrice,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const orderId = orderRes.data.id || orderRes.data.order_id;

            // Step 2: Minta snap token
            const snapRes = await axios.post(
                "http://localhost:8000/api/midtrans/snap-token",
                {
                    amount: totalPrice,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    order_id: orderId.toString(),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const snapToken = snapRes.data.snap_token;

            // Step 3: Bayar pakai Snap
            window.snap.pay(snapToken, {
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
            console.error("Payment error:", error);
            alert("Terjadi kesalahan saat memproses pembayaran.");
        } finally {
            setIsProcessing(false);
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

                <div className="text-sm text-gray-600 space-y-2 mb-6 mt-6">
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
                    className={`mt-6 w-full py-3 rounded transition ${
                        isProcessing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800"
                    }`}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Processing..." : "Proceed to Payment"}
                </button>

                {loginMessage && (
                    <p className="text-red-500 text-sm text-center mt-4">{loginMessage}</p>
                )}
            </motion.div>
        </>
    );
};

export default CheckoutPanel;
