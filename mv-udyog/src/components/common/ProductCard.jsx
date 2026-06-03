import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  const handleAddAndNavigate = () => {
    addItem({ ...product, quantity: 1 });
    navigate("/cart");
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-[2rem] p-4 shadow-sm border border-blue-50 group"
    >
      {/* --- CINEMATIC BOTTLE DISPLAY --- */}
      <div className="relative w-full h-48 flex items-center justify-center bg-blue-50/30 rounded-[2rem] mb-4 overflow-visible">
        <motion.img
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: -2 }}
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] z-10 transition-all duration-500"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150?text=Water+Bottle";
          }}
        />
        {/* Aesthetic background glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-100/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
      </div>

      {/* --- INFO --- */}
      <div className="px-1">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">{product.name}</h3>
        <p className="text-[11px] text-slate-400 font-semibold uppercase">{product.size}</p>
      </div>

      {/* --- FOOTER / ACTION --- */}
      <div className="flex justify-between items-center mt-4 px-1">
        <span className="font-black text-blue-600">₹{product.price}</span>

        <button
          onClick={handleAddAndNavigate}
          className="text-[11px] font-black uppercase tracking-wider px-5 py-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
        >
          Add
        </button>
      </div>
    </motion.div>
  );
}