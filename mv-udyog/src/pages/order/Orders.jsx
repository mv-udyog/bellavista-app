import { useEffect, useState } from "react";
import api from "@/api/axios.js";
import MainLayout from "@/layout/MainLayout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { 
  Package, 
  RotateCcw, 
  ShoppingBag, 
  Clock,
  Eye
} from "lucide-react"; 
import BottomNav from "@/components/common/BottomNav";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");

      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);

  // Helper for status badge styling
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'placed':
      case 'processing':
        return "bg-blue-50 text-blue-600 border-blue-100";
      case 'cancelled':
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <MainLayout>
      <div className="bg-[#f8fafc] min-h-screen pb-24">
        
        {/* STICKY HEADER */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-5">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Order History
          </h1>
        </div>

        <div className="px-5 py-6">
          {/* EMPTY STATE */}
          {!orders || orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 text-center px-10">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="text-slate-300 w-10 h-10" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">No orders yet</h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Your mountain-fresh water is just a tap away. Start your first order now!
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100"
                onClick={() => navigate('/')}
              >
                Browse Products
              </motion.button>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
                >
                  {/* ORDER CARD TOP: Status & ID */}
                  <div className="p-4 border-b border-slate-50 flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <Package size={20} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                          Order #{order.id?.slice(-6) || "BV-772"}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock size={12} className="text-slate-400" />
                          <p className="text-xs text-slate-500 font-medium">{new Date(order.createdAt).toLocaleString("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
})}</p>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getStatusStyles(order.status)}`}>
                      {order.status || 'Placed'}
                    </span>
                  </div>

                  {/* ORDER CONTENT SUMMARY */}
                  <div className="px-4 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-slate-800">
  {order.items?.reduce(
    (total, item) =>
      total + (item.quantity || 0),
    0
  ) || 0} Boxes
</p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate w-48">
  {order.items?.[0]?.name ||
    "Bellavista Natural"}
</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-medium">Total Amount</p>
                        <p className="text-base font-black text-slate-900">₹{order.totalAmount}</p>
                      </div>
                    </div>
                  </div>

                  {/* ACTION FOOTER */}
                  <div className="px-4 py-3 bg-slate-50/50 flex gap-2">
                    {/* Updated Navigation Link */}
                    <button 
                      onClick={() => navigate(`/track/${order.id || index}`, { state: { order } })}
                      className="flex-1 bg-white border border-slate-200 py-2.5 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 active:bg-slate-100 transition-colors"
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                    
                    <motion.button 
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 bg-blue-600 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md shadow-blue-50"
                    >
                      <RotateCcw size={14} />
                      Reorder
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </MainLayout>
  );
}