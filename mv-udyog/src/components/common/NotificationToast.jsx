import { useNotificationStore } from "@/store/useNotificationStore";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="bg-black text-white px-4 py-2 rounded-xl text-sm shadow-lg"
            onAnimationComplete={() => {
              setTimeout(() => removeNotification(n.id), 2000);
            }}
          >
            {n.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}