import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { formatPrice } from "../../../utils/productUtils";

export default function OrderSummary({
  step,
  cartSubtotal,
  cartTotal,
  discountAmount,
  discountPercent,
  shipping,
  promoCode,
  removePromo,
  promoInput,
  setPromoInput,
  promoError,
  promoSuccess,
  onPromoSubmit,
  onCheckout,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-brand-sand/15 rounded-sm p-6 shadow-sm text-left space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark pb-3 border-b border-brand-champagne">
          Order Summary
        </h3>

        <div className="space-y-3.5 text-xs text-brand-dark font-medium">
          <div className="flex justify-between">
            <span className="text-brand-muted">Bag Subtotal</span>
            <span>{formatPrice(cartSubtotal)}</span>
          </div>

          {promoCode && (
            <div className="flex justify-between text-green-700 font-bold bg-green-50 px-2 py-1 border border-green-200 rounded-sm">
              <div className="flex flex-col">
                <span>Promo Applied</span>
                <span className="text-[9px] uppercase tracking-wide">
                  ({promoCode} - {discountPercent}%)
                </span>
              </div>
              <button onClick={removePromo} className="text-[9px] underline text-red-500 uppercase">
                Remove
              </button>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-brand-muted">Estimated Shipping</span>
            <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
          </div>

          <div className="border-t border-brand-champagne pt-4 flex justify-between items-baseline">
            <span className="text-sm font-semibold uppercase tracking-wider">Estimated Total</span>
            <span className="text-xl font-bold text-brand-dark">{formatPrice(cartTotal)}</span>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={onPromoSubmit} className="pt-4 border-t border-brand-champagne">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted block mb-1.5">
              Have a promo code?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. FABRIC10"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 bg-white border border-brand-sand/40 text-xs py-2 px-3 focus:outline-none focus:border-brand-dark rounded-sm text-brand-dark uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2 border border-brand-dark text-brand-dark text-xs font-bold uppercase tracking-widest hover:bg-brand-dark hover:text-white rounded-sm transition-all"
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5 uppercase tracking-wide">{promoError}</p>
            )}
            {promoSuccess && (
              <p className="text-[10px] text-green-700 font-bold mt-1.5 uppercase tracking-wide">{promoSuccess}</p>
            )}
          </form>
        )}

        {step === 1 && (
          <button
            onClick={onCheckout}
            className="w-full py-4 bg-brand-dark hover:bg-brand-charcoal text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-sm flex items-center justify-center gap-1.5 shadow"
          >
            Secure Checkout
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-brand-muted text-[10px] uppercase font-bold tracking-widest">
        <ShieldCheck size={16} className="text-brand-gold" />
        <span>SSL SECURE CHECKOUT</span>
      </div>
    </div>
  );
}
