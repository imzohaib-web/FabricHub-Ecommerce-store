import React from "react";

export default function InputField({
  label,
  type = "text",
  id,
  value,
  onChange,
  required = false,
  error = "",
  placeholder = "",
  ...props
}) {
  return (
    <div className="flex flex-col text-left mb-4">
      <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`w-full bg-white text-xs border ${
          error ? "border-red-500" : "border-brand-sand/65"
        } focus:border-brand-dark focus:outline-none py-3 px-4 rounded-sm transition-colors text-brand-dark`}
        {...props}
      />
      {error && <p className="text-[10px] text-red-500 font-semibold mt-1 uppercase tracking-wider">{error}</p>}
    </div>
  );
}
