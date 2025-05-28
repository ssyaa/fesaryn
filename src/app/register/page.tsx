"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
    const [name, setName] = useState("");
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
                email,
                password,
            });

            localStorage.setItem("isLoggedIn", "true");
            router.push("/user");

        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError("Terjadi kesalahan saat registrasi. Periksa kembali data yang dimasukkan.");
            } else {
                setError("Terjadi kesalahan jaringan.");
            }
        }
    };

    return (
        <div
            className="relative flex min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/images/beranda.jpg')" }}
        >
            {/* Overlay blur */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />

            {/* Layout kiri kanan */}
            <div className="relative z-10 flex flex-1">
                {/* Kotak kiri */}
                <div className="w-1/2 flex items-center justify-center bg-white/40 backdrop-blur-md text-white p-8">
                    <h1 className="text-3xl font-semibold text-center tracking-widest">
                        Choose ur style <br />
                        with <span className="font-bold">@sarynthelebel</span>
                    </h1>
                </div>

                {/* Kotak kanan */}
                <div className="w-1/2 flex items-center justify-center p-2">
                    <div className="bg-white shadow-lg rounded-lg p-10 h-[700px] w-[500px]">
                        <Image
                            src="/sarynlogo.png"
                            alt="Saryn Logo"
                            width={64}
                            height={64}
                            className="mx-auto mb-4"
                        />
                        <h2 className="text-3xl font-bold text-left mb-3 mt-6">Register</h2>
                        <form onSubmit={handleRegister}>
                            <div className="mb-2">
                                <label className="block text-gray-700 tracking-wide">Nama</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-grey-300"
                                    placeholder="Insert your name.."
                                    required
                                />
                            </div>
                            <div className="mb-2">
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
                            <div className="mb-2">
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
                            <div className="mb-2">
                                <label className="block text-gray-700 tracking-wide">Konfirmasi Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-grey-300"
                                    placeholder="Repeat your password.."
                                    required
                                />
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800"
                            >
                                Register
                            </button>
                        </form>
                        <p className="mt-4 text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/login" className="text-gray-900 hover:underline font-medium">
                                Login here!
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
