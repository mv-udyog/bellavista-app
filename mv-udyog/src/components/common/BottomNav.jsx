import { Home, Package, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: "Home", icon: Home, path: "/home" },
    { name: "Orders", icon: Package, path: "/orders" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50">
      
      {/* PREMIUM GLASS NAV */}
      <div className="bg-white/90 backdrop-blur-xl border shadow-lg rounded-2xl flex justify-around py-3">

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = location.pathname === tab.path;

          return (
            <button
              key={tab.name}
              onClick={() => navigate(tab.path)} // ✅ FIXED
              className="flex flex-col items-center text-xs relative"
            >
              {/* ICON */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-xl transition ${
                  active
                    ? "bg-black text-white shadow"
                    : "text-gray-400"
                }`}
              >
                <Icon size={18} />
              </motion.div>

              {/* LABEL */}
              <span
                className={`mt-1 text-[11px] ${
                  active
                    ? "text-black font-medium"
                    : "text-gray-400"
                }`}
              >
                {tab.name}
              </span>

              {/* ACTIVE DOT */}
              {active && (
                <motion.div
                  layoutId="nav-dot"
                  className="w-1.5 h-1.5 bg-black rounded-full mt-1"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}