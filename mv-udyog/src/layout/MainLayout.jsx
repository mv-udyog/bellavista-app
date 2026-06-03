import { motion } from "framer-motion";
import NotificationToast from "@/components/common/NotificationToast";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900">

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className="min-h-screen"
      >
        {children}
        <NotificationToast />
      </motion.div>

    </div>
  );
}