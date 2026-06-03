import MainLayout from "@/layout/MainLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  MapPin, 
  Truck, 
  Phone, 
  ShieldCheck, 
  Box, 
  CheckCircle2,
  Navigation
} from "lucide-react";

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  // Mock tracking data (In a real app, this comes from an API)
  const trackingSteps = [
    { title: "Order Placed", desc: "We have received your request", time: "10:30 AM", status: "completed" },
    { title: "Quality Check", desc: "Bellavista Purity Standards verified", time: "11:15 AM", status: "completed" },
    { title: "Out for Delivery", desc: "Driver is heading to your location", time: "12:05 PM", status: "current" },
    { title: "Delivered", desc: "Enjoy your mountain-fresh water", time: "--:--", status: "pending" },
  ];

  return (
    <MainLayout>
      <div className="bg-[#f8fafc] min-h-screen pb-10">
        
        {/* --- HEADER --- */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-5 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Track Order</h1>
        </div>

        <div className="px-5 py-6 space-y-6">
          
          {/* --- LIVE STATUS MAP PLACEHOLDER --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="h-48 bg-blue-100 rounded-[2.5rem] relative overflow-hidden shadow-inner border-4 border-white"
          >
            {/* Simple Map-like decoration */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-blue-400" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600/30">
               <Navigation size={80} className="rotate-45" />
            </div>

            {/* Floating Vehicle Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Vehicle No.</p>
                  <p className="text-sm font-black text-slate-900">MH-02-BV-2026</p>
                </div>
              </div>
              <button className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
                <Phone size={16} />
              </button>
            </div>
          </motion.div>

          {/* --- TRACKING TIMELINE --- */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Live Journey</h2>
            
            <div className="space-y-10 relative">
              {/* Vertical Line Connector */}
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100" />

              {trackingSteps.map((step, i) => (
                <div key={i} className="flex gap-6 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${
                    step.status === 'completed' ? 'bg-blue-600 text-white' : 
                    step.status === 'current' ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50' : 
                    'bg-slate-100 text-slate-300'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle2 size={14} /> : <Box size={14} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-black tracking-tight ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-900'}`}>
                        {step.title}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400">{step.time}</span>
                    </div>
                    <p className={`text-xs mt-1 font-medium ${step.status === 'pending' ? 'text-slate-200' : 'text-slate-500'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- SECURITY BADGE --- */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-[2rem] flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-900">Untouched by Human Hands</p>
              <p className="text-[10px] text-emerald-700 font-medium">Sealed at source in the Himalayas and GPS tracked to your doorstep.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}