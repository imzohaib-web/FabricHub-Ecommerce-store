export default function CheckoutSteps({ step }) {
  return (
    <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-muted">
      <span className={step >= 1 ? "text-brand-dark font-extrabold" : ""}>01 Bag</span>
      <span>&gt;</span>
      <span className={step >= 2 ? "text-brand-dark font-extrabold" : ""}>02 Details</span>
      <span>&gt;</span>
      <span className={step >= 3 ? "text-brand-dark font-extrabold" : ""}>03 Payment</span>
    </div>
  );
}
