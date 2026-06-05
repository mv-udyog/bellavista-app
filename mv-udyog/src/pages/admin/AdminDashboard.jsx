import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Phone, MapPin, User, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/all-orders", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Failed to fetch from server");
      
      const data = await response.json();
      console.log("LOG: Raw Orders Data Received:", data); // Check your browser console!
      console.log(
  "FIRST ORDER USER:",
  data?.[0]?.user
);
    console.log("FIRST ORDER ITEMS", data?.[0]?.items);
    console.log("FIRST ITEM", data?.[0]?.items?.[0]);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5000/api/admin/update-order-status", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ orderId, status: newStatus })
    });
    fetchOrders(); 
  };

  const totalOrders = orders.length;

const pendingOrders = orders.filter(
  (o) =>
    o.status === "PLACED" ||
    o.status === "CONFIRMED"
).length;

const deliveredOrders = orders.filter(
  (o) => o.status === "DELIVERED"
).length;

const totalRevenue = orders
  .filter((o) => o.status === "DELIVERED")
  .reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse uppercase tracking-widest">Scanning Bellavista Database...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Bellavista Control</h1>
            <p className="text-slate-500 font-medium italic">MV Udyog Logistics & Dispatch</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors"
          >
            Refresh Feed
          </button>
        </header>

        {/* DASHBOARD STATS */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
    <p className="text-xs text-slate-400 font-bold uppercase">
      Total Orders
    </p>
    <h2 className="text-4xl font-black text-slate-900">
      {totalOrders}
    </h2>
  </div>

  <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
    <p className="text-xs text-slate-400 font-bold uppercase">
      Pending
    </p>
    <h2 className="text-4xl font-black text-orange-500">
      {pendingOrders}
    </h2>
  </div>

  <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
    <p className="text-xs text-slate-400 font-bold uppercase">
      Delivered
    </p>
    <h2 className="text-4xl font-black text-green-500">
      {deliveredOrders}
    </h2>
  </div>

  <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
    <p className="text-xs text-slate-400 font-bold uppercase">
      Revenue
    </p>
    <h2 className="text-4xl font-black text-blue-600">
      ₹{totalRevenue}
    </h2>
  </div>
</div>

<div className="mb-6">
  <input
    type="text"
    placeholder="Search customer, phone or order..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full bg-white border border-slate-200 rounded-3xl px-5 py-4 shadow-sm outline-none focus:border-blue-500"
  />
</div>
<div className="flex gap-2 overflow-x-auto mb-8">
  {[
    "ALL",
    "PLACED",
    "CONFIRMED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ].map((status) => (
    <button
      key={status}
      onClick={() => setFilter(status)}
      className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap ${
        filter === status
          ? "bg-blue-600 text-white"
          : "bg-white text-slate-500 border border-slate-200"
      }`}
    >
      {status.replaceAll("_", " ")}
    </button>
  ))}
</div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
            <AlertCircle size={18} /> Error: {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200">
            <Package size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest">Database is empty: No orders found</p>
            <p className="text-xs text-slate-300 mt-2">Try placing a test order on the website first.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders
  .filter((order) => {
    const matchesSearch =
      (order.user?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (order.address?.phone || "")
        .includes(search);

    const matchesFilter =
      filter === "ALL"
        ? true
        : order.status === filter;

    return (
      matchesSearch &&
      matchesFilter
    );
  })
  .map((order) => (
              <div key={order.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex flex-col lg:flex-row gap-8 items-start justify-between">
                
                {/* 1. CUSTOMER INFO */}
<div className="flex-1 space-y-4">

  <div className="flex justify-between items-start">

    <div className="flex items-center gap-2">
      <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-md uppercase">
        #{order.id.slice(-6)}
      </span>

      <span
        className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
          order.status === "DELIVERED"
            ? "bg-green-100 text-green-700"
            : order.status === "OUT_FOR_DELIVERY"
            ? "bg-orange-100 text-orange-700"
            : order.status === "CONFIRMED"
            ? "bg-blue-100 text-blue-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {order.status.replaceAll("_", " ")}
      </span>
    </div>

  </div>

  <div className="flex items-center gap-3">
    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
      <User size={22} />
    </div>

    <div>
      <h3 className="font-black text-slate-900 text-lg uppercase leading-tight">
        {order.address?.fullName || "Unknown Customer"}
      </h3>

      <p className="text-sm text-slate-500 font-medium">
        {order.address?.phone || "No Phone"}
      </p>

      <p className="text-xs text-slate-400 font-semibold mt-1">
        {new Date(order.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  </div>

</div>

                {/* 2. DELIVERY ADDRESS */}
                <div className="flex-[1.5] space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 w-full lg:w-auto">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-red-500 shrink-0" size={20} />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Shipping Details</p>
                      <p className="text-sm font-bold text-slate-800 leading-relaxed">
  {order.address?.street || "No street info"}
  <br />
  {order.address?.city}
  <br />
  <span className="text-slate-500 uppercase text-xs">
    {order.address?.state} - {order.address?.pincode}
  </span>
</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                    <Phone className="text-emerald-500" size={18} />
                    <a href={`tel:${order.address?.phone}`} className="text-sm font-black text-slate-900 hover:text-blue-600">
                      {order.address?.phone || "Phone Hidden/Missing"}
                    </a>
                  </div>
                </div>

{/* ORDER ITEMS */}

<div className="w-full lg:w-[320px] bg-blue-50 rounded-3xl p-5 border border-blue-100">
  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">
    Ordered Products
  </p>

  <div className="space-y-2">
    {order.items?.map((item) => (
      <div
        key={item.id}
        className="flex items-center justify-between bg-white rounded-xl px-3 py-2"
      >
        <div>
  <p className="font-black text-slate-900">
    💧 {item.name}
  </p>

  <p className="text-[10px] text-red-500">
    ID: {item.productId}
  </p>


  <p className="text-xs text-slate-400">
    {item.quantity} Box
  </p>
</div>

        <span className="font-black text-blue-600">
          × {item.quantity}
        </span>
      </div>
    ))}
  </div>

  <div className="mt-4 pt-3 border-t border-blue-200 space-y-3">

  <div className="flex justify-between items-center">
    <span className="text-xs font-black uppercase text-slate-500">
      Total Boxes
    </span>

    <span className="text-xl font-black text-blue-700">
      {order.items?.reduce(
        (sum, item) => sum + item.quantity,
        0
      )}
    </span>
  </div>

  <div className="flex justify-between items-center">
    <span className="text-xs font-black uppercase text-slate-500">
      Order Value
    </span>

    <span className="text-xl font-black text-emerald-600">
      ₹{order.totalAmount}
    </span>
  </div>

</div>
  </div>

                {/* 3. LOGISTICS CONTROL */}
                <div className="flex flex-col gap-2 w-full lg:w-auto">
                  <button 
                    onClick={() => updateStatus(order.id, 'OUT_FOR_DELIVERY')}
                    className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-orange-600 transition-all uppercase tracking-widest"
                  >
                    <Truck size={16} /> Dispatch
                  </button>
                  <button 
                    onClick={() => updateStatus(order.id, 'DELIVERED')}
                    className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-emerald-600 transition-all uppercase tracking-widest"
                  >
                    <CheckCircle size={16} /> Complete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}