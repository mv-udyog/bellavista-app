import { motion, AnimatePresence } from "framer-motion";

export default function AddToCartPopup({ show, product }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-3 rounded-full shadow-xl z-50 flex items-center gap-3"
        >
          <span className="text-sm">
            ✅ {product?.name} added
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}