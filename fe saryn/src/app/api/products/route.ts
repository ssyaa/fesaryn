import { products } from "@/app/lib/data/products";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(products);
}