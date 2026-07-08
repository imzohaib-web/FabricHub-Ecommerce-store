import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services/orderService";
import { formatPrice } from "../utils/productUtils";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { ShoppingBag, ChevronRight, Package, Clock, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function MyOrders() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useScrollToTop();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const getOrders = async () => {
      const token = localStorage.getItem("fh_access_token");
      if (!token) return;

      try {
        setLoading(true);
        const data = await orderService.fetchMyOrders(token);
        setOrders(data);
      } catch (err) {
        console.error("Fetch my orders error:", err.message);
        setError(err.message || "Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left"
    >
      <div className="border-b border-brand-sand/30 pb-6 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">Shopping Account</span>
        <h1 className="font-serif text-3xl font-light text-brand-dark mt-1">My Orders</h1>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-dark"></div>
          <p className="text-xs uppercase font-bold tracking-widest text-brand-muted mt-4">Loading order logs...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-xs font-medium">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white border border-brand-sand/15 rounded-sm shadow-sm">
          <Package size={48} className="text-brand-sand stroke-1" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">No Orders Placed Yet</h3>
            <p className="text-xs text-brand-muted max-w-xs mx-auto font-light">
              Explore our collections and place your first order.
            </p>
          </div>
          <Link
            to="/shop"
            className="px-8 py-3 bg-brand-dark text-white text-xs font-semibold tracking-widest uppercase hover:bg-brand-charcoal transition-colors rounded-sm"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-brand-sand/15 rounded-sm shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="bg-brand-champagne/15 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-brand-champagne">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-dark">{order.orderId}</span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-sm text-[9px] uppercase font-bold tracking-wider ${
                        order.status === "Shipped" || order.status === "Delivered"
                          ? "bg-green-50 text-green-700"
                          : order.status === "Cancelled"
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-brand-muted">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-brand-muted">Total Amount</p>
                  <p className="text-sm font-bold text-brand-dark mt-0.5">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-brand-champagne/45 px-6">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="py-4 flex gap-4 items-center">
                    <img
                      src={item.product?.image || (item.product?.images && item.product.images[0]) || "/placeholder.jpg"}
                      alt={item.product?.title || "Product"}
                      className="w-12 h-16 object-cover rounded-sm border border-brand-sand/15 bg-brand-champagne"
                    />
                    <div className="flex-grow space-y-0.5">
                      <h4 className="text-xs font-bold text-brand-dark">
                        {item.product?.title || "Product Option"}
                      </h4>
                      <div className="flex flex-wrap gap-x-3 text-[10px] text-brand-muted">
                        <span>Size: <strong className="text-brand-dark">{item.size}</strong></span>
                        {item.color && (
                          <span className="flex items-center gap-1">
                            Color:
                            <strong className="text-brand-dark flex items-center gap-1">
                              <span
                                className="inline-block w-2 h-2 rounded-full border border-brand-sand/40"
                                style={{ backgroundColor: item.color.value }}
                              />
                              {item.color.name}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-brand-dark">
                        {formatPrice(item.price)}
                      </p>
                      <p className="text-[10px] text-brand-muted">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer / Address */}
              <div className="bg-brand-champagne/5 px-6 py-3 border-t border-brand-champagne/40 text-[10px] text-brand-muted flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <span className="font-semibold text-brand-dark uppercase tracking-wider mr-1">Shipping Details:</span>
                  <span>
                    {order.shippingDetails?.address}, {order.shippingDetails?.city}, {order.shippingDetails?.postal}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-brand-dark uppercase tracking-wider mr-1">Payment Status:</span>
                  <span className="text-green-700 font-bold uppercase">{order.paymentStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
