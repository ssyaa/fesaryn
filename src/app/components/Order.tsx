"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Order() {
    const [shipment, setShipment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchShipment = async () => {
        try {
            const token = localStorage.getItem("user-token");
            const response = await axios.get("http://localhost:8000/api/shipment", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            setShipment(response.data);
        } catch (err) {
            setError("Gagal memuat data pengiriman.");
        } finally {
            setLoading(false);
        }
        };

        fetchShipment();
    }, []);

    if (loading) return <p className="text-gray-500">Loading order data...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!shipment) return <p className="text-gray-500">Tidak ada data pengiriman.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
        {/* Order Card */}
        <div className="bg-white rounded shadow border-t-4 border-black overflow-hidden">
            <div className="bg-black text-white px-4 py-2 text-sm font-semibold truncate">
            OrderID {shipment.orderId}
            </div>
            <div className="px-4 py-4">
            <div className="flex items-center space-x-4 mb-2">
                <span className="font-semibold text-sm w-32">Courier</span>
                <img
                src={
                    shipment.courier === "J&T"
                    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/J_%26_T_Express_logo.svg/2560px-J_%26_T_Express_logo.svg.png"
                    : "/default-courier-logo.png"
                }
                alt={shipment.courier}
                className="h-5 object-contain"
                />
            </div>
            <div className="flex items-center space-x-4 mb-2">
                <span className="font-semibold text-sm w-32">Estimated Delivery</span>
                <span className="text-sm text-gray-600">{shipment.estimatedDelivery}</span>
            </div>
            <div className="flex items-center space-x-4">
                <span className="font-semibold text-sm w-32">Status</span>
                <span className="text-sm text-gray-600">{shipment.status}</span>
            </div>
            </div>
        </div>
        </div>
    );
}
