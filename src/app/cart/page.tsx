'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { X } from 'lucide-react';
import CheckoutPanel from '../components/CheckoutPanel';
import { useAuth } from '../../context/Authcontext';
import Image from 'next/image';

type Product = {
  id: string;
  productId: number;
  name: string;
  price: number;
  images?: string[];
  quantity: number;
};

type FetchedCartItem = {
  id: string;
  product: {
    id: number;
    name: string;
    price: number;
    image?: string[];
  };
  quantity: number;
};

export default function Cart() {
  const { isAuthenticated, token } = useAuth();
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }

    setIsLoading(true);

    fetch('https://admin.sarynthelabel.my.id/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Gagal mengambil data cart');
        const data = await res.json();
        const mappedCart = data.cart.map((item: FetchedCartItem) => ({
          id: item.id,
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          images: item.product.image,
          quantity: item.quantity,
        }));
        setCartItems(mappedCart);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setCartItems([]);
        setIsLoading(false);
      });
  }, [isAuthenticated, token]);

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Gagal menghapus item');

      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.error(error);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      alert('Silakan login terlebih dahulu untuk melakukan checkout.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Silakan memilih barang anda terlebih dahulu');
      return;
    }
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-white font-inter">
        <h1 className="text-2xl mt-30 text-black mb-10 font-bold">Cart</h1>
        <div className="w-full max-w-4xl px-4 md:px-0">
          <div className="hidden md:grid grid-cols-5 text-center border-b py-2 text-gray-500 text-[13px]">
            <div>PRODUCT</div>
            <div>PRICE</div>
            <div>QUANTITY</div>
            <div>TOTAL</div>
            <div></div>
          </div>

          {isLoading && (
            <div className="text-center py-10 text-gray-500">
              Mengambil data...
            </div>
          )}

          {!isLoading && cartItems.length === 0 && (
            <div className="text-center py-10 text-gray-500">Cart kosong.</div>
          )}

          {!isLoading &&
            cartItems.map((item) => (
              <div key={item.id}>
                <div className="hidden md:grid grid-cols-5 text-center items-center border-b py-4 text-black text-sm">
                  <div className="flex items-center justify-center">
                    <Image
                      src={
                        item.images?.[0]
                          ? `https://admin.sarynthelabel.my.id/storage/${item.images[0]}`
                          : '/placeholder.jpg'
                      }
                      alt={item.name}
                      width={48}
                      height={48}
                      className="object-cover rounded mr-2"
                    />
                    <span>{item.name}</span>
                  </div>
                  <div>{Math.floor(item.price).toLocaleString('id-ID')} IDR</div>
                  <div>{item.quantity}</div>
                  <div>
                    {Math.floor(item.price * (item.quantity || 1)).toLocaleString('id-ID')} IDR
                  </div>
                  <div>
                    <button onClick={() => handleRemoveItem(item.id)}>
                      <X className="w-4 h-4 text-black hover:text-red-500 transition" />
                    </button>
                  </div>
                </div>

                <div className="block md:hidden bg-white rounded-xl shadow p-4 mb-4 w-full relative">
                  <div className="flex items-start">
                    <Image
                      src={
                        item.images?.[0]
                          ? `https://admin.sarynthelabel.my.id/storage/${item.images[0]}`
                          : '/placeholder.jpg'
                      }
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover rounded mr-4"
                    />
                    <div>
                      <h2 className="font-semibold text-black text-base">
                        {item.name}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {Math.floor(item.price).toLocaleString('id-ID')} IDR / pcs
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col items-end">
                    <p className="text-gray-700 text-sm">Qty: {item.quantity}</p>
                    <p className="text-black font-semibold text-sm">
                      Total:{' '}
                      {Math.floor(item.price * (item.quantity || 1)).toLocaleString('id-ID')} IDR
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

          {!isLoading && cartItems.length > 0 && (
            <div className="text-right mt-4 text-lg font-semibold text-black">
              Total: {Math.floor(totalPrice).toLocaleString('id-ID')} IDR
            </div>
          )}

          {!isLoading && cartItems.length > 0 && (
            <div className="text-right mt-6">
              <button
                onClick={handleCheckoutClick}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      <CheckoutPanel isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
}
