export function calcCartSubtotal(items) {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export function calcDiscountAmount(subtotal, discountPercent) {
  return (subtotal * discountPercent) / 100;
}

export function calcShipping(subtotal) {
  return subtotal > 5000 || subtotal === 0 ? 0 : 300;
}

export function calcCartTotal(subtotal, discountAmount, shipping) {
  return subtotal - discountAmount + shipping;
}

export function calcCartCount(items) {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}

export function buildItemsSummary(cartItems) {
  return cartItems.map((item) => `${item.name} (x${item.quantity})`).join(", ");
}
