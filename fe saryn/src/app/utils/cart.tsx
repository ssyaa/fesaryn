import { Product } from "../lib/types/Product";

// Fungsi ambil cart dari localStorage
export const getCart = (): Product[] => {
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

// Fungsi simpan cart ke localStorage
export const saveCart = (cart: Product[]): void => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Fungsi menambahkan produk ke cart
export const addToCart = (product: Product): void => {
  const cart: Product[] = getCart();
  const existingProductIndex = cart.findIndex((item) => item.id === product.id);

  if (existingProductIndex !== -1) {
    // Jika produk sudah ada, tambahkan quantity-nya
    cart[existingProductIndex].quantity += 1;
  } else {
    // Jika belum ada, set quantity = 1, lalu tambahkan
    const productWithQuantity = { ...product, quantity: 1 };
    cart.push(productWithQuantity);
  }

  saveCart(cart);
};

// Fungsi hapus item dari cart berdasarkan index
export const removeFromCart = (index: number): void => {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
};

// Fungsi hapus seluruh cart
export const clearCart = (): void => {
  localStorage.removeItem("cart");
};
