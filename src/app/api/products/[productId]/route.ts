import { products } from "../../../lib/data/products";
import { NextResponse } from "next/server";

// Dynamic parameter should be accessed through the request URL in the API route.
export async function GET(req: Request, { params }: { params: { productId: string } }) {
  const { productId } = params;  // Directly access productId from params
  
  // Find the product with the matching id
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product); // Return the found product
}
