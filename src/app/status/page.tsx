"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "../utils/axios";
import Image from "next/image";

export default function BelumLogin() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await axios.get("/user");
                if (response.status === 200) {
                    router.push("/user");
                }
            } catch {
                // user belum login, tetap di halaman ini
            } finally {
                setLoading(false);
            }
        };

        checkLogin();
    }, [router]);

    if (loading) return <div>Loading...</div>;

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

                <div className="w-1/2 flex items-center justify-center">
                    <div className="bg-white shadow-lg rounded-lg p-10 h-[300px] w-[500px] text-center">
                        <Image
                            src="/sarynlogo.png"
                            alt="Saryn Logo"
                            width={64}
                            height={64}
                            className="mx-auto mb-4"
                        />
                        <h2 className="text-3xl font-bold mb-4 mt-4">Not logged in?</h2>
                        <p className="text-gray-700 mb-6 text-base">
                            Please log in first to access this page.
                        </p>
                        <Link href="/login">
                            <button className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800">
                                Login
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
