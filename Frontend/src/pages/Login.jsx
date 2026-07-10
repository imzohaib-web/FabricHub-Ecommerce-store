import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/auth/InputField";
import GoogleButton from "../components/auth/GoogleButton";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login, currentUser, loginWithGoogle, googleClientId } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    // If logged in, auto redirect to Home
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(email, password);
    if (res.success) {
      navigate("/");
    } else {
      setError(res.message);
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    if (window.google && googleClientId) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "email profile openid",
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            const res = await loginWithGoogle(tokenResponse.access_token);
            if (res.success) {
              navigate("/");
            } else {
              setError(res.message);
            }
          }
        },
        error_callback: (err) => {
          setError("Google sign-in failed. Please try again.");
          console.error("Google OAuth token client error:", err);
        }
      });
      client.requestAccessToken();
    } else {
      setError("Google Sign-In is currently unavailable. Please refresh or try again later.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[85h] w-full flex items-stretch bg-white"
    >
      {/* Editorial Split Cover - Left */}
      <div className="hidden lg:block lg:w-1/2 relative bg-brand-champagne">
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 to-transparent" />
        <div className="absolute bottom-12 left-12 text-left text-white max-w-sm space-y-2 z-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">The Edit</span>
          <h2 className="font-serif text-3xl font-light tracking-wide leading-tight">Elevate Your Layering Essentials</h2>
        </div>
      </div>

      {/* Login Form Screen - Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-16 px-6 sm:px-12">
        <div className="max-w-md w-full text-left space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-brand-muted hover:text-brand-dark transition-colors mb-4"
          >
            <ChevronLeft size={12} />
            Back to Home
          </Link>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">Welcome Back</span>
            <h1 className="font-serif text-3xl font-light text-brand-dark mt-1">Sign In</h1>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-sm text-xs font-semibold uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email Address"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <InputField
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-between items-center text-xs pt-1">
              <label className="flex items-center gap-1.5 text-brand-muted select-none cursor-pointer">
                <input type="checkbox" className="accent-brand-gold" />
                Remember Me
              </label>
              <a href="#" className="text-brand-gold hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-dark hover:bg-brand-charcoal text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-sm shadow mt-2"
            >
              Sign In Securely
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-brand-sand/40"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-brand-muted">or</span>
            <div className="flex-grow border-t border-brand-sand/40"></div>
          </div>

          <GoogleButton onClick={handleGoogleLogin} />

          <p className="text-xs text-brand-muted text-center pt-2">
            New to FabricHub?{" "}
            <Link to="/register" className="text-brand-gold hover:underline font-semibold">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
