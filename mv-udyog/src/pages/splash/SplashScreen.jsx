import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");

      if (token) {
        navigate("/home", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col items-center justify-center overflow-hidden relative">

      {/* Glow */}
      <div className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />

      {/* Bottle */}
      <motion.img
        src="/b1l.png"
        alt="Bellavista"
        initial={{
          opacity: 0,
          y: 120,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 1.2,
          ease: "easeOut",
        }}
        className="h-[320px] object-contain relative z-10"
      />

      {/* Brand */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1,
          duration: 1,
        }}
        className="text-white text-4xl font-black tracking-wider mt-6"
      >
        BELLAVISTA
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1.4,
          duration: 1,
        }}
        className="text-blue-200 text-sm tracking-[0.4em] uppercase mt-2"
      >
        Nature In Every Drop
      </motion.p>

      {/* Loader */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 180 }}
        transition={{
          duration: 2.5,
        }}
        className="h-1 bg-blue-400 rounded-full mt-12"
      />
    </div>
  );
}