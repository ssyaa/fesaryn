"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
    isLoggedIn: boolean;
    setLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    setLoggedIn: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
        const token = localStorage.getItem("user-token");
        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8000/api/user/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            if (response.status === 200) {
            setIsLoggedIn(true);
            } else {
            setIsLoggedIn(false);
            }
        } catch (err) {
            setIsLoggedIn(false);
        }
        };

        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setLoggedIn: setIsLoggedIn }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
