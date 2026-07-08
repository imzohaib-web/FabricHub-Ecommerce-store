import React from "react";
import { Eye, Truck, Ban } from "lucide-react";
import { formatPrice } from "../../utils/productUtils";

export default function OrderTable({ ordersList, onUpdateOrders }) {
  const updateStatus = (orderId, newStatus) => {
    const updated = ordersList.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    onUpdateOrders(updated);
  };

  return (
    <div className="bg-white border border-brand-sand/15 rounded-sm shadow-sm p-6 text-left">
      <div className="pb-4 border-b border-brand-champagne mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark">Order Logs</h3>
        <p className="text-[10px] text-brand-muted mt-1 uppercase tracking-wide">Monitor customer purchases and track shipping states</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-sand/30 text-[10px] uppercase font-bold tracking-wider text-brand-muted">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Purchased Items</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Update Delivery</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-champagne/45 font-medium text-brand-dark">
            {ordersList.map((order) => (
              <tr key={order.id} className="hover:bg-brand-champagne/20 transition-colors">
                <td className="py-4 px-4 font-semibold">{order.id}</td>
                <td className="py-4 px-4">
                  <div>
                    <span className="block font-semibold">{order.customerName}</span>
                    <span className="text-[9px] text-brand-muted block">{order.customerEmail}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="block truncate max-w-[200px] text-brand-muted" title={order.itemsSummary}>
                    {order.itemsSummary}
                  </span>
                </td>
                <td className="py-4 px-4 text-brand-muted">{order.date}</td>
                <td className="py-4 px-4 font-bold">{formatPrice(order.totalAmount)}</td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-sm text-[9px] uppercase font-bold tracking-wider ${
                      order.status === "Shipped"
                        ? "bg-green-50 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  {order.status === "Pending" && (
                    <div className="inline-flex gap-1.5">
                      <button
                        onClick={() => updateStatus(order.id, "Shipped")}
                        className="flex items-center gap-1 px-2.5 py-1.5 border border-green-200 text-green-700 hover:bg-green-50 rounded-sm text-[9px] uppercase font-bold tracking-wider transition-colors"
                        title="Mark as Shipped"
                      >
                        <Truck size={10} />
                        Ship
                      </button>
                      <button
                        onClick={() => updateStatus(order.id, "Cancelled")}
                        className="flex items-center gap-1 px-2.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-sm text-[9px] uppercase font-bold tracking-wider transition-colors"
                        title="Cancel Order"
                      >
                        <Ban size={10} />
                        Cancel
                      </button>
                    </div>
                  )}
                  {order.status !== "Pending" && (
                    <span className="text-[9px] uppercase font-bold tracking-widest text-brand-muted">
                      No actions
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
