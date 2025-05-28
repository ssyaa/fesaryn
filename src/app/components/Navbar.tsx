"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHome } from "react-icons/fa";
import { getCart } from "../utils/cart";

export default function Navbar(): React.JSX.Element {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const cart = getCart();
    setCartItemsCount(cart.length);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full p-4 flex items-center z-50">
      {/* Logo centered */}
      <div className="flex-1 flex justify-center">
        <Image src="/sarynlogo.png" alt="Sarynthelebel Logo" width={60} height={60} className="rounded-full" />
      </div>

      {/* Icons positioned in the middle of the right-side space */}
      <div className="absolute right-[15%] flex gap-6">
        <Link href="/home">
          <FaHome size={22} className="cursor-pointer" />
        </Link>

        <Link href="/search">
          <Image src="/search.svg" alt="Search" width={22} height={22} className="cursor-pointer" />
        </Link>

        <Link href="/cart" className="relative">
          <Image src="/basket.svg" alt="Cart" width={22} height={22} className="cursor-pointer" />
          {cartItemsCount > 0 && (
            <span className="absolute top-[-5px] right-[-5px] bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </Link>

        {/* Langsung ke /user saat klik icon user */}
        <Link href="/user">
          <Image src="/profile.svg" alt="User" width={22} height={22} className="cursor-pointer" />
        </Link>
      </div>
    </nav>
  );
}
