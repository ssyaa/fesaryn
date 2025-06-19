'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!agree) {
      setError('Kamu harus menyetujui kebijakan privasi.')
      return
    }

    const userData = {
      name,
      username,
      email,
      password,
      password_confirmation: password,
    }

    localStorage.setItem('userRegisterData', JSON.stringify(userData))
    router.push('/register/address')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-white">
      <Link href="/" className="self-start mb-4 text-sm text-gray-500">&lt; BACK</Link>

      <div className="mb-8">
        <Image src="/sarynlogo.png" alt="Logo" className="h-12" />
      </div>

      <h1 className="text-2xl font-semibold mb-6">Detail Pribadi</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <input
          type="email"
          placeholder="Email"
          className="w-full border-b py-2 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Kata Sandi"
          className="w-full border-b py-2 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Nama"
          className="w-full border-b py-2 focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Username"
          className="w-full border-b py-2 focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mr-2"
          />
          Saya telah membaca dan memahami Kebijakan Privasi dan Cookie
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-black text-white font-medium hover:opacity-90 transition"
        >
          Make Account
        </button>
      </form>

      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>&copy; 2025 Sarynthelabel. All Rights Reserved.</p>
      </footer>
    </div>
  )
}
