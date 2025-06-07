"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
    id: number;
    email: string;
    name: string;
    phone: string;
    address: string;
    province?: string;
    city?: string;
    subcity?: string;
    postalcode?: string;
    password?: string;
  // Sesuaikan field lain jika ada
}

interface CartItem {
    id: number; // id cart item di backend
    product_id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        // bisa ditambah properti produk lainnya
    };
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    cartItems: CartItem[];
    login: (token: string) => Promise<void>;
    logout: () => void;
    refreshToken?: () => Promise<void>;
    setLoggedIn: (status: boolean) => void;
    fetchCart: () => Promise<void>;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
    removeCartItem: (cartItemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    cartItems: [],
    login: async () => {},
    logout: () => {},
    setLoggedIn: () => {},
    fetchCart: async () => {},
    addToCart: async () => {},
    updateCartItem: async () => {},
    removeCartItem: async () => {},
    clearCart: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Setup axios default headers kalau token ada
    useEffect(() => {
        if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
        delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    // Fetch cart items dari backend
    const fetchCart = async () => {
        if (!token) return;
        try {
        const response = await axios.get("http://localhost:8000/api/cart");
        setCartItems(response.data.cartItems || []);
        } catch (error) {
        console.error("Gagal fetch cart:", error);
        setCartItems([]);
        }
    };

    // Inisialisasi auth dan cart saat mount
    useEffect(() => {
        const initializeAuth = async () => {
        setIsLoading(true);
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            setUser(null);
            setToken(null);
            setLoggedIn(false);
            setCartItems([]);
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8000/api/user/profile", {
            headers: {
                Authorization: `Bearer ${storedToken}`,
            },
            });

            const fetchedUser: User = response.data.user || response.data;

            if (!fetchedUser || Object.keys(fetchedUser).length === 0) {
            setUser(null);
            setToken(null);
            setLoggedIn(false);
            localStorage.removeItem("token");
            setCartItems([]);
            } else {
            setUser(fetchedUser);
            setToken(storedToken);
            setLoggedIn(true);
            await fetchCart();
            }
        } catch (error) {
            setUser(null);
            setToken(null);
            setLoggedIn(false);
            localStorage.removeItem("token");
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
        };

        initializeAuth();
    }, []);

    const login = async (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setIsLoading(true);

        try {
        const response = await axios.get("http://localhost:8000/api/user/profile", {
            headers: {
            Authorization: `Bearer ${newToken}`,
            },
        });

        const fetchedUser: User = response.data.user || response.data;

        if (!fetchedUser || Object.keys(fetchedUser).length === 0) {
            setUser(null);
            setToken(null);
            setLoggedIn(false);
            localStorage.removeItem("token");
            setCartItems([]);
        } else {
            setUser(fetchedUser);
            setLoggedIn(true);
            await fetchCart();
        }
        } catch (error) {
        setUser(null);
        setToken(null);
        setLoggedIn(false);
        localStorage.removeItem("token");
        setCartItems([]);
        } finally {
        setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setLoggedIn(false);
        localStorage.removeItem("token");
        setCartItems([]);
    };

    // Tambah item ke cart via API
    const addToCart = async (productId: number, quantity: number = 1) => {
        if (!token) return;
        try {
        const response = await axios.post("http://localhost:8000/api/cart", {
            product_id: productId,
            quantity,
        });
        // Update cart items setelah tambah
        await fetchCart();
        } catch (error) {
        console.error("Gagal tambah cart:", error);
        }
    };

    // Update quantity item cart
    const updateCartItem = async (cartItemId: number, quantity: number) => {
        if (!token) return;
        try {
        await axios.put(`http://localhost:8000/api/cart/${cartItemId}`, {
            quantity,
        });
        await fetchCart();
        } catch (error) {
        console.error("Gagal update cart item:", error);
        }
    };

    // Hapus item dari cart
    const removeCartItem = async (cartItemId: number) => {
        if (!token) return;
        try {
        await axios.delete(`http://localhost:8000/api/cart/${cartItemId}`);
        await fetchCart();
        } catch (error) {
        console.error("Gagal hapus cart item:", error);
        }
    };

    // Kosongkan cart, misal setelah checkout atau logout
    const clearCart = async () => {
        if (!token) return;
        try {
        await axios.post("http://localhost:8000/api/cart/clear");
        setCartItems([]);
        } catch (error) {
        console.error("Gagal clear cart:", error);
        }
    };

    const refreshToken = async () => {
        // Kalau nanti mau support refresh token, isi di sini
        console.log("Refreshing token...");
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            token,
            isAuthenticated: loggedIn,
            isLoading,
            cartItems,
            login,
            logout,
            refreshToken,
            setLoggedIn,
            fetchCart,
            addToCart,
            updateCartItem,
            removeCartItem,
            clearCart,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
