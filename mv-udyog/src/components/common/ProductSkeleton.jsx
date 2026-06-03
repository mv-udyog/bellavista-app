import { motion } from "framer-motion";

export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border animate-pulse">
      
      {/* IMAGE */}
      <div className="h-24 bg-gray-200 rounded-xl mb-3" />

      {/* TITLE */}
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />

      {/* SUBTITLE */}
      <div className="h-2 bg-gray-200 rounded w-1/2 mb-3" />

      {/* FOOTER */}
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-6 bg-gray-200 rounded w-12" />
      </div>
    </div>
  );
}