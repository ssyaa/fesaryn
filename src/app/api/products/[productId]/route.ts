import { NextResponse } from "next/server";

// Ganti URL ini dengan URL backend Laravel kamu
const BASE_URL = "https://admin.sarynthelabel.my.id/api/products";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.pathname.split("/").pop();

  console.log("API called with productId:", productId);

  if (!productId || isNaN(Number(productId))) {
    return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BASE_URL}/${productId}`);
    
    if (!res.ok) {
      return NextResponse.json({ message: "Product not found" }, { status: res.status });
    }

    const product = await res.json();
    return NextResponse.json(product);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch product data" }, { status: 500 });
  }
}
