import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <div className="bg-white px-6 md:px-16 py-12">
      <h2 className="text-xl font-semibold text-black mb-6">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 relative mb-2 border border-gray-200">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-black">/{product.name.toLowerCase()}</p>
              <p className="text-sm text-gray-600">Rp {product.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
