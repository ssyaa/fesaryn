"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link"; // Mengimpor Link untuk ke halaman register

axios.defaults.withCredentials = true;

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        // Mengecek status login saat halaman di-render
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/login");
                if (response.status === 200) {
                    router.replace("/");  // Jika sudah login, redirect ke halaman utama
                }
            } catch (err) {
                // Jika terjadi error (belum login), kita tidak perlu melakukan apa-apa
                console.log("User belum login atau terjadi kesalahan.", err);
            }
        };

        checkLoginStatus();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Reset error saat submit ulang

        try {
            // Mendapatkan CSRF token terlebih dahulu
            await axios.get("http://localhost:8000/sanctum/csrf-cookie");

            // Melakukan request login
            const loginResponse = await axios.post("http://localhost:8000/api/login", {
                email,
                password,
            });

            if (loginResponse.status === 200) {
                router.replace("/");  // Redirect ke halaman utama setelah login berhasil
            }
        } catch (err: any) {
            // Menangani error lebih spesifik berdasarkan jenis error
            if (err.response?.status === 401) {
                setError("Email atau password salah.");
            } else if (err.response) {
                setError(err.response.data?.message || "Login gagal, silakan coba lagi.");
            } else if (err.request) {
                setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
            } else {
                setError("Terjadi kesalahan, silakan coba lagi.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan email"
                            required
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
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>

                {/* Link ke halaman register */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Belum punya akun?{" "}
                    <Link href="/register" className="text-blue-500 hover:underline font-medium">
                        Daftar di sini
                    </Link>
                </p>
            </div>
        </div>
    );
}
