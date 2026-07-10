import { STORAGE_KEYS } from "./storageKeys";
import { getStoredJSON, setStoredJSON } from "../hooks/useLocalStorage";

export function formatPrice(price) {
  return `Rs ${Number(price).toLocaleString()}`;
}

export function loadProducts(initialProducts) {
  const stored = getStoredJSON(STORAGE_KEYS.PRODUCTS, null);
  if (stored) {
    // Self-healing merge: if new default items are added or fields updated, sync with local storage
    const storedIds = new Set(stored.map((p) => p.id));
    const missingItems = initialProducts.filter((p) => !storedIds.has(p.id));
    
    let changed = missingItems.length > 0;
    const updatedStored = stored.map((item) => {
      const initial = initialProducts.find((p) => p.id === item.id);
      if (initial) {
        // Sync name, price, images, description, rating, stock, and isBestSeller flag if changed in source file
        const nameChanged = item.name !== initial.name;
        const priceChanged = item.price !== initial.price;
        const descChanged = item.description !== initial.description;
        const imagesChanged = JSON.stringify(item.images) !== JSON.stringify(initial.images);
        const ratingChanged = item.rating !== initial.rating;
        const stockChanged = item.stock !== initial.stock;
        const bestSellerChanged = initial.isBestSeller && !item.isBestSeller;
        
        if (nameChanged || priceChanged || descChanged || imagesChanged || ratingChanged || stockChanged || bestSellerChanged) {
          changed = true;
          return {
            ...item,
            name: initial.name,
            price: initial.price,
            description: initial.description,
            images: initial.images,
            rating: initial.rating,
            stock: initial.stock,
            inStock: initial.stock > 0,
            category: initial.category || item.category,
            isBestSeller: initial.isBestSeller || item.isBestSeller
          };
        }
      }
      return item;
    });

    if (changed) {
      const merged = [...updatedStored, ...missingItems];
      setStoredJSON(STORAGE_KEYS.PRODUCTS, merged);
      return merged;
    }
    return stored;
  }
  setStoredJSON(STORAGE_KEYS.PRODUCTS, initialProducts);
  return initialProducts;
}

export function saveProducts(products) {
  setStoredJSON(STORAGE_KEYS.PRODUCTS, products);
}

export function findProductById(products, id) {
  return products.find((p) => p.id === id);
}

export function filterProducts(products, { category, size, priceRange, searchQuery }) {
  return products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesSize = !size || product.sizes.includes(size);
    const matchesPrice = product.price <= priceRange;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSize && matchesPrice && matchesSearch;
  });
}

export function sortProducts(products, sortBy) {
  return [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.isFeatured ? 1 : -1;
  });
}

export function searchProducts(products, query, limit = 5) {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower)
  );
  return filtered.slice(0, limit);
}

export function getRelatedProducts(products, product, limit = 4) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function buildProductPayload(formData, editingProduct) {
  const { name, price, category, description, imageUrl1, imageUrl2, sizes, inStock } = formData;
  return {
    id: editingProduct ? editingProduct.id : "p_" + Date.now(),
    name,
    price: Number(price),
    category,
    description,
    images: [
      imageUrl1 || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
      imageUrl2 || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800",
    ],
    sizes,
    colors: editingProduct
      ? editingProduct.colors
      : [
          { name: "Default Neutral", value: "#E3D9D1" },
          { name: "Charcoal", value: "#2A2A2A" },
        ],
    rating: editingProduct ? editingProduct.rating : 5.0,
    reviewsCount: editingProduct ? editingProduct.reviewsCount : 1,
    isFeatured: editingProduct ? editingProduct.isFeatured : false,
    inStock,
    details: editingProduct
      ? editingProduct.details
      : ["Premium quality blend", "Dry clean recommended", "Imported"],
  };
}

export function mapBackendProduct(prod) {
  if (!prod) return null;
  const backendUrl = "http://localhost:5000";

  const rawImages = prod.images || [];
  const normalizedImages = rawImages.map(img => {
    if (typeof img === 'string') {
      return {
        url: img.startsWith("/") ? `${backendUrl}${img}` : img,
        publicId: img,
        isPrimary: false
      };
    }
    return {
      url: img.url.startsWith("/") ? `${backendUrl}${img.url}` : img.url,
      publicId: img.publicId,
      isPrimary: !!img.isPrimary
    };
  });

  // Ensure at least one primary image exists if we have images
  if (normalizedImages.length > 0 && !normalizedImages.some(img => img.isPrimary)) {
    normalizedImages[0].isPrimary = true;
  }

  const primaryImgObj = normalizedImages.find(img => img.isPrimary) || normalizedImages[0];
  const primaryImageUrl = primaryImgObj ? primaryImgObj.url : "";
  const imagesUrls = normalizedImages.map(img => img.url);

  return {
    id: prod._id || prod.id,
    name: prod.title || prod.name,
    price: prod.price,
    discountPrice: prod.discountPrice !== undefined ? prod.discountPrice : "",
    category: typeof prod.category === "object" && prod.category !== null ? prod.category.slug : (prod.category || "unstitched"),
    image: primaryImageUrl,
    images: imagesUrls, // Keep flat URL list for compatibility with existing components
    rawImages: normalizedImages, // Object array format [{url, publicId, isPrimary}] for admin form modal
    description: prod.description,
    rating: prod.rating || 5.0,
    reviewsCount: prod.reviewsCount || 0,
    stock: prod.stock || 0,
    inStock: (prod.stock || 0) > 0,
    sizes: prod.sizes || [],
    colors: prod.colors || [],
    isFeatured: prod.featured || false,
    isBestSeller: prod.featured || false,
    details: prod.details || [
      "Premium quality blend",
      "Dry clean recommended",
      "Imported"
    ]
  };
}

