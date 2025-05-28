"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePageRedirect() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
  const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch("/api/auth/validate-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        router.replace("/home");
      } else {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    } catch (error) {
      localStorage.removeItem("token");
      router.replace("/login");
    }
  };

  checkToken();
}, [])};
