"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Order() {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchOrder = async () => {
        try {
            const token = localStorage.getItem("user-token");
            const response = await axios.get("http://localhost:8000/api/shipment", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            setOrder(response.data);
        } catch (err) {
            setError("Gagal memuat data pesanan.");
        } finally {
            setLoading(false);
        }
    };

    fetchOrder();
  }, []);

  if (loading) return <p className="text-gray-500">Memuat data pesanan...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p className="text-gray-500">Belum ada data pesanan.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md border-t-4 border-black overflow-hidden">
        <div className="bg-black text-white px-4 py-2 text-sm font-semibold truncate">
          OrderID {order.orderId}
        </div>
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-start">
            <span className="font-semibold text-sm w-32">Tanggal Pesanan</span>
            <span className="text-sm text-gray-700">{order.createdAt}</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold text-sm w-32">Estimasi Sampai</span>
            <span className="text-sm text-gray-700">{order.estimatedDelivery}</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold text-sm w-32">Status</span>
            <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper fungsi buat warna status
function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
        case "paid":
        case "settlement":
        return "text-green-600";
        case "pending":
        return "text-yellow-600";
        case "failed":
        case "cancel":
        case "expire":
        return "text-red-600";
        default:
        return "text-gray-600";
    }
}
