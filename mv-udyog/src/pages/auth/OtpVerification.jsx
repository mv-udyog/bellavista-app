import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = useRef([]);

  const phoneNumber =
    location.state?.phone || "";

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] =
      value.substring(value.length - 1);

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index,
    e
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      alert("Enter valid OTP");
      return;
    }

    try {
      setIsLoading(true);

      const result =
        await window.confirmationResult.confirm(
          otpCode
        );

      const firebaseUser = result.user;

const response = await fetch(
  "http://localhost:5000/api/auth/firebase-login",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phoneNumber: firebaseUser.phoneNumber,
    }),
  }
);

const data = await response.json();

if (!response.ok) {
  throw new Error(
    data.message || "Login failed"
  );
}

localStorage.setItem(
  "token",
  data.token
);

localStorage.setItem(
  "user",
  JSON.stringify(data.user)
);

setIsSuccess(true);

setTimeout(() => {
  if (
    data.user.role === "ADMIN"
  ) {
    navigate(
      "/admin/dashboard"
    );
  } else {
    navigate("/home");
  }
}, 2500);
    } catch (error) {
      console.error(error);

      alert(
        "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-8 relative overflow-hidden">

      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="w-full max-w-sm z-10 text-center"
      >
        <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl shadow-blue-100 flex items-center justify-center mx-auto mb-8 border border-slate-50">
          <Smartphone className="text-blue-600 w-10 h-10" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          Verify OTP
        </h1>

        <p className="text-sm text-slate-400 font-medium mt-2 px-6">
          Code sent to
          <br />
          <span className="text-slate-900 font-bold">
            {phoneNumber}
          </span>
        </p>

        <div className="flex gap-2 justify-center my-10">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) =>
                (inputRefs.current[idx] =
                  el)
              }
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(
                  idx,
                  e.target.value
                )
              }
              onKeyDown={(e) =>
                handleKeyDown(idx, e)
              }
              className="w-11 h-14 bg-white border-2 border-slate-100 rounded-xl text-center text-xl font-black text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
            />
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleVerify}
          disabled={
            isLoading || otp.includes("")
          }
          className={`w-full py-5 rounded-[2rem] font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
            otp.includes("")
              ? "bg-slate-200 text-slate-400"
              : "bg-blue-600 text-white"
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              VERIFY OTP
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>

        <div className="mt-8">
          {timer > 0 ? (
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Resend in{" "}
              <span className="text-blue-600">
                {timer}s
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="flex items-center gap-2 mx-auto text-xs font-black text-blue-600 uppercase tracking-widest"
            >
              <RefreshCw size={14} />
              Resend OTP
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{
                scale: 0.5,
              }}
              animate={{
                scale: 1,
              }}
            >
              <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-white w-12 h-12" />
              </div>

              <h2 className="text-3xl font-black text-center">
                Welcome
              </h2>

              <p className="text-slate-400 mt-3 text-center">
                Login successful
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 flex items-center justify-center gap-2 opacity-40">
        <ShieldCheck size={14} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">
          Verified by Bellavista Systems
        </span>
      </div>
    </div>
  );
}