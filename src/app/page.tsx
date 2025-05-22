// context/Authcontext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Buat tipe user (sesuaikan dengan data user dari backend Laravel kamu)
type User = {
  id: number;
  name: string;
  email: string;
  // tambahkan field lain kalau perlu
};

// Tipe untuk AuthContext
type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook untuk menggunakan context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
