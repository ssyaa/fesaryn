import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/Authcontext";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  size: string;
  stock: number;
  price: string;
  image: string[];
  category_id: number;
  admin_id: number;
  created_at: string;
  updated_at: string;
}

interface OrderDetail {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string;
  shipping_cost: string;
  tax: string;
  created_at: string;
  updated_at: string;
  product: Product;
}

interface OrderData {
  id: number;
  user_id: number;
  status: string;
  snap_token: string | null;
  total_price: string;
  note: string | null;
  created_at: string;
  updated_at: string;
  order_number: string | null;
  order_details: OrderDetail[];
}

interface PaymentInfo {
  status: string;
  payment_type: string;
  payment_date: string;
  amount: string;
  va_numbers?: { bank: string; va_number: string }[];
}

interface AxiosErrorType {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function Order() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [payments, setPayments] = useState<Record<number, PaymentInfo>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState<number | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!token) return;

    const fetchPaymentInfo = async (orderId: number) => {
      try {
        const res = await axios.get<PaymentInfo>(`/api/payments/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments((prev) => ({ ...prev, [orderId]: res.data }));
      } catch (err: unknown) {
        console.error(`Error fetching payment info for order ${orderId}`, err);
      }
    };

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<OrderData[]>("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        response.data.forEach((order) => {
          fetchPaymentInfo(order.id);
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error fetching orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleCancelOrder = async (orderId: number) => {
    if (!token) return;
    setCancelLoading(orderId);
    try {
      await axios.delete(`/api/orders/${orderId}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setPayments((prev) => {
        const copy = { ...prev };
        delete copy[orderId];
        return copy;
      });
      setExpandedOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    } catch (err: unknown) {
      const axiosErr = err as AxiosErrorType;
      alert(axiosErr.response?.data?.message || "Gagal membatalkan order");
    } finally {
      setCancelLoading(null);
    }
  };

  const toggleDetails = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (loading) return <p>Memuat data pengguna...</p>;
  if (error) return <p>Error: {error}</p>;
  if (orders.length === 0) return <p>Silakan melakukan pemesanan^^</p>;

  return (
    <div className="p-6 space-y-6">
      {orders.map((order) => {
        const isExpanded = expandedOrders.has(order.id);
        return (
          <div
            key={order.id}
            className="rounded-lg border border-gray-300 overflow-hidden shadow-sm"
          >
            {/* Order Number Header */}
            <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center">
              <span className="text-lg font-semibold">
                Order Number: {order.order_number || "N/A"}
              </span>
              {(order.status === "pending" || order.status === "waiting_payment") && (
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  disabled={cancelLoading === order.id}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 rounded disabled:opacity-50"
                >
                  {cancelLoading === order.id ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>

            {/* Main Info */}
            <div className="bg-white text-gray-900 px-4 py-4 space-y-2 text-left">
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Total Price:</strong> Rp{" "}
                {parseInt(order.total_price).toLocaleString()}
              </p>
            </div>
            <div className="text-center mb-4">
              <p
                onClick={() => toggleDetails(order.id)}
                className="text-gray-500 cursor-pointer select-none hover:text-gray-700 transition text-sm"
              >
                {isExpanded ? "Hide Details <<" : "See Details >>"}
              </p>
            </div>

            {/* Dropdown Detail */}
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out px-4`}
              style={{
                maxHeight: isExpanded ? "1000px" : "0",
              }}
            >
              {isExpanded && (
                <div className="bg-gray-50 border-t border-gray-200 py-4 text-left text-black space-y-4">
                  {/* Order Details */}
                  <div>
                    <strong>Order Details:</strong>
                    {order.order_details.map((detail) => (
                      <div
                        key={detail.id}
                        className="ml-4 mt-2 p-2 border border-gray-200 rounded-md flex items-center space-x-4"
                      >
                        <Image
                          src={
                            detail.product.image?.[0]
                              ? `http://localhost:8000/storage/${detail.product.image[0]}`
                              : "/placeholder.jpg"
                          }
                          alt={detail.product.name}
                          className="w-24 h-auto rounded"
                          width={96}
                          height={96}
                        />
                        <div>
                          <p>Product: {detail.product.name}</p>
                          <p>Quantity: {detail.quantity}</p>
                          <p>Price: Rp {parseInt(detail.price).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Info */}
                  {payments[order.id] && (
                    <div className="bg-white border border-gray-300 rounded-md p-3">
                      <strong>Payment Info:</strong>
                      <p>Status: {payments[order.id].status}</p>
                      <p>Payment Type: {payments[order.id].payment_type}</p>
                      <p>
                        Transaction Time:{" "}
                        {new Date(payments[order.id].payment_date).toLocaleString()}
                      </p>
                      <p>
                        Amount: Rp {parseInt(payments[order.id].amount).toLocaleString()}
                      </p>
                      {payments[order.id].va_numbers?.map((va, idx) => (
                        <p key={idx}>
                          VA ({va.bank.toUpperCase()}): {va.va_number}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
