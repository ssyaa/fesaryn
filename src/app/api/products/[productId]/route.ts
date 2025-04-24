import { products } from "../../../lib/data/products";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = parseInt(url.pathname.split("/").pop() || "0", 10);

  console.log("API called with productId:", productId);

  if (isNaN(productId)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
  }

  const product = products.find((p) => p.id.toString() === productId.toString());
  if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
