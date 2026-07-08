import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { formatPrice } from "../../utils/productUtils";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <tr className="border-b border-brand-champagne/60 align-middle">
      {/* Product Image and Name */}
      <td className="py-6 text-left">
        <div className="flex gap-4 sm:gap-6 items-center">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-20 sm:w-20 sm:h-26 object-cover rounded-sm border border-brand-sand/15 shadow-sm"
          />
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-brand-dark">{item.name}</h4>
            <div className="flex flex-wrap gap-x-3 text-[10px] text-brand-muted">
              <span>Size: <strong className="text-brand-dark">{item.size}</strong></span>
              <span className="flex items-center gap-1">
                Color:
                <strong className="text-brand-dark flex items-center gap-1">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full border border-brand-sand/40"
                    style={{ backgroundColor: item.color.value }}
                  />
                  {item.color.name}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Unit Price */}
      <td className="py-6 text-center text-xs sm:text-sm text-brand-dark hidden sm:table-cell">
        {formatPrice(item.price)}
      </td>

      {/* Quantity */}
      <td className="py-6 text-center">
        <div className="inline-flex items-center border border-brand-sand/40 rounded-sm">
          <button
            onClick={() => onUpdateQuantity(item.id, item.size, item.color.name, item.quantity - 1)}
            className="p-1.5 text-brand-dark hover:bg-brand-champagne transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={11} />
          </button>
          <span className="px-3 text-xs font-semibold text-brand-dark">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.size, item.color.name, item.quantity + 1)}
            className="p-1.5 text-brand-dark hover:bg-brand-champagne transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={11} />
          </button>
        </div>
      </td>

      {/* Total Price */}
      <td className="py-6 text-right text-xs sm:text-sm font-bold text-brand-dark">
        {formatPrice(item.price * item.quantity)}
      </td>

      {/* Delete Trigger */}
      <td className="py-6 text-right pl-4">
        <button
          onClick={() => onRemove(item.id, item.size, item.color.name)}
          className="text-brand-muted hover:text-red-600 transition-colors p-1"
          aria-label="Remove item"
        >
          <Trash2 size={15} />
        </button>
      </td>
    </tr>
  );
}
