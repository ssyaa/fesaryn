"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  email: string;
  name: string;
  phone: string;
  address: string;
  province?: string;
  city?: string;
  subcity?: string;
  postalcode?: string;
  password?: string;
}

interface ProfileProps {
  onUserUpdate?: (updatedUser: User) => void;
}

export default function Profile({ onUserUpdate }: ProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("user-token") : null;

  // Ambil data user saat login
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setError("Token tidak ditemukan, silakan login ulang.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err: any) {
        setError("Gagal mengambil data user. Silakan login ulang.");
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof User
  ) => {
    if (!user) return;
    setUser({ ...user, [field]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!user) return;

    setError(null);
    setSuccessMessage(null);

    if (!token) {
      setError("Token tidak ditemukan, silakan login ulang.");
      return;
    }

    try {
      const updateData = { ...user };
      if (newPassword.trim() !== "") {
        updateData.password = newPassword;
      }

      await axios.put("http://localhost:8000/api/user", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage("Data berhasil diperbarui.");
      setIsEditing(false);
      setNewPassword("");

      if (onUserUpdate) {
        onUserUpdate(updateData);
      }
    } catch (err: any) {
      setError("Gagal memperbarui data. Periksa kembali data yang diisi.");
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-500">Memuat data pengguna...</div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto mt-6 bg-white shadow-md rounded-md p-10">
      {error && <div className="text-red-600 bg-red-100 p-4 rounded">{error}</div>}
      {successMessage && (
        <div className="text-green-600 bg-green-100 p-4 rounded">{successMessage}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kiri */}
        <div className="space-y-4">
          {[
            { label: "Email", field: "email" },
            { label: "Kata Sandi", field: "password" },
            { label: "Nama", field: "name" },
            { label: "Nomor Telepon", field: "phone" },
          ].map(({ label, field }) => (
            <div key={field}>
              <span className="text-gray-400">{label}</span>
              {isEditing ? (
                <input
                  type={field === "password" ? "password" : "text"}
                  className="block w-full border rounded p-2"
                  value={user[field as keyof User] || ""}
                  onChange={(e) => handleChange(e, field as keyof User)}
                />
              ) : (
                <p className="text-gray-500">
                  {field === "password"
                    ? "•".repeat(8)
                    : user[field as keyof User]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Kanan */}
        <div className="space-y-4">
          {[
            { label: "Alamat", field: "address" },
            { label: "Provinsi", field: "province" },
            { label: "Kota/Kabupaten", field: "city" },
            { label: "Kecamatan", field: "subcity" },
            { label: "Kode Pos", field: "postalcode" },
          ].map(({ label, field }) => (
            <div key={field}>
              <span className="text-gray-400">{label}</span>
              {isEditing ? (
                <input
                  type="text"
                  className="block w-full border rounded p-2"
                  value={user[field as keyof User] || ""}
                  onChange={(e) => handleChange(e, field as keyof User)}
                />
              ) : (
                <p className="text-black">{user[field as keyof User]}</p>
              )}
            </div>
          ))}

          {isEditing && (
            <div>
              <span className="text-gray-400">Kata Sandi Baru (Opsional)</span>
              <input
                type="password"
                className="block w-full border rounded p-2"
                placeholder="Kosongkan jika tidak ingin mengubah"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        {isEditing ? (
          <button className="text-green-600 hover:underline" onClick={handleUpdate}>
            ✅ Simpan
          </button>
        ) : (
          <button className="text-blue-600 hover:underline" onClick={() => setIsEditing(true)}>
            ✏️ Edit
          </button>
        )}
        <button className="text-red-600 hover:underline">🗑️ Hapus Akun</button>
      </div>
    </div>
  );
}
