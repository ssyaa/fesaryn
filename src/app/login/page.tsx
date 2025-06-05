"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/api/login", {
                email,
                password,
            });

            // Sesuaikan dengan response backend kamu, biasanya token di response.data.access_token atau response.data.token
            const token = response.data.token || response.data.access_token;
            if (!token) throw new Error("Token tidak ditemukan dari server.");

            // Simpan token di cookies, expire 7 hari
            Cookies.set("user-token", token, { expires: 7, secure: true, sameSite: "lax" });

            // Redirect ke halaman home setelah login sukses
            router.push("/home");
        } catch (err: any) {
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
        <div
            className="relative flex min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/images/beranda.jpg')" }}
        >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />

            <div className="relative z-10 flex flex-1">
                <div className="w-1/2 flex items-center justify-center bg-white/40 backdrop-blur-md text-white p-8">
                    <h1 className="text-3xl font-semibold text-center tracking-widest">
                        Choose ur style <br />
                        with <span className="font-bold">@sarynthelebel</span>
                    </h1>
                </div>

                <div className="w-1/2 flex items-center justify-center p-8">
                    <div className="bg-white shadow-lg rounded-lg p-10 h-[600px] w-[500px]">
                        <img
                            src="/sarynlogo.png"
                            alt="Saryn Logo"
                            className="mx-auto mb-4 w-16 h-auto"
                        />
                        <h2 className="text-3xl font-bold text-left mb-3 mt-6">Login</h2>
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="block text-gray-700 tracking-wide">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-grey-300"
                                    placeholder="Insert your email.."
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 tracking-wide">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-grey-300"
                                    placeholder="Insert your password.."
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800"
                            >
                                Login
                            </button>
                        </form>
                        <p className="mt-4 text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-gray-900 hover:underline font-medium">
                                Register here!
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
