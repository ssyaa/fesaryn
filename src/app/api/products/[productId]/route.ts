import { products } from "../../../lib/data/products";
import { NextResponse } from "next/server";

// Ensure the correct type for params
export async function GET(req: Request, { params }: { params: { productId: string } }) {
  // Access productId from params and ensure it's being compared correctly
  const product = products.find((p) => p.id === params.productId);

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
