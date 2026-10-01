import React, { useState } from 'react';
import {
  Layers,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Search,
  Check,
  X
} from 'lucide-react';
import { AdminMetrics } from '../services/adminService';
import { ClothingCategory, ClothingSize, Order, OrderStatus, Product, User } from '../types/microservices';
import { adminService } from '../services/adminService';
import { formatINR } from '../utils/currency';

interface Props {
  metrics: AdminMetrics;
  products: Product[];
  orders: Order[];
  users: User[];
  onRefreshAll: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<Props> = ({
  metrics,
  products,
  orders,
  users,
  onRefreshAll,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>(
    'overview'
  );

  // Product Create/Edit Modal State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ClothingCategory>('T-Shirts');
  const [prodBrand, setProdBrand] = useState('Uniqlo');
  const [prodPrice, setProdPrice] = useState(1299);
  const [prodDiscountPrice, setProdDiscountPrice] = useState<number | undefined>(799);
  const [prodStock, setProdStock] = useState(15);
  const [prodDescription, setProdDescription] = useState('');
  const [prodSearch, setProdSearch] = useState('');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const openNewProductModal = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('T-Shirts');
    setProdBrand('Uniqlo');
    setProdPrice(1299);
    setProdDiscountPrice(799);
    setProdStock(15);
    setProdDescription('High quality Japanese cotton with soft hand-feel.');
    setIsEditingProduct(true);
  };

  const openEditProductModal = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdBrand(p.brand);
    setProdPrice(p.price);
    setProdDiscountPrice(p.discountPrice);
    setProdStock(p.stock);
    setProdDescription(p.description);
    setIsEditingProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      await adminService.editProduct(editingProductId, {
        name: prodName,
        category: prodCategory,
        brand: prodBrand,
        price: prodPrice,
        discountPrice: prodDiscountPrice || undefined,
        stock: prodStock,
        description: prodDescription
      });
    } else {
      await adminService.addProduct({
        name: prodName,
        category: prodCategory,
        brand: prodBrand,
        price: prodPrice,
        discountPrice: prodDiscountPrice || undefined,
        stock: prodStock,
        description: prodDescription,
        availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
        availableColors: [{ name: 'Slate Gray', hex: '#64748B' }, { name: 'White', hex: '#FFFFFF' }],
        rating: 4.8,
        reviewsCount: 1,
        status: 'new_arrival'
      });
    }
    setIsEditingProduct(false);
    onRefreshAll();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await adminService.deleteProduct(id);
      onRefreshAll();
    }
  };

  const handleStockQuickUpdate = async (id: string, newStock: number) => {
    await adminService.updateStock(id, newStock);
    onRefreshAll();
  };

  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
    await adminService.updateOrderStatus(orderId, status);
    onRefreshAll();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: status });
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(prodSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-6">
        <div>
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Service Console</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized management hub for Products, Orders, Users, and Inventory (India Region)
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto text-xs font-semibold">
          {(['overview', 'products', 'orders', 'users'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl transition-all capitalize cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase">Products</span>
                <Package className="w-4 h-4 text-teal-500" />
              </div>
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {metrics.totalProducts}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Across 10 categories</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase">Users</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {metrics.totalUsers}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Active profiles</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase">Total Orders</span>
                <ShoppingCart className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {metrics.totalOrders}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">All transactions</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase">Total Sales</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-2xl font-black text-emerald-600 tabular-nums">
                {formatINR(metrics.totalSales)}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Gross revenue</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase">Pending</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-2xl font-black text-amber-600 tabular-nums">
                {metrics.pendingOrdersCount}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Awaiting fulfillment</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase">Low Stock</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <span className="text-2xl font-black text-rose-600 tabular-nums">
                {metrics.lowStockCount}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">&le; 5 units remaining</span>
            </div>
          </div>

          {/* Quick Actions & Recent Orders Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-teal-600 font-semibold hover:underline cursor-pointer"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 4).map((o) => (
                  <div
                    key={o.id}
                    className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{o.id}</span>
                      <span className="text-slate-400 ml-2">by {o.customerName}</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        {o.items.length} garments · {o.paymentMethod}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-slate-900 block tabular-nums">
                        {formatINR(o.pricing.total)}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          o.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-700'
                            : o.orderStatus === 'Cancelled'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-teal-100 text-teal-700'
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low-Stock Inventory Alerts */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Low-Stock Inventory Alerts</h3>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs text-teal-600 font-semibold hover:underline cursor-pointer"
                >
                  Manage Stock &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {products
                  .filter((p) => p.stock <= 8)
                  .slice(0, 4)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{p.name}</span>
                        <span className="text-slate-400 ml-1.5">({p.brand} · {p.category})</span>
                        <span className="block text-[11px] text-slate-500">
                          Price: {formatINR(p.discountPrice ?? p.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            p.stock <= 5
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {p.stock} units
                        </span>

                        <button
                          onClick={() => handleStockQuickUpdate(p.id, p.stock + 10)}
                          className="px-2 py-1 bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-semibold rounded shadow-2xs cursor-pointer"
                          title="Restock +10 units"
                        >
                          +10 Restock
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRODUCTS MANAGEMENT ================= */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products in catalog..."
                value={prodSearch}
                onChange={(e) => setProdSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              onClick={openNewProductModal}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {p.name}
                        <span className="block text-[10px] text-slate-400 font-mono font-normal">
                          {p.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">{p.category}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">{p.brand}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                        {formatINR(p.discountPrice ?? p.price)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-semibold tabular-nums ${
                              p.stock <= 5 ? 'text-rose-500' : 'text-slate-800'
                            }`}
                          >
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleStockQuickUpdate(p.id, p.stock + 5)}
                            className="text-[9px] px-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                            title="Add 5 units"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                            p.stock <= 0
                              ? 'bg-slate-100 text-slate-600'
                              : p.stock <= 5
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {p.stock <= 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditProductModal(p)}
                            className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ORDERS MANAGEMENT ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Order Status</th>
                    <th className="py-3 px-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {o.id}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">{o.customerName}</span>
                        <span className="text-[10px] text-slate-400">{o.customerEmail}</span>
                      </td>
                      <td className="py-3 px-4">{o.items.length} garments</td>
                      <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                        {formatINR(o.pricing.total)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700">{o.paymentMethod}</span>
                        <span className="text-[10px] text-slate-400 block">{o.paymentStatus}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            o.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-700'
                              : o.orderStatus === 'Cancelled'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-teal-100 text-teal-700'
                          }`}
                        >
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={o.orderStatus}
                          onChange={(e) =>
                            handleOrderStatusChange(o.id, e.target.value as OrderStatus)
                          }
                          className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: USERS MANAGEMENT ================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Delivery Addresses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-[10px]">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block">{u.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4 font-mono">{u.phone}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 rounded text-slate-700 uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {u.addresses.length} registered ({u.addresses[0]?.city || 'N/A'})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isEditingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsEditingProduct(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingProductId ? 'Edit Clothing Product' : 'Add New Clothing Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ClothingCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Trousers">Trousers</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Sweatshirts">Sweatshirts</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Kurtas">Kurtas</option>
                    <option value="Shorts">Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={prodDiscountPrice ?? ''}
                    onChange={(e) => setProdDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingProductId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
