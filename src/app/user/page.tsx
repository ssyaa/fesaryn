"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<{ name: string; username: string; email: string } | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const isLoggedInStatus = localStorage.getItem("isLoggedIn");
        const userInfo = localStorage.getItem("userData");

        if (isLoggedInStatus && userInfo) {
            setIsLoggedIn(true);
            setUserData(JSON.parse(userInfo)); // Simpan data user ke state
        } else {
            setIsLoggedIn(false);
            router.push("/login"); // Arahkan ke halaman login jika belum login
        }
    }, [router]);

    if (!isLoggedIn) {
        return null; // Tidak menampilkan apapun jika pengguna belum login dan sudah diarahkan ke login
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Selamat Anda Berhasil Login</h2>
                <p><strong>Nama:</strong> {userData?.name}</p>
                <p><strong>Username:</strong> {userData?.username}</p>
                <p><strong>Email:</strong> {userData?.email}</p>
            </div>
        </div>
    );
}
