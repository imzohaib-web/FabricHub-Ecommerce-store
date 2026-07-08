import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { generateOrderId, createOrder, appendOrder } from "../utils/orderUtils";
import { orderService } from "../services/orderService";
import CheckoutSteps from "../components/cart/checkout/CheckoutSteps";
import CartTable from "../components/cart/checkout/CartTable";
import ShippingForm from "../components/cart/checkout/ShippingForm";
import PaymentForm from "../components/cart/checkout/PaymentForm";
import OrderSummary from "../components/cart/checkout/OrderSummary";
import OrderSuccess from "../components/cart/checkout/OrderSuccess";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function Cart() {
  const { currentUser } = useAuth();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotal,
    discountAmount,
    discountPercent,
    shipping,
    applyPromo,
    removePromo,
    promoCode,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState("");

  const [shippingForm, setShippingForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postal: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });

  useScrollToTop([currentUser, step]);

  useEffect(() => {
    if (currentUser) {
      setShippingForm((prev) => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
      }));
    }
  }, [currentUser]);

  const handleShippingChange = (field, value) => {
    setShippingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    if (res.success) {
      setPromoSuccess(res.message);
      setPromoInput("");
    } else {
      setPromoError(res.message);
    }
  };

  const handleUpdateQuantity = async (id, size, colorName, newQuantity) => {
    const res = await updateQuantity(id, size, colorName, newQuantity);
    if (res && !res.success) {
      alert(res.message);
    }
  };

  const handleRemove = async (id, size, colorName) => {
    const res = await removeFromCart(id, size, colorName);
    if (res && !res.success) {
      alert(res.message);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("fh_access_token");
    if (currentUser && token) {
      try {
        const shippingDetails = {
          address: shippingForm.address,
          city: shippingForm.city,
          postal: shippingForm.postal
        };
        const order = await orderService.createOrder(
          shippingForm.name,
          shippingForm.email,
          shippingDetails,
          token
        );
        clearCart();
        setOrderId(order.orderId);
        setStep(4);
      } catch (err) {
        alert(err.message || "Failed to place order. Please try again.");
      }
    } else {
      // Guest local checkout fallback
      const newOrderId = generateOrderId();
      const newOrder = createOrder({
        orderId: newOrderId,
        customerName: shippingForm.name,
        customerEmail: shippingForm.email,
        cartItems,
        cartTotal,
      });

      appendOrder(newOrder);
      clearCart();
      setOrderId(newOrderId);
      setStep(4);
    }
  };

  if (step === 4) {
    return <OrderSuccess orderId={orderId} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="text-left space-y-2 border-b border-brand-sand/30 pb-6 mb-8 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">Secure Checkout</span>
          <h1 className="font-serif text-3xl font-light text-brand-dark mt-1">Shopping Bag</h1>
        </div>
        <CheckoutSteps step={step} />
      </div>

      {cartItems.length === 0 && step === 1 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <ShoppingBag size={56} className="text-brand-sand stroke-1" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">Your Bag is Empty</h3>
            <p className="text-xs text-brand-muted max-w-xs mx-auto font-light">
              Add beautiful, mindfully-crafted items to your cart from our boutique catalog.
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {step === 1 && (
              <CartTable
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            )}

            {step === 2 && (
              <ShippingForm
                values={shippingForm}
                onChange={handleShippingChange}
                onBack={() => setStep(1)}
                onContinue={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <PaymentForm
                values={paymentForm}
                onChange={handlePaymentChange}
                onBack={() => setStep(2)}
                onSubmit={handlePlaceOrder}
              />
            )}
          </div>

          <OrderSummary
            step={step}
            cartSubtotal={cartSubtotal}
            cartTotal={cartTotal}
            discountAmount={discountAmount}
            discountPercent={discountPercent}
            shipping={shipping}
            promoCode={promoCode}
            removePromo={removePromo}
            promoInput={promoInput}
            setPromoInput={setPromoInput}
            promoError={promoError}
            promoSuccess={promoSuccess}
            onPromoSubmit={handlePromoSubmit}
            onCheckout={() => setStep(2)}
          />
        </div>
      )}
    </motion.div>
  );
}
