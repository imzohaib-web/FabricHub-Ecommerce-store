import { mapBackendProduct } from "../utils/productUtils";

const BASE_URL = "http://localhost:5000/api/v1/products";

export const productService = {
  /**
   * Fetch all products from the backend with optional query filters.
   */
  async fetchProducts(params = {}) {
    const query = new URLSearchParams();
    
    if (params.featured !== undefined) {
      query.append("featured", params.featured);
    }
    if (params.search) {
      query.append("search", params.search);
    }
    if (params.category && params.category !== "all") {
      query.append("category", params.category);
    }

    const queryString = query.toString();
    const url = `${BASE_URL}${queryString ? `?${queryString}` : ""}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const result = await response.json();
    return (result.data?.products || []).map(mapBackendProduct);
  },

  /**
   * Fetch a single product by ID.
   */
  async fetchProductById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product details: ${response.statusText}`);
    }
    const result = await response.json();
    return mapBackendProduct(result.data?.product);
  },

  /**
   * Fetch all seeded category documents.
   */
  async fetchCategories() {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data?.categories || [];
  },

  /**
   * Create a new product in the backend.
   */
  async createProduct(productData) {
    const payload = {
      title: productData.name,
      description: productData.description,
      price: Number(productData.price),
      category: productData.category, // Must be MongoDB ObjectId hex string
      images: productData.images,
      sizes: productData.sizes,
      colors: productData.colors,
      stock: productData.stock !== undefined ? Number(productData.stock) : (productData.inStock ? 10 : 0),
      featured: productData.isFeatured || false,
    };

    const token = localStorage.getItem("fh_access_token");
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to create product: ${response.statusText}`);
    }

    const result = await response.json();
    return mapBackendProduct(result.data?.product);
  },

  /**
   * Update an existing product by ID.
   */
  async updateProduct(id, productData) {
    const payload = {
      title: productData.name,
      description: productData.description,
      price: Number(productData.price),
      category: productData.category, // Must be MongoDB ObjectId hex string
      images: productData.images,
      sizes: productData.sizes,
      colors: productData.colors,
      stock: productData.stock !== undefined ? Number(productData.stock) : (productData.inStock ? 10 : 0),
      featured: productData.isFeatured || false,
    };

    const token = localStorage.getItem("fh_access_token");
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to update product: ${response.statusText}`);
    }

    const result = await response.json();
    return mapBackendProduct(result.data?.product);
  },

  /**
   * Delete a product by ID.
   */
  async deleteProduct(id) {
    const token = localStorage.getItem("fh_access_token");
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        ...(token && { "Authorization": `Bearer ${token}` })
      }
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to delete product: ${response.statusText}`);
    }

    return true;
  }
};
