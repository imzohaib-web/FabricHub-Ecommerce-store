import { STORAGE_KEYS } from "./storageKeys";
import { getStoredJSON, setStoredJSON } from "../hooks/useLocalStorage";
import { buildItemsSummary } from "./cartUtils";

export function generateOrderId() {
  return "FH" + Math.floor(100000 + Math.random() * 90000);
}

export function formatOrderDate() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function createOrder({ orderId, customerName, customerEmail, cartItems, cartTotal }) {
  return {
    id: orderId,
    customerName,
    customerEmail,
    date: formatOrderDate(),
    totalAmount: cartTotal,
    status: "Pending",
    itemsSummary: buildItemsSummary(cartItems),
  };
}

export function loadOrders(defaultOrders) {
  const stored = getStoredJSON(STORAGE_KEYS.ORDERS, null);
  if (stored) return stored;
  if (defaultOrders) {
    setStoredJSON(STORAGE_KEYS.ORDERS, defaultOrders);
    return defaultOrders;
  }
  return [];
}

export function saveOrders(orders) {
  setStoredJSON(STORAGE_KEYS.ORDERS, orders);
}

export function appendOrder(order) {
  const existingOrders = getStoredJSON(STORAGE_KEYS.ORDERS, []);
  existingOrders.unshift(order);
  setStoredJSON(STORAGE_KEYS.ORDERS, existingOrders);
  return existingOrders;
}

export function calcTotalSales(orders) {
  return orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((acc, o) => acc + o.totalAmount, 0);
}

export function countPendingOrders(orders) {
  return orders.filter((o) => o.status === "Pending").length;
}
