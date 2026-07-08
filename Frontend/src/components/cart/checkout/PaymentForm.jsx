import React from "react";
import InputField from "../../auth/InputField";
import { ChevronLeft } from "lucide-react";

export default function PaymentForm({ values, onChange, onBack, onSubmit }) {
  return (
    <div className="bg-white border border-brand-sand/15 rounded-sm p-6 shadow-sm text-left">
      <h3 className="font-serif text-lg font-light text-brand-dark mb-4">Payment Information</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="Credit Card Number"
          id="card"
          placeholder="xxxx xxxx xxxx xxxx"
          value={values.cardNumber}
          onChange={(e) => onChange("cardNumber", e.target.value)}
          required
          maxLength={19}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Expiration Date"
            id="expiry"
            placeholder="MM/YY"
            value={values.cardExpiry}
            onChange={(e) => onChange("cardExpiry", e.target.value)}
            required
            maxLength={5}
          />
          <InputField
            label="Security Code (CVC)"
            id="cvc"
            placeholder="xxx"
            value={values.cardCVC}
            onChange={(e) => onChange("cardCVC", e.target.value)}
            required
            maxLength={3}
          />
        </div>
        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3.5 border border-brand-sand text-brand-dark text-xs font-bold uppercase tracking-widest hover:bg-brand-champagne rounded-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <button
            type="submit"
            className="flex-1 py-3.5 bg-brand-dark hover:bg-brand-charcoal text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-1.5"
          >
            Place Secure Order
          </button>
        </div>
      </form>
    </div>
  );
}
