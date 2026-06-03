import MainLayout from "@/layout/MainLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  ShoppingBag, 
  Clock, 
  CreditCard,
  Sparkles
} from "lucide-react";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");

  const date = location.state?.date || "Scheduled";
  const total = location.state?.total || 0;
  const paymentMethod = location.state?.paymentMethod || "Pay on Delivery";

  useEffect(() => {
    const id = "BV-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(id);
  }, []);

  return (
    <MainLayout>
      <div className="px-6 py-10 bg-[#f8fafc] min-h-screen flex flex-col items-center justify-center">
        
        {/* --- ANIMATED SUCCESS ICON --- */}
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-blue-400 rounded-full"
          />
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="relative w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-200"
          >
            <CheckCircle2 size={48} className="text-white" strokeWidth={3} />
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-2 -right-2 text-yellow-400"
          >
            <Sparkles size={24} />
          </motion.div>
        </div>

        {/* --- SUCCESS TEXT --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Order Confirmed!
          </h1>
          <p className="text-sm text-slate-500 font-medium px-10">
            Your Himalayan hydration is being prepared for delivery.
          </p>
        </motion.div>

        {/* --- PREMIUM RECEIPT CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden mb-8"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-2 bg-[#f8fafc] rounded-b-full" />

          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</span>
              <span className="text-sm font-bold text-slate-900">{orderId}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Arriving</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{date}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard size={14} className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{paymentMethod}</span>
            </div>

            <div className="border-t-2 border-dashed border-slate-100 my-2" />

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Paid</p>
                <p className="text-2xl font-black text-slate-900">₹{total}</p>
              </div>
              <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                <span className="text-[10px] font-black uppercase">Success</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- DELIVERY INFO BOX --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-600/5 border border-blue-100 p-5 rounded-3xl flex items-start gap-4 mb-10 w-full"
        >
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 flex-shrink-0">
            <Package size={20} />
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            Our delivery partner will contact you upon arrival at your location. You can track the live status in the "My Orders" section.
          </p>
        </motion.div>

        {/* --- BUTTONS --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full space-y-4"
        >
          {/* CORRECTED: Removed the comment from inside the tag to fix PARSE_ERROR */}
          <button
            onClick={() => navigate("/home", { replace: true })}
            className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm shadow-xl shadow-slate-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <ShoppingBag size={18} />
            CONTINUE SHOPPING
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="w-full group bg-white text-slate-900 py-5 rounded-[2rem] font-black text-sm border border-slate-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            TRACK ORDER
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </MainLayout>
  );
}