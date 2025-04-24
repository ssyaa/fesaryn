// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipe data untuk user
interface User {
    name: string;
    username: string;
    email: string;
}

// Tipe data untuk context
interface AuthContextType {
    isLoggedIn: boolean;
    userData: User | null;
    login: (user: User) => void;
    logout: () => void;
}

// Membuat context default (null atau bisa disesuaikan)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Membuat provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userData, setUserData] = useState<User | null>(null);

    // Login function
    const login = (user: User) => {
        setIsLoggedIn(true);
        setUserData(user);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userData", JSON.stringify(user));
    };

    // Logout function
    const logout = () => {
        setIsLoggedIn(false);
        setUserData(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userData");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook untuk menggunakan context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
