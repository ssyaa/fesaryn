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
    <nav className="fixed top-0 left-0 w-full p-4 flex items-center justify-between z-50 
              sm:backdrop-blur-none sm:bg-transparent 
              backdrop-blur-md backdrop-saturate-150 bg-white/40 border-b border-white/30">
      {/* Mobile Left Section (Logo + Text) */}
      <div className="flex items-center gap-2 sm:hidden">
        <Image
          src="/sarynlogo.png"
          alt="Sarynthelebel Logo"
          width={36}
          height={36}
          className="rounded-full"
        />
        <span className="font-semibold text-lg">Sarynthelebel</span>
      </div>

      {/* Desktop Centered Logo */}
      <div className="hidden sm:flex flex-1 justify-center">
        <Image
          src="/sarynlogo.png"
          alt="Sarynthelebel Logo"
          width={60}
          height={60}
          className="rounded-full"
        />
      </div>

      {/* Icons Right Section */}
      <div className="flex items-center gap-5 sm:gap-6 sm:absolute sm:right-[15%]">
        <Link href="/home">
          <FaHome size={18} className="cursor-pointer sm:size-[22px]" />
        </Link>

        <Link href="/cart" className="relative">
          <Image
            src="/basket.svg"
            alt="Cart"
            width={18}
            height={18}
            className="cursor-pointer sm:w-[22px] sm:h-[22px]"
          />
          {cartItemsCount > 0 && (
            <span className="absolute top-[-5px] right-[-5px] bg-red-600 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </Link>

        <Link href="/user">
          <Image
            src="/profile.svg"
            alt="User"
            width={18}
            height={18}
            className="cursor-pointer sm:w-[22px] sm:h-[22px]"
          />
        </Link>
      </div>
    </nav>
  );
}
