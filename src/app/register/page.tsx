"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as React from "react"

export default function Register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Password tidak cocok!");
            return;
        }

        try {
            await axios.post("/api/register", {
                name,
                username,
                email,
                password,
            });
  

            // Jika registrasi berhasil, simpan status login
            localStorage.setItem("isLoggedIn", "true");

            // Redirect ke halaman user
            router.push("/user");

        } catch (error) {
            // Menangani error jika terjadi
            if (axios.isAxiosError(error)) {
                setError("Terjadi kesalahan saat registrasi. Periksa kembali data yang dimasukkan.");
            } else {
                setError("Terjadi kesalahan jaringan.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="bg-white shadow-lg rounded-lg p-8 w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Nama</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan nama"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input 
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan username"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Konfirmasi Password</label>
                        <input 
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ulangi password"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
