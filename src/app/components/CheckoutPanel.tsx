"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authcontext";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

interface CheckoutPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    images: string[];
    quantity: number;
}

interface MidtransResult {
    [key: string]: unknown;
}

const CheckoutPanel: React.FC<CheckoutPanelProps> = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loginMessage, setLoginMessage] = useState("");
    const { isAuthenticated, token } = useAuth();
    const router = useRouter();
    const [isSnapReady, setIsSnapReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * (item.quantity || 1),
        0
    );

    const fetchCart = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8000/api/cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Gagal mengambil data cart");

            const data = await res.json();
            const mappedCart: CartItem[] = data.cart.map((item: {
                product: {
                    id: number;
                    name: string;
                    price: number;
                    image: string;
                };
                quantity: number;
            }) => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                images: [item.product.image],
                quantity: item.quantity,
            }));
            setCartItems(mappedCart);
        } catch (error) {
            console.error("Fetch cart error:", error);
            setCartItems([]);
        }
    }, [token]);

    useEffect(() => {
        if (!isOpen || !isAuthenticated) return;

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
    }, [isOpen, isAuthenticated, fetchCart]);

    const handleProceedToPayment = async () => {
        if (!isAuthenticated) {
            setLoginMessage("Silahkan login terlebih dahulu");
            return;
        }

        if (!isSnapReady || typeof window.snap === "undefined") {
            toast.error("Midtrans belum siap. Silakan tunggu beberapa detik dan coba lagi.");
            return;
        }

        if (isProcessing) return;
        setIsProcessing(true);

        try {
            const userRes = await axios.get("http://localhost:8000/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const user = userRes.data.user || userRes.data;
            const isComplete = user.name && user.address && user.phone && user.email;

            if (!isComplete) {
                toast.error("Lengkapi profil terlebih dahulu.");
                router.push("/user");
                return;
            }

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
            if (!orderId || isNaN(Number(orderId))) {
                toast.error("ID order tidak valid.");
                return;
            }

            const snapRes = await axios.post(
                "http://localhost:8000/api/midtrans/snap-token",
                {
                    order_id: Number(orderId),
                    amount: totalPrice,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const snapToken = snapRes.data.snap_token;

            window.snap.pay(snapToken, {
                onSuccess: (result) => {
                    const data = result as MidtransResult;
                    toast.success("Pembayaran berhasil!");
                    console.log("Success:", data);
                    handleCheckout();
                },
                onPending: (result) => {
                    const data = result as MidtransResult;
                    toast("Pembayaran sedang diproses...", { icon: "⏳" });
                    console.log("Pending:", data);
                },
                onError: (result) => {
                    const data = result as MidtransResult;
                    toast.error("Pembayaran gagal!");
                    console.error("Error:", data);
                },
                onClose: () => {
                    toast("Kamu menutup pembayaran.", { icon: "❌" });
                },
            });
        } catch (error) {
            console.error("Payment error:", error);
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                const msg = error.response.data?.message || "Data yang dikirim tidak valid.";
                toast.error(`Validasi gagal: ${msg}`);
            } else {
                toast.error("Terjadi kesalahan saat memproses pembayaran.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCheckout = async () => {
        try {
            const res = await axios.post(
                "http://localhost:8000/api/cart/checkout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Checkout berhasil!");
            setCartItems([]);
            router.push(`/payment/${res.data.order_id}`);
        } catch {
            toast.error("Gagal checkout");
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-40"
                        onClick={(e) => e.target === e.currentTarget && onClose()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </AnimatePresence>

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
                            <div className="relative w-12 h-12">
                                <Image
                                    src={
                                        item.images?.[0]
                                            ? `http://localhost:8000/storage/${item.images[0]}`
                                            : "/placeholder.jpg"
                                    }
                                    alt={item.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded"
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
