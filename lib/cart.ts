export function getCart() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

export function saveCart(cart: any[]) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(item: any) {
  const cart = getCart();
  const existing = cart.find((i: any) => i._id === item._id);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);
}

export function removeFromCart(id: string) {
  const cart = getCart().filter((i: any) => i._id !== id);
  saveCart(cart);
}

export function updateQuantity(id: string, qty: number) {
  const cart = getCart().map((i: any) =>
    i._id === id ? { ...i, quantity: qty } : i
  );
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}
