import { products } from "../../../lib/data/products";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  // The `params` argument should have the correct type.
  const product = products.find((p) => p.id === params.productId);

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
