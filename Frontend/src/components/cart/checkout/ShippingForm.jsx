import React from "react";
import InputField from "../../auth/InputField";
import { ChevronLeft } from "lucide-react";

export default function ShippingForm({ values, onChange, onBack, onContinue }) {
  return (
    <div className="bg-white border border-brand-sand/15 rounded-sm p-6 shadow-sm text-left">
      <h3 className="font-serif text-lg font-light text-brand-dark mb-4">Shipping Details</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onContinue();
        }}
        className="space-y-4"
      >
        <InputField
          label="Customer Full Name"
          id="name"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />
        <InputField
          label="Email Address"
          type="email"
          id="email"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
        <InputField
          label="Delivery Street Address"
          id="address"
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="City"
            id="city"
            value={values.city}
            onChange={(e) => onChange("city", e.target.value)}
            required
          />
          <InputField
            label="Postal Code"
            id="postal"
            value={values.postal}
            onChange={(e) => onChange("postal", e.target.value)}
            required
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
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
