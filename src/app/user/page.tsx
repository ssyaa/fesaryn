"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UserPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; username: string; email: string } | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // Untuk menampilkan loading saat fetch data

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token"); // Mengambil token dari localStorage

            if (!token) {
                setIsLoggedIn(false);
                router.push("/status"); // Arahkan ke /status jika token tidak ada
                return;
            }

            try {
                const response = await axios.get("http://localhost:8000/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Menambahkan token ke header
                    },
                });
            
                setUser(response.data);
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Gagal fetch user data:", error); // Tambahin ini
                setIsLoggedIn(false);
                router.push("/status");
            } finally {
                setLoading(false);
            }
            
        };

        fetchUserData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token"); // Menghapus token dari localStorage
        setIsLoggedIn(false);
        router.push("/status"); // Arahkan ke halaman /status setelah logout
    };

    if (loading) {
        return <div>Loading...</div>; // Menampilkan loading sementara data sedang dimuat
    }

    if (!isLoggedIn || !user) {
        return null; // Tidak menampilkan apa-apa jika pengguna belum login atau data kosong
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Selamat Anda Berhasil Login</h2>
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 text-left">Nama</th>
                            <th className="py-2 px-4 text-left">Username</th>
                            <th className="py-2 px-4 text-left">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-2 px-4">{user.name}</td>
                            <td className="py-2 px-4">{user.username}</td>
                            <td className="py-2 px-4">{user.email}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
