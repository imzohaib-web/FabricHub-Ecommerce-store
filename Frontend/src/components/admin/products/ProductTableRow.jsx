import React from "react";
import { Edit2, Trash2, Star } from "lucide-react";
import { formatPrice } from "../../../utils/productUtils";

export default function ProductTableRow({ product, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-brand-champagne/20 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-10 h-12 object-cover rounded-sm border border-brand-sand/10"
          />
          <div>
            <span className="font-semibold block truncate max-w-xs">{product.name}</span>
            <span className="text-[9px] text-brand-muted block uppercase tracking-wide">ID: {product.id}</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 capitalize text-brand-muted">{product.category}</td>
      <td className="py-4 px-4 font-bold">{formatPrice(product.price)}</td>
      <td className="py-4 px-4">
        <span
          className={`inline-block px-2 py-0.5 rounded-sm text-[9px] uppercase font-bold tracking-wider ${
            product.inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-1">
          <Star size={11} className="fill-brand-gold text-brand-gold" />
          <span>{product.rating}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        <div className="inline-flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 border border-brand-sand/30 rounded-sm hover:bg-brand-champagne text-brand-dark transition-colors"
            aria-label="Edit product"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-1.5 border border-brand-sand/30 rounded-sm hover:bg-red-50 text-red-600 transition-colors"
            aria-label="Delete product"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}
