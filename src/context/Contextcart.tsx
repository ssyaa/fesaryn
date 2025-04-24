"use client"

// src/context/CartContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Cart item interface
interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

// Cart Context Interface
interface CartContextType {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  getCartItemCount: () => number;
}

// Default values untuk CartContext
const CartContext = createContext<CartContextType>({
  items: [],
  setItems: () => {},
  getCartItemCount: () => 0,
});

// CartProvider untuk menyediakan context
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Ambil data cart dari localStorage ketika aplikasi pertama kali dimuat
  useEffect(() => {
    const savedItems = localStorage.getItem("cart");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Fungsi untuk menyimpan data cart ke localStorage
  const saveToLocalStorage = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  // Update cart state dan localStorage ketika items berubah
  const updateItems = (newItems: CartItem[]) => {
    setItems(newItems);
    saveToLocalStorage(newItems);
  };

  // Fungsi untuk mendapatkan jumlah total item di cart
  const getCartItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ items, setItems: updateItems, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook untuk menggunakan CartContext
export const useCart = () => useContext(CartContext);
