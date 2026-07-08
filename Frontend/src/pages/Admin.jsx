import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardCard from "../components/admin/DashboardCard";
import ProductTable from "../components/admin/ProductTable";
import OrderTable from "../components/admin/OrderTable";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { formatPrice } from "../utils/productUtils";
import { productService } from "../services/productService";
import {
  calcTotalSales,
  countPendingOrders,
} from "../utils/orderUtils";
import { orderService } from "../services/orderService";
import { Banknote, ShoppingCart, Tag, Users, ShieldAlert, LogOut, Sliders } from "lucide-react";
import { motion } from "framer-motion";

const DEFAULT_ORDERS = [
  {
    id: "FH84302",
    customerName: "Jane Doe",
    customerEmail: "jane@example.com",
    date: "June 20, 2026",
    totalAmount: 12350,
    status: "Shipped",
    itemsSummary: "Mulberry Silk Slip Dress (x1), Fine Ribbed Cashmere Sweater (x1)",
  },
  {
    id: "FH29471",
    customerName: "Sarah Connor",
    customerEmail: "sarah@example.com",
    date: "June 22, 2026",
    totalAmount: 6800,
    status: "Pending",
    itemsSummary: "Leather Shoulder Saddle Bag (x1)",
  },
  {
    id: "FH10294",
    customerName: "Emma Watson",
    customerEmail: "emma@example.com",
    date: "June 23, 2026",
    totalAmount: 38000,
    status: "Pending",
    itemsSummary: "Tailored Double-Breasted Trench (x1)",
  },
];

export default function Admin() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("products");
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);

  useScrollToTop();

  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const prodData = await productService.fetchProducts();
        setProductsList(prodData);
        
        const catData = await productService.fetchCategories();
        setCategoriesList(catData);

        const token = localStorage.getItem("fh_access_token");
        if (token) {
          const ordData = await orderService.fetchAllOrders(token);
          const mapped = ordData.map(order => {
            const itemsSummary = (order.items || [])
              .map(i => `${i.product?.title || i.product?.name || "Product"} (x${i.quantity})`)
              .join(", ");
            return {
              id: order.orderId,
              _id: order._id,
              customerName: order.customerName,
              customerEmail: order.customerEmail,
              date: new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              totalAmount: order.totalAmount,
              status: order.status,
              itemsSummary
            };
          });
          setOrdersList(mapped);
        }
      } catch (err) {
        console.error("Failed to load catalog/order data:", err);
      }
    };
    loadData();
  }, [currentUser, isAdmin, navigate]);

  const resolveCategoryObjectId = (categorySlugOrObj) => {
    if (/^[0-9a-fA-F]{24}$/.test(categorySlugOrObj)) {
      return categorySlugOrObj;
    }
    const foundCat = categoriesList.find(c => c.slug === categorySlugOrObj);
    if (foundCat) return foundCat._id;
    if (categoriesList.length > 0) return categoriesList[0]._id;
    return categorySlugOrObj;
  };

  const handleUpdateProducts = async (updated) => {
    try {
      // 1. Identify deletion
      const deletedProduct = productsList.find(p => !updated.some(u => u.id === p.id));
      if (deletedProduct) {
        await productService.deleteProduct(deletedProduct.id);
      }

      // 2. Identify additions and updates
      for (const prod of updated) {
        const categoryId = resolveCategoryObjectId(prod.category);
        const mappedProd = { ...prod, category: categoryId };

        const isNew = String(prod.id).startsWith("p_");
        if (isNew) {
          await productService.createProduct(mappedProd);
        } else {
          const original = productsList.find(p => p.id === prod.id);
          if (original && JSON.stringify(original) !== JSON.stringify(prod)) {
            await productService.updateProduct(prod.id, mappedProd);
          }
        }
      }

      const data = await productService.fetchProducts();
      setProductsList(data);
    } catch (err) {
      alert(err.message || "Failed to update catalog on the server");
    }
  };

  const handleUpdateOrders = async (updated) => {
    const token = localStorage.getItem("fh_access_token");
    if (!token) return;

    try {
      // Find which order was changed and sync with DB
      for (const updatedOrder of updated) {
        const originalOrder = ordersList.find(o => o.id === updatedOrder.id);
        if (originalOrder && originalOrder.status !== updatedOrder.status) {
          await orderService.updateOrderStatus(updatedOrder._id, updatedOrder.status, null, token);
        }
      }

      // Re-fetch all orders to display updated DB records
      const ordData = await orderService.fetchAllOrders(token);
      const mapped = ordData.map(order => {
        const itemsSummary = (order.items || [])
          .map(i => `${i.product?.title || i.product?.name || "Product"} (x${i.quantity})`)
          .join(", ");
        return {
          id: order.orderId,
          _id: order._id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          date: new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          totalAmount: order.totalAmount,
          status: order.status,
          itemsSummary
        };
      });
      setOrdersList(mapped);
    } catch (err) {
      alert(err.message || "Failed to update order status on database.");
    }
  };

  const totalSales = calcTotalSales(ordersList);
  const pendingCount = countPendingOrders(ordersList);

  if (!currentUser || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <ShieldAlert size={48} className="text-red-500 mx-auto stroke-1" />
        <h2 className="font-serif text-2xl font-light text-brand-dark">Unauthorized Access</h2>
        <p className="text-xs text-brand-muted">You do not have administrative privileges to view this page.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2.5 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest rounded-sm"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-brand-sand/30 pb-6 mb-8 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold flex items-center gap-1">
            <Sliders size={12} /> Management Portal
          </span>
          <h1 className="font-serif text-3xl font-light text-brand-dark mt-1">Admin Dashboard</h1>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm transition-colors mt-4 sm:mt-0"
        >
          <LogOut size={12} />
          Sign Out Portal
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <DashboardCard
          title="Gross Sales"
          value={formatPrice(totalSales)}
          icon={Banknote}
          description="Total settled sales"
          trend="+14.2%"
        />
        <DashboardCard
          title="Fulfillment"
          value={ordersList.length}
          icon={ShoppingCart}
          description={`${pendingCount} Pending shipments`}
          trend="+8%"
        />
        <DashboardCard
          title="Active Catalog"
          value={productsList.length}
          icon={Tag}
          description="In-stock product styles"
          trend="+3 new"
        />
        <DashboardCard
          title="Store Customers"
          value="1,490"
          icon={Users}
          description="Active shopper subscribers"
          trend="+18%"
        />
      </div>

      <div className="flex border-b border-brand-champagne mb-8 text-[11px] uppercase font-bold tracking-wider text-left">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-2.5 pr-8 border-b-2 transition-all ${
            activeTab === "products" ? "border-brand-dark text-brand-dark" : "border-transparent text-brand-muted"
          }`}
        >
          Manage Catalog ({productsList.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-2.5 pr-8 border-b-2 transition-all ${
            activeTab === "orders" ? "border-brand-dark text-brand-dark" : "border-transparent text-brand-muted"
          }`}
        >
          Fulfillment Orders ({ordersList.length})
        </button>
      </div>

      <div className="transition-all duration-300">
        {activeTab === "products" ? (
          <ProductTable productsList={productsList} onUpdateProducts={handleUpdateProducts} />
        ) : (
          <OrderTable ordersList={ordersList} onUpdateOrders={handleUpdateOrders} />
        )}
      </div>
    </motion.div>
  );
}
