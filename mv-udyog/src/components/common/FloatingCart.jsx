import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function FloatingCart({ count }) {
  const navigate = useNavigate();

  if (!count) return null;

  return (
    <motion.div
      onClick={() => navigate("/cart")}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-4 cursor-pointer"
    >
      <span className="text-sm">{count} items</span>
      <span className="font-semibold">View Cart →</span>
    </motion.div>
  );
}