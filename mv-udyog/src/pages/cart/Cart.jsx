import { useCartStore } from "@/store/useCartStore";
import MainLayout from "@/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  ChevronLeft, 
  Calendar, 
  Truck, 
  Minus, 
  Plus, 
  ShieldCheck
} from "lucide-react";

export default function Cart() {
  const { items, increase, decrease, updateQuantity } = useCartStore();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  const subtotal = items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const delivery = 0;
  const total = subtotal + delivery;

  const getDates = () => {
    const labels = ["Tomorrow", "Day 2", "Day 3"];
    return labels.map((label, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return {
        label,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: d.toDateString(),
      };
    });
  };

  const dates = getDates();

  const handleCheckout = () => {
    if (!selectedDate) {
      alert("Please select a delivery date to ensure freshness.");
      return;
    }
    navigate("/checkout", { state: { selectedDate } });
  };

  // ✅ Fixed Manual Edit: Handles empty strings for backspacing
  const handleManualEdit = (id, value) => {
    if (value === "") {
      updateQuantity(id, 0); // Temporary 0 so user can type
      return;
    }
    const num = parseInt(value);
    if (!isNaN(num)) {
      updateQuantity(id, num);
    }
  };

  return (
    <MainLayout>
      <div className="bg-[#f8fafc] min-h-screen pb-40">
        
        {/* --- STICKY HEADER --- */}
        <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 px-6 py-5 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Your Cart</h1>
        </div>

        <div className="px-5 py-6">
          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center mt-20 text-center"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="text-blue-300 w-10 h-10" />
              </div>
              <p className="text-slate-800 font-bold">Your cart is feeling light</p>
              <button onClick={() => navigate("/")} className="mt-6 text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-1">
                Go back to shop
              </button>
            </motion.div>
          ) : (
            <>
              <div className="space-y-4 mb-10">
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Items in Cart</h2>
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      className="flex items-center justify-between bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100"
                    >
                      <div className="flex items-center gap-5">
                        {/* ✅ Larger Bottle Image Container */}
                        <div className="w-24 h-24 bg-blue-50/50 rounded-3xl flex items-center justify-center overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-20 w-20 object-contain drop-shadow-xl"
                          />
                        </div>

                        <div>
                          <h2 className="text-base font-bold text-slate-800 leading-tight">{item.name}</h2>
                          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">{item.size}</p>
                          <p className="text-sm font-black text-slate-900 mt-2">₹{item.price}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                          <button
                            onClick={() => decrease(item.id)}
                            className="p-2 hover:bg-white rounded-xl transition-colors text-slate-600 active:scale-90"
                          >
                            <Minus size={16} strokeWidth={3} />
                          </button>

                          {/* ✅ Improved Input: Focus-ready and bigger */}
                          <input
                            type="number"
                            inputMode="numeric"
                            value={item.quantity === 0 ? "" : item.quantity}
                            onChange={(e) => handleManualEdit(item.id, e.target.value)}
                            onBlur={() => { if(item.quantity < 1) updateQuantity(item.id, 1) }}
                            className="w-10 bg-transparent text-center text-sm font-black text-slate-800 outline-none"
                          />

                          <button
                            onClick={() => increase(item.id)}
                            className="p-2 hover:bg-white rounded-xl transition-colors text-slate-600 active:scale-90"
                          >
                            <Plus size={16} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Delivery Selector & Billing Summary remain the same as your previous design */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4 ml-1">
                  <Calendar size={14} className="text-blue-600" />
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Preferred Delivery</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {dates.map((d) => (
                    <button
                      key={d.label}
                      onClick={() => setSelectedDate(d.fullDate)}
                      className={`flex flex-col items-center min-w-[90px] px-4 py-4 rounded-[1.8rem] border transition-all ${
                        selectedDate === d.fullDate ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-800"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{d.label}</span>
                      <span className="text-xl font-black">{d.dayNum}</span>
                      <span className="text-[10px] font-bold uppercase">{d.month}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Item Total</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500">Delivery Fee</span>
                    <span className="text-emerald-600 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">Free</span>
                  </div>
                  <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Grand Total</p>
                      <p className="text-2xl font-black text-slate-900">₹{total}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <ShieldCheck size={16} />
                      <span className="text-[10px] font-bold uppercase">100% Secure</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="fixed bottom-[90px] left-0 right-0 px-5 py-4 bg-gradient-to-t from-[#f8fafc] to-transparent z-10">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm shadow-2xl flex items-center justify-between px-8"
                >
                  <span className="uppercase tracking-widest">Place Order</span>
                  <span>₹{total}</span>
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}