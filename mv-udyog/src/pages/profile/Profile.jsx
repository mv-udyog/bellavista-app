import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  CreditCard,
  Headset,
  LogOut,
  ChevronRight,
  CalendarCheck,
  User as UserIcon,
} from "lucide-react";

import MainLayout from "@/layout/MainLayout";
import BottomNav from "@/components/common/BottomNav";

export default function Profile() {
  const navigate = useNavigate();

  // OTP USER
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error(error);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  const handleWhatsAppSupport = () => {
    const phoneNumber = "917900999574";

    const message = encodeURIComponent(
      "Hello Bellavista Support, I need help with my order."
    );

    window.open(
      `https://wa.me/${phoneNumber}?text=${message}`,
      "_blank"
    );
  };

  const ProfileOption = ({
    icon: Icon,
    title,
    subtitle,
    onClick,
    isDestructive = false,
  }) => (
    <motion.button
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 transition-colors border-b border-slate-50 last:border-0"
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-xl ${
            isDestructive
              ? "bg-red-50"
              : "bg-slate-50"
          }`}
        >
          <Icon
            size={20}
            className={
              isDestructive
                ? "text-red-500"
                : "text-slate-600"
            }
          />
        </div>

        <div className="text-left">
          <p
            className={`text-sm font-semibold ${
              isDestructive
                ? "text-red-500"
                : "text-slate-800"
            }`}
          >
            {title}
          </p>

          {subtitle && (
            <p className="text-[11px] text-slate-400 font-medium truncate w-48">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <ChevronRight
        size={16}
        className={
          isDestructive
            ? "text-red-300"
            : "text-slate-300"
        }
      />
    </motion.button>
  );

  return (
    <MainLayout>
      <div className="bg-[#f8fafc] min-h-screen pb-24">
        {/* HEADER */}
        <div className="px-6 pt-10 pb-6 bg-white border-b border-slate-100">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Account
          </h1>

          {user ? (
            <div className="mt-6 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <UserIcon size={32} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {user.name || "Bellavista Customer"}
                </h2>

                <p className="text-sm text-slate-500 font-medium">
                  {user.phoneNumber ||
                    user.phone ||
                    user.email ||
                    "Verified User"}
                </p>

                <span className="mt-1 inline-block px-2 py-0.5 bg-blue-50 text-[10px] font-bold text-blue-600 rounded-full uppercase tracking-wider">
                  Premium Member
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-sm text-blue-700 font-semibold">
                Join Bellavista Club
              </p>

              <button
                onClick={() =>
                  navigate("/login")
                }
                className="mt-2 text-xs font-bold text-white bg-blue-600 px-4 py-2 rounded-lg"
              >
                Login
              </button>
            </div>
          )}
        </div>

        <div className="px-5 mt-6 space-y-6">
          {/* ACTIVITIES */}
          <section>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2">
              Activities
            </h3>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <ProfileOption
                icon={Package}
                title="My Orders"
                subtitle="Track, reorder or help with orders"
                onClick={() =>
                  navigate("/orders")
                }
              />

              <ProfileOption
                icon={CalendarCheck}
                title="Subscriptions"
                subtitle="Manage your daily water delivery"
                onClick={() =>
                  navigate("/subscriptions")
                }
              />
            </div>
          </section>

          {/* SETTINGS */}
          <section>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2">
              Settings
            </h3>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <ProfileOption
                icon={CreditCard}
                title="Payments"
                subtitle="Saved UPI, Cards & Wallets"
                onClick={() =>
                  navigate("/payments")
                }
              />
            </div>
          </section>

          {/* SUPPORT */}
          <section>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2">
              Help & Support
            </h3>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <ProfileOption
                icon={Headset}
                title="Customer Support"
                subtitle="WhatsApp us for instant help"
                onClick={
                  handleWhatsAppSupport
                }
              />

              <ProfileOption
                icon={LogOut}
                title="Logout"
                isDestructive={true}
                onClick={handleLogout}
              />
            </div>
          </section>

          {/* APP VERSION */}
          <div className="text-center py-4">
            <p className="text-[10px] text-slate-300 font-bold tracking-widest uppercase">
              Bellavista v3.0.0
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </MainLayout>
  );
}