import MainLayout from "@/layout/MainLayout";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api/axios.js";

import {
  Gift,
  Trophy,
  Award,
  Gem,
  TrendingUp,
} from "lucide-react";

export default function Rewards() {
  const navigate = useNavigate();

const [orders, setOrders] = useState([]);

useEffect(() => {
  api.get("/orders")
    .then((res) => setOrders(res.data.data || []))
    .catch(console.error);
}, []);

const totalBoxes = orders.reduce(
  (orderTotal, order) =>
    orderTotal +
    (order.items?.reduce(
      (itemTotal, item) =>
        itemTotal + (item.quantity || 0),
      0
    ) || 0),
  0
);

const currentPoints = totalBoxes * 2;

const nextReward =
  currentPoints < 1000
    ? 1000
    : currentPoints < 2000
    ? 2000
    : 5000;

const progress =
  (currentPoints / nextReward) * 100;

const tier =
  currentPoints >= 5000
    ? "Platinum"
    : currentPoints >= 2000
    ? "Gold"
    : currentPoints >= 1000
    ? "Silver"
    : "Bronze";

  const rewards = [
    {
      title: "10 Free Boxes",
      points: 1000,
      icon: Gift,
      remaining: 1000 - currentPoints,
    },
    {
      title: "20 Free Boxes",
      points: 2000,
      icon: Trophy,
      remaining: 2000 - currentPoints,
    },
    {
      title: "50 Free Boxes",
      points: 5000,
      icon: Gem,
      remaining: 5000 - currentPoints,
    },
  ];

  const activity = [
    {
      points: "+60",
      text: "12 Boxes Purchased",
      date: "2 Jun 2026",
    },
    {
      points: "+25",
      text: "5 Boxes Purchased",
      date: "31 May 2026",
    },
    {
      points: "+40",
      text: "8 Boxes Purchased",
      date: "28 May 2026",
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8FAFC] pb-32">
        <div className="px-5 pt-6 space-y-6">

          {/* HEADER */}
          <div className="flex items-center gap-3">

  <div>
    <h1 className="text-3xl font-black text-slate-900">
      Rewards Club
    </h1>

    <p className="text-slate-500 font-medium mt-1">
      Earn points. Unlock free Bellavista boxes.
    </p>
  </div>
</div>

          {/* HERO CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] p-6 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white shadow-2xl"
          >
            <p className="uppercase tracking-[0.2em] text-xs opacity-80 font-black">
              Bellavista Rewards
            </p>

            <h2 className="text-5xl font-black mt-3">
              {currentPoints}
            </h2>

            <p className="text-blue-100 font-medium">
              Available Points
            </p>
            <div className="mt-4 bg-white/10 rounded-2xl p-4">
  <p className="text-xs uppercase tracking-widest text-blue-100">
    Total Boxes Purchased
  </p>

  <h3 className="text-3xl font-black mt-1">
    {totalBoxes}
  </h3>
</div>

            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Next Reward</span>
                <span>{nextReward} Points</span>
              </div>

              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="text-xs mt-3 text-blue-100">
                {nextReward - currentPoints} points left to unlock
                10 FREE boxes
              </p>
            </div>
          </motion.div>

          {/* CURRENT TIER */}
          <div className="bg-white rounded-[2rem] p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Award
                size={26}
                className="text-amber-500"
              />

              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
                  Current Tier
                </p>

                <h3 className="font-black text-lg text-slate-900">
                  {tier} Member
                </h3>
              </div>
            </div>
          </div>

          {/* REWARDS */}
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-black text-slate-400 mb-4">
              Reward Milestones
            </h2>

            <div className="space-y-4">
              {rewards.map((reward, index) => {
                const Icon = reward.icon;

                return (
                  <div
                    key={index}
                    className="bg-white rounded-[2rem] p-5 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <Icon
                          size={24}
                          className="text-blue-600"
                        />
                      </div>

                      <div>
                        <h3 className="font-black text-slate-900">
                          {reward.title}
                        </h3>

                        <p className="text-xs text-slate-500">
                          {reward.points} Points Required
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
  {currentPoints >= reward.points ? (
    <>
      <div className="flex items-center gap-1 text-emerald-600 justify-end">
        <span className="text-lg">✅</span>
      </div>

      <p className="text-[10px] text-emerald-600 uppercase font-black">
        Unlocked
      </p>
    </>
  ) : (
    <>
      <p className="font-black text-blue-600">
        {reward.points - currentPoints}
      </p>

      <p className="text-[10px] text-slate-400 uppercase">
        Remaining
      </p>
    </>
  )}
</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HOW TO EARN */}
          <div className="bg-white rounded-[2rem] p-5 shadow-sm">
            <h2 className="font-black text-slate-900 mb-4">
              How To Earn
            </h2>

            <div className="space-y-3 text-sm text-slate-600">
              <p>✅ 1 Box Purchased = 2 Points</p>
              <p>✅ Points added after delivery</p>
              <p>✅ Points never expire</p>
              <p>✅ Redeem anytime</p>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-[1.8rem] p-4 text-center shadow-sm">
              <TrendingUp className="mx-auto mb-2 text-blue-600" />
              <p className="text-lg font-black">{orders.length}</p>
              <p className="text-[10px] text-slate-400 uppercase">
                Orders
              </p>
            </div>

            <div className="bg-white rounded-[1.8rem] p-4 text-center shadow-sm">
              <Gift className="mx-auto mb-2 text-blue-600" />
              <p className="text-lg font-black">{Math.floor(currentPoints / 100)}</p>
              <p className="text-[10px] text-slate-400 uppercase">
                Free Boxes
              </p>
            </div>

            <div className="bg-white rounded-[1.8rem] p-4 text-center shadow-sm">
              <Trophy className="mx-auto mb-2 text-blue-600" />
              <p className="text-lg font-black">{currentPoints}</p>
              <p className="text-[10px] text-slate-400 uppercase">
                Lifetime
              </p>
            </div>
          </div>

          {/* BANNER */}
        </div>
      </div>
    </MainLayout>
  );
}