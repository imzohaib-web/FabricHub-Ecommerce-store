import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { useWishlist } from "../hooks/useWishlist";
import { getRelatedProducts } from "../utils/productUtils";
import { productService } from "../services/productService";
import ProductImageGallery from "../components/product-details/ProductImageGallery";
import ProductInfo from "../components/product-details/ProductInfo";
import ProductOptions from "../components/product-details/ProductOptions";
import ProductTabs from "../components/product-details/ProductTabs";
import RelatedProducts from "../components/product-details/RelatedProducts";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [productsList, setProductsList] = useState([]);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [addedMessage, setAddedMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isWishlisted, toggleWishlist } = useWishlist(product?.id);

  useScrollToTop([id]);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const found = await productService.fetchProductById(id);
        if (found) {
          setProduct(found);
          setMainImage(found.images[0]);
          if (found.sizes?.length > 0) setSelectedSize(found.sizes[0]);
          if (found.colors?.length > 0) setSelectedColor(found.colors[0]);
          setQuantity(1);
        } else {
          setError("Product not found");
        }

        const currentList = await productService.fetchProducts();
        setProductsList(currentList);
      } catch (err) {
        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    getProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-dark"></div>
        <p className="text-xs uppercase font-bold tracking-widest text-brand-muted mt-4">Loading details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-4">
        <p className="text-xs uppercase font-bold tracking-widest text-red-600">Error Loading Product</p>
        <p className="text-sm text-brand-muted">{error}</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest rounded-sm"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-light text-brand-dark">Product Not Found</h2>
        <Link to="/shop" className="text-xs font-bold text-brand-gold uppercase tracking-widest hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  const related = getRelatedProducts(productsList, product);

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
  };

  const handleAddToCartSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSize || !selectedColor) return;
    const res = await addToCart(product, selectedSize, selectedColor, quantity);
    if (res && !res.success) {
      alert(res.message);
    } else {
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 4000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="text-left mb-8 flex justify-between items-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-brand-muted hover:text-brand-dark transition-colors"
        >
          <ChevronLeft size={12} />
          Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <ProductImageGallery
          images={product.images}
          mainImage={mainImage}
          onSelectImage={setMainImage}
          productName={product.name}
        />

        <div className="flex flex-col text-left space-y-6">
          <ProductInfo product={product} />

          <ProductOptions
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onSelectColor={setSelectedColor}
            onSelectSize={setSelectedSize}
            quantity={quantity}
            onDecreaseQuantity={() => setQuantity(Math.max(1, quantity - 1))}
            onIncreaseQuantity={() => setQuantity(quantity + 1)}
            isWishlisted={isWishlisted}
            onWishlistToggle={handleWishlistToggle}
            onSubmit={handleAddToCartSubmit}
            addedMessage={addedMessage}
          />

          <ProductTabs product={product} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      <RelatedProducts products={related} />
    </motion.div>
  );
}
