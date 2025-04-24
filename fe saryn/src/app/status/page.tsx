"use client";

import Link from "next/link";

export default function BelumLogin() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
                <h2 className="text-2xl font-bold text-center mb-4">Belum Login?</h2>
                <p className="mb-4">Silakan login terlebih dahulu untuk mengakses halaman ini.</p>
                <Link href="/login">
                    <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Login
                    </button>
                </Link>
            </div>
        </div>
    );
}
