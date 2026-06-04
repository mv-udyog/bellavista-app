import { useCartStore } from "@/store/useCartStore";
import MainLayout from "@/layout/MainLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/store/useNotificationStore";
import { 
  MapPin, 
  Calendar, 
  CreditCard, 
  ChevronLeft, 
  CheckCircle2, 
  Truck,
  ShieldCheck,
  Phone,
  User,
  ShoppingBag,
  Building2
} from "lucide-react";

export default function Checkout() {
  // ✅ Pull persistent address and setAddress from Zustand store
  const {
  items = [],
  clearCart,
  address,
  setAddress,
  placeOrder,
} = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotificationStore();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const selectedDate = location.state?.selectedDate || "Not selected";
  const subtotal = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const total = subtotal;

  // ✅ Helper to update individual address fields in the store
  const updateAddressField = (field, value) => {
    setAddress({ ...address, [field]: value });
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0 || placingOrder) return;
    setPlacingOrder(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: total,
          address: address, // Store address is sent
          paymentMethod: paymentMethod,
          deliveryDate: selectedDate
        })
      });

      if (!response.ok) throw new Error("Failed to sync with server");

const result = await response.json();

const localOrder = placeOrder({
  id: result.orderId,
  status: "PLACED",

  createdAt: new Date().toISOString(),

  date: new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }),
});

addNotification("🎉 Order placed successfully!");

navigate("/order-success", {
  state: {
    order: localOrder,
    date: selectedDate,
    total,
  },
});
    } catch (error) {
      console.error("Order error:", error);
      addNotification("❌ Failed to place order. Try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-[#f8fafc] min-h-screen pb-48 relative overflow-x-hidden">
        
        {/* --- HEADER --- */}
        <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 px-6 py-5 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Checkout</h1>
        </div>

        <div className="px-5 py-6 space-y-6">
          
          {/* --- ADDRESS PREVIEW (Reads from Store) --- */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.2rem] p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Delivery Address</h2>
              </div>
              <button onClick={() => setShowAddressModal(true)} className="text-[11px] font-black text-blue-600 uppercase">Edit</button>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">{address.name}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{address.street}</p>
              <p className="text-xs text-slate-500">{address.city}, {address.state} - {address.zipCode}</p>
              <div className="flex items-center gap-1.5 mt-2 text-slate-400 font-bold">
                <Phone size={12} />
                <p className="text-[11px]">{address.phone}</p>
              </div>
            </div>
          </motion.section>

          {/* --- DELIVERY WINDOW --- */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2.2rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Calendar size={22} />
              </div>
              <div>
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Delivery Window</h2>
                <p className="text-sm font-bold text-slate-900">{selectedDate}</p>
              </div>
            </div>
            <Truck size={20} className="text-slate-200" />
          </motion.section>

          {/* --- PAYMENT METHOD --- */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3">Payment Method</h2>
            <div onClick={() => setPaymentMethod("COD")} className={`flex justify-between items-center p-5 rounded-[2rem] border-2 transition-all cursor-pointer ${paymentMethod === "COD" ? "border-blue-600 bg-blue-50/50" : "border-white bg-white shadow-sm"}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${paymentMethod === "COD" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                  <CreditCard size={18} />
                </div>
                <span className="text-sm font-black text-slate-800 tracking-tight uppercase">Cash on Delivery</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === "COD" ? "border-blue-600 bg-blue-600" : "border-slate-200"}`}>
                {paymentMethod === "COD" && <CheckCircle2 size={14} className="text-white" />}
              </div>
            </div>
          </motion.section>

          {/* --- TOTAL SUMMARY --- */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
             <h2 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-6">Payment Summary</h2>
             <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100/60 font-medium">Subtotal</span>
                  <span className="font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-100/60 font-medium">Logistics & Delivery</span>
                  <span className="text-emerald-400 font-black uppercase text-[10px] bg-white/5 px-2 py-1 rounded-lg">Free</span>
                </div>
                <div className="pt-6 mt-2 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-blue-300 uppercase font-black tracking-widest">Payable Amount</p>
                    <p className="text-3xl font-black mt-1">₹{total}</p>
                  </div>
                  <ShieldCheck size={24} className="text-blue-400" />
                </div>
             </div>
          </motion.section>
        </div>

        {/* --- FIXED ACTION BAR --- */}
        <div className="fixed bottom-0 left-0 right-0 pb-10 pt-16 px-6 z-40 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/95 to-transparent pointer-events-none">
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={placingOrder || items.length === 0}
            onClick={handlePlaceOrder}
            className={`pointer-events-auto w-full py-5 rounded-[2.2rem] font-black text-sm shadow-2xl transition-all flex items-center justify-center gap-3 ${placingOrder ? "bg-slate-200 text-slate-400" : "bg-blue-600 text-white"}`}
          >
            {placingOrder ? <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <>CONFIRM ORDER | ₹{total}</>}
          </motion.button>
        </div>
      </div>

      {/* --- IMPROVED ADDRESS MODAL (Directly updates Store) --- */}
      <AnimatePresence>
        {showAddressModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddressModal(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[50]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 z-[51] shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <h2 className="text-xl font-black text-slate-900 mb-6 uppercase">Edit Delivery Details</h2>
              
              <div className="space-y-4">
                <div className="relative group">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    value={address.name} 
                    onChange={(e) => updateAddressField('name', e.target.value)} 
                    className="w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none border border-transparent focus:border-blue-100 font-bold" 
                    placeholder="Full Name" 
                  />
                </div>
                
                <div className="relative group">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    value={address.street} 
                    onChange={(e) => updateAddressField('street', e.target.value)} 
                    className="w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none border border-transparent focus:border-blue-100" 
                    placeholder="Street Address" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      value={address.city} 
                      onChange={(e) => updateAddressField('city', e.target.value)} 
                      className="w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none border border-transparent focus:border-blue-100" 
                      placeholder="City" 
                    />
                  </div>
                  <div className="relative group">
                    <input 
                      value={address.state} 
                      onChange={(e) => updateAddressField('state', e.target.value)} 
                      className="w-full bg-slate-50 p-4 rounded-2xl outline-none border border-transparent focus:border-blue-100" 
                      placeholder="State" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <input 
                      value={address.zipCode} 
                      onChange={(e) => updateAddressField('zipCode', e.target.value)} 
                      className="w-full bg-slate-50 p-4 rounded-2xl outline-none border border-transparent focus:border-blue-100 font-mono" 
                      placeholder="Pincode" 
                    />
                  </div>
                  <div className="relative group">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      value={address.phone} 
                      onChange={(e) => updateAddressField('phone', e.target.value)} 
                      className="w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none border border-transparent focus:border-blue-100" 
                      placeholder="Phone" 
                    />
                  </div>
                </div>
              </div>

              <button onClick={() => setShowAddressModal(false)} className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black mt-8 shadow-xl uppercase transition-transform active:scale-95">
                Save & Continue
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}