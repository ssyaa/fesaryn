import { products } from "../../../lib/data/products";
import { NextResponse } from "next/server";

// Define a custom type for the params
interface Params {
  productId: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  const product = products.find((p) => p.id === params.productId);

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
