import React from "react";
import CartItem from "../CartItem";

export default function CartTable({ cartItems, onUpdateQuantity, onRemove }) {
  return (
    <div className="bg-white border border-brand-sand/15 rounded-sm p-6 shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-brand-sand/30 text-[10px] uppercase font-bold tracking-widest text-brand-muted pb-4">
            <th className="pb-3 text-left">Product</th>
            <th className="pb-3 text-center hidden sm:table-cell">Price</th>
            <th className="pb-3 text-center">Quantity</th>
            <th className="pb-3 text-right">Total</th>
            <th className="pb-3 text-right pl-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-champagne/45">
          {cartItems.map((item) => (
            <CartItem
              key={`${item.id}-${item.size}-${item.color.name}`}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
