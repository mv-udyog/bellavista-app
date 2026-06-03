import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  ArrowRight,
  ShieldCheck,
  Phone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { auth } from "../../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showNotification = (message, type = "error") => {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "",
      });
    }, 3000);
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  };

  const handleSendOTP = async () => {
    if (!phone) {
      showNotification("Please enter phone number");
      return;
    }

    if (!phone.startsWith("+91")) {
      showNotification("Use format +91XXXXXXXXXX");
      return;
    }

    try {
      setIsLoading(true);

      setupRecaptcha();

      const confirmationResult =
        await signInWithPhoneNumber(
          auth,
          phone,
          window.recaptchaVerifier
        );

      window.confirmationResult =
        confirmationResult;

      showNotification(
        "OTP sent successfully",
        "success"
      );

      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            phone,
          },
        });
      }, 1000);
    } catch (error) {
      console.error(error);

      showNotification(
        "Failed to send OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden px-6 font-sans">

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
            {toast.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}

            <span className="text-sm font-bold">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px]" />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
            <Droplets className="text-white w-7 h-7" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            Welcome to Bellavista
          </h1>

          <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-[0.1em]">
            Login with OTP
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white">

          <div className="space-y-5">

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">
                Mobile Number
              </label>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />

                <input
                  type="tel"
                  className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all font-medium"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              onClick={handleSendOTP}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Send OTP
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 opacity-60">
          <ShieldCheck
            size={14}
            className="text-emerald-500"
          />

          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Secure MV Udyog Protocol
          </p>
        </div>
      </motion.div>

      <div id="recaptcha-container"></div>
    </div>
  );
}