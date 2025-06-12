// CartHelpers.ts (atau nama lainnya)

// Type sementara untuk produk di cart
export interface CartProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string[]; // atau string, tergantung dari backend
  quantity: number;
}

// Ambil cart dari localStorage
export const getCart = (): CartProduct[] => {
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

// Simpan cart ke localStorage
export const saveCart = (cart: CartProduct[]): void => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Tambahkan produk ke cart
export const addToCart = (product: Omit<CartProduct, "quantity">): void => {
  const cart: CartProduct[] = getCart();
  const existingIndex = cart.findIndex((item) => item.id === product.id);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
};

// Hapus satu item berdasarkan index
export const removeFromCart = (index: number): void => {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
};

// Hapus semua cart
export const clearCart = (): void => {
  localStorage.removeItem("cart");
};
