'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Definisikan tipe userData supaya TypeScript paham itu object
interface UserData {
    email: string
    password: string
    name: string
    username: string
}

export default function RegisterAddressPage() {
    const [address, setAddress] = useState('')
    const [province, setProvince] = useState('')
    const [city, setCity] = useState('')
    const [subcity, setSubcity] = useState('')
    const [postalcode, setPostalcode] = useState('')
    const [phone, setPhone] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    // userData bertipe UserData atau null
    const [userData, setUserData] = useState<UserData | null>(null)

    useEffect(() => {
        const data = localStorage.getItem('userRegisterData')
        if (data) {
        setUserData(JSON.parse(data))
        } else {
        router.push('/register') // kalau gak ada data, balik ke register
        }
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!userData) {
        setError('Data pengguna tidak ditemukan. Silakan daftar ulang.')
        return
        }

        // Spread userData yang sudah pasti object
        const postData = {
        ...userData,
        address,
        province,
        city,
        subcity,
        postalcode,
        phone,
        }

        try {
        const res = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        })

        if (res.ok) {
            localStorage.removeItem('userRegisterData')
            router.push('/login')
        } else {
            const data = await res.json()
            setError(data.message || 'Terjadi kesalahan saat registrasi.')
        }
        } catch {
        setError('Gagal menghubungi server.')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-white">
        <h1 className="text-2xl font-semibold mb-6">Alamat dan Kontak</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <input
            type="text"
            placeholder="Alamat"
            className="w-full border-b py-2 focus:outline-none"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            />

            <input
            type="text"
            placeholder="Provinsi"
            className="w-full border-b py-2 focus:outline-none"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            required
            />

            <input
            type="text"
            placeholder="Kota"
            className="w-full border-b py-2 focus:outline-none"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            />

            <input
            type="text"
            placeholder="Kecamatan"
            className="w-full border-b py-2 focus:outline-none"
            value={subcity}
            onChange={(e) => setSubcity(e.target.value)}
            required
            />

            <input
            type="text"
            placeholder="Kode Pos"
            className="w-full border-b py-2 focus:outline-none"
            value={postalcode}
            onChange={(e) => setPostalcode(e.target.value)}
            required
            />

            <input
            type="text"
            placeholder="Nomor Telepon"
            className="w-full border-b py-2 focus:outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
            type="submit"
            className="w-full py-2 bg-black text-white font-medium hover:opacity-90 transition"
            >
            Daftar Sekarang
            </button>
        </form>
        </div>
    )
}
