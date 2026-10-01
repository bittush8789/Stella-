import React, { useState, useRef } from 'react';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  ShoppingBag,
  LogOut,
  ArrowLeft,
  XCircle,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Camera,
  Upload,
  ShieldCheck
} from 'lucide-react';
import { Address, Order, OrderStatus, User, WishlistItem } from '../types/microservices';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { authAndStorageService } from '../services/authAndStorageService';
import { formatINR } from '../utils/currency';
import { OrderTrackingStepper } from './OrderTrackingStepper';

interface Props {
  user: User;
  orders: Order[];
  wishlist: WishlistItem[];
  onBackToShopping: () => void;
  onRefreshOrders: () => void;
  onUserUpdated: (u: User) => void;
  onOpenAuth: () => void;
}

export const UserAccount: React.FC<Props> = ({
  user,
  orders,
  wishlist,
  onBackToShopping,
  onRefreshOrders,
  onUserUpdated,
  onOpenAuth
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses'>(
    'orders'
  );

  // Profile Edit State
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add Address State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [newCountry, setNewCountry] = useState('India');

  // Cancel order state
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const uploadedUrl = await authAndStorageService.uploadImage(file, 'avatars');
      setAvatarUrl(uploadedUrl);
      const res = await userService.updateUser(user.id, { avatarUrl: uploadedUrl });
      if (res.success && res.data) {
        onUserUpdated(res.data);
        setProfileSuccessMsg('Profile picture updated successfully!');
        setTimeout(() => setProfileSuccessMsg(''), 3000);
      }
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await userService.updateUser(user.id, { name, phone, avatarUrl });
    if (res.success && res.data) {
      onUserUpdated(res.data);
      setProfileSuccessMsg('Profile updated successfully!');
      setTimeout(() => setProfileSuccessMsg(''), 3000);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPostal) return;

    const res = await userService.addAddress(user.id, {
      fullName: user.name,
      phoneNumber: user.phone,
      street: newStreet,
      city: newCity,
      state: newState,
      postalCode: newPostal,
      country: newCountry,
      isDefault: user.addresses.length === 0
    });

    if (res.success) {
      const refreshed = await userService.getUserById(user.id);
      if (refreshed.success && refreshed.data) {
        onUserUpdated(refreshed.data);
      }
      setIsAddingAddress(false);
      setNewStreet('');
      setNewCity('');
      setNewState('');
      setNewPostal('');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    const res = await userService.deleteAddress(user.id, addressId);
    if (res.success) {
      const refreshed = await userService.getUserById(user.id);
      if (refreshed.success && refreshed.data) {
        onUserUpdated(refreshed.data);
      }
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancellingOrderId(orderId);
    try {
      const res = await orderService.cancelOrder(orderId);
      if (res.success) {
        onRefreshOrders();
      }
    } finally {
      setCancellingOrderId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Breadcrumb */}
      <button
        onClick={onBackToShopping}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
      </button>

      {/* Account Overview Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-teal-100 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-teal-500 text-white font-black text-xl flex items-center justify-center ring-4 ring-teal-100 shadow-sm">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 text-white rounded-full hover:bg-teal-600 transition-colors shadow-sm cursor-pointer"
              title="Change profile photo"
            >
              <Camera className="w-3 h-3" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarFileSelect}
              className="hidden"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-teal-50 text-teal-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Customer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.email} · {user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out / Switch Account
          </button>
        </div>
      </div>

      {/* Main Account Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Navigation Tabs */}
        <div className="md:col-span-1 space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold rounded-2xl transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === 'orders' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold rounded-2xl transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile & Photo</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold rounded-2xl transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Delivery Addresses</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === 'addresses' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {user.addresses.length}
            </span>
          </button>
        </div>

        {/* Right Tab Content */}
        <div className="md:col-span-3">
          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-slate-900">Your Orders & Shipments</h2>
                <span className="text-xs text-slate-500">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-800">No orders yet</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Once you place an order, shipment status and delivery details will appear here.
                  </p>
                  <button
                    onClick={onBackToShopping}
                    className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                orders.map((order) => {
                  const isCancelable =
                    order.orderStatus === 'Pending' ||
                    order.orderStatus === 'Confirmed' ||
                    order.orderStatus === 'Processing';

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-slate-900">
                              {order.id}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                order.orderStatus === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : order.orderStatus === 'Cancelled'
                                  ? 'bg-rose-50 text-rose-600'
                                  : 'bg-teal-50 text-teal-600'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-bold text-slate-900 tabular-nums">
                            {formatINR(order.pricing.total)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {order.paymentMethod} ({order.paymentStatus})
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs py-1">
                            <div>
                              <span className="font-semibold text-slate-800">
                                {item.productName}
                              </span>
                              <span className="text-slate-400 ml-1.5">
                                ({item.brand} · Size: {item.size} · {item.color.name} · Qty: {item.quantity})
                              </span>
                            </div>
                            <span className="font-medium text-slate-700 tabular-nums">
                              {formatINR((item.discountPrice ?? item.price) * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order Progress Tracking Stepper */}
                      <div className="pt-2">
                        <OrderTrackingStepper
                          status={order.orderStatus}
                          orderId={order.id}
                          createdAt={order.createdAt}
                          estimatedDelivery={order.estimatedDelivery}
                          destinationCity={order.shippingAddress?.city}
                        />
                      </div>

                      {/* Footer Info & Actions */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                        <div>
                          <span>Est. Delivery: <strong>{order.estimatedDelivery}</strong></span>
                          <span className="mx-2">·</span>
                          <span>Delivery to: {order.shippingAddress.city}, {order.shippingAddress.country}</span>
                        </div>

                        {isCancelable && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancellingOrderId === order.id}
                            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors self-start sm:self-auto cursor-pointer"
                          >
                            {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Edit Personal Information</h2>

              {profileSuccessMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {profileSuccessMsg}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                {/* Avatar Preview & Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar preview"
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-teal-500/30"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <UserIcon className="w-6 h-6" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {isUploadingImage ? 'Uploading...' : 'Upload New Photo'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Saved Delivery Addresses</h2>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isAddingAddress ? 'Cancel' : 'Add New Address'}
                </button>
              </div>

              {isAddingAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="p-5 bg-white rounded-3xl border border-teal-200 space-y-3"
                >
                  <span className="text-xs font-bold text-slate-900 block">Add New Delivery Address</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Flat, building, street address"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City / District"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State (e.g. Maharashtra)"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="6-Digit PIN Code"
                      maxLength={6}
                      value={newPostal}
                      onChange={(e) => setNewPostal(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Save Delivery Address
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600">{addr.street}</p>
                      <p className="text-slate-600">
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-slate-500 font-medium">{addr.country}</p>
                      <p className="text-slate-400 text-[11px] pt-1">Phone: {addr.phoneNumber}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
