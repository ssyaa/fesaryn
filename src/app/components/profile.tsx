"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authcontext"; // pastikan path ini sesuai

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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


  const router = useRouter();
  const { setLoggedIn } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Maaf, token tidak ditemukan.");
      setLoggedIn(false);
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedUser = res.data.user || res.data;

        if (!fetchedUser || Object.keys(fetchedUser).length === 0) {
          setError("Pengguna tidak ditemukan.");
          return;
        }

        setUser(fetchedUser);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Maaf, token expired.");
          localStorage.removeItem("token");
          setLoggedIn(false);
          router.push("/login");
        } else {
          setError("Maaf, data tidak berhasil diambil.");
        }
      }
    };

    fetchUserData();
  }, [setLoggedIn, router]);

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

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token tidak ditemukan, silakan login ulang.");
      setLoggedIn(false);
      router.push("/login");
      return;
    }

    try {
      const updateData = { ...user };
      if (newPassword.trim() !== "") {
        updateData.password = newPassword;
      }

      await axios.put("http://localhost:8000/api/user/profile", updateData, {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/login");
  };

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 bg-red-100 p-4 rounded">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Memuat data pengguna...
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto mt-6 bg-white shadow-md rounded-md p-10">
      {error && <div className="text-red-600 bg-red-100 p-4 rounded">{error}</div>}
      {successMessage && (
        <div className="text-green-600 bg-green-100 p-4 rounded">{successMessage}</div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-2">Apakah Anda ingin logout?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Setelah logout, Anda masih bisa login kembali.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Ya
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
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
                <p className="text-gray-500">{user[field as keyof User]}</p>
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
          <button className="text-gray-500 hover:underline" onClick={handleUpdate}>
            Simpan
          </button>
        ) : (
          <button className="text-gray-500 hover:underline" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
        <button
          className="text-gray-500 hover:underline"
          onClick={() => setShowLogoutConfirm(true)}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
