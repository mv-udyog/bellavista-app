import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Lock, ShieldCheck, User, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const testConnection = async () => {
  try {
    const res = await fetch("http://192.168.1.16:5000");
    const text = await res.text();
    console.log("SUCCESS:", text);
  } catch (err) {
    console.log("FAILED:", err);
  }
};
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom Toast State (Blinkit/Zepto style)
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Function to show toast and auto-hide
  const showNotification = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleSignUp = async () => {
    const { username, email, password } = formData;

    // 1. Basic Empty Check
    if (!username || !email || !password) {
      showNotification("Please fill all fields to continue");
      return;
    }

    // 2. Email Validation (Regex) to prevent fake email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification("Please enter a valid email address");
      return;
    }

    // 3. Password Length Check
    if (password.length < 6) {
      showNotification("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://192.168.1.16:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      console.log("RESPONSE DATA:", data);  // 👈 ADD THIS LINE

      if (response.ok) {
        showNotification("Account created successfully!", "success");
        // Delay navigation slightly so user sees the success toast
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showNotification(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
       console.log("REAL ERROR:", error);
  alert("REAL ERROR: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden px-6 font-sans">
      
      {/* ZEPTIO/BLINKIT STYLE FLOATING TOAST */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-0 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border ${
              toast.type === "success" 
                ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                : "bg-red-50 border-red-100 text-red-700"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-bold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
            <Droplets className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Create Account</h1>
          <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider tracking-[0.1em]">Experience Himalayan Purity</p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white">
          
          <div className="space-y-4">
            {/* USERNAME FIELD */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all font-medium"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            {/* EMAIL FIELD */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="email"
                  className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all font-medium"
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Set Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="password"
                  className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-blue-500 font-medium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              onClick={handleSignUp}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold shadow-xl hover:bg-blue-600 transition-all mt-4 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Get Started"}
            </motion.button>
            <button
  onClick={() => {
    console.log("BUTTON CLICKED");
    testConnection();
  }}
  className="w-full mt-3 bg-green-500 text-white py-2 rounded-xl"
>
  Test Backend
</button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="text-blue-600 font-black hover:underline underline-offset-4 transition-all">Login</button>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 opacity-60">
          <ShieldCheck size={14} className="text-emerald-500" />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure MV Udyog Protocol</p>
        </div>
      </motion.div>
    </div>
  );
}