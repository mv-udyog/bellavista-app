import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, MapPin, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

import MainLayout from "@/layout/MainLayout";
import ProductCard from "@/components/common/ProductCard";
import BottomNav from "@/components/common/BottomNav";
import { useCartStore } from "@/store/useCartStore";
import AddToCartPopup from "@/components/common/AddToCartPopup";
import ProductSkeleton from "@/components/common/ProductSkeleton";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Bellavista");
  const [searchQuery, setSearchQuery] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { items } = useCartStore();
  const navigate = useNavigate();

  const cartCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProducts([
        // Bellavista - Natural Mineral Water
        { id: "b1", name: "Bellavista Natural", size: "200ml (Pack of 48)", price: 320, category: "Bellavista", image: "/b200.png" },
        { id: "b2", name: "Bellavista Natural", size: "1L (Pack of 12)", price: 240, category: "Bellavista", image: "/b1l.png" },
        // Ozaano - Premium Packaged
        { id: "o1", name: "Ozaano Premium", size: "250ml (Pack of 24)", price: 100, category: "Ozaano", image: "/o250.png" },
        { id: "o2", name: "Ozaano Premium", size: "1L (Pack of 12)", price: 110, category: "Ozaano", image: "/o1l.png" },
        // Siggnature
        { id: "s1", name: "Siggnature Gold", size: "250ml (Pack of 24)", price: 100, category: "Siggnature", image: "/o250.png" },
        { id: "s2", name: "Siggnature Gold", size: "1L (Pack of 12)", price: 110, category: "Siggnature", image: "/o1l.png" },
      ]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // --- SEARCH & FILTER LOGIC ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = p.category === activeCategory;
      
      // If user is searching, show across all categories; otherwise, filter by category
      return searchQuery ? matchesSearch : (matchesCategory && matchesSearch);
    });
  }, [products, searchQuery, activeCategory]);

  const handleAdd = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <MainLayout>
      <div className="pb-32 min-h-screen bg-[#F0F7FF] bg-[url('/water-texture.png')] bg-fixed bg-cover">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="bg-white/70 backdrop-blur-xl sticky top-0 z-30 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* BRAND LOGO REPLACED DROPLET */}
            <div className="bg-white p-1 rounded-xl shadow-md border border-blue-50">
              <img src="/logo.png" alt="MV Udyog Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-none tracking-tight">M V UDYOG PVT LTD</h1>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={10} className="text-blue-500" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Deliver to Delhi NCR</p>
              </div>
            </div>
          </div>

          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/cart")}
            className="relative p-2.5 bg-white rounded-2xl shadow-sm border border-blue-50"
          >
            <ShoppingCart size={22} className="text-slate-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </motion.div>
        </div>

        {/* --- HERO SECTION WITH BACKGROUND IMAGE --- */}
        <div className="px-5 pt-6">
          <div className="relative overflow-hidden rounded-[2rem] p-6 shadow-2xl shadow-blue-200 min-h-[160px] flex flex-col justify-center">
            {/* Background Image Layer */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/background.jpg')" }} />
            <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[1px]" /> {/* Overlay for text readability */}
            
            <div className="relative z-10">
              <span className="bg-blue-600/80 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
                Himalayan Origin
              </span>
              <h2 className="text-2xl font-bold text-white mt-4 leading-tight drop-shadow-md">
                Pure as Nature <br /> Intended.
              </h2>
              <p className="text-white/90 text-xs mt-2 font-medium">
                Untouched natural mineral water <br /> from the heart of the mountains.
              </p>
            </div>
          </div>
        </div>

        {/* --- SEARCH BAR (FUNCTIONAL) --- */}
        <div className="px-5 mt-6">
          <div className="bg-white rounded-2xl flex items-center px-4 py-4 shadow-sm border border-blue-50 focus-within:border-blue-300 transition-all">
            <Search className="text-slate-300 mr-3" size={18} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Bellavista, Ozaano..." 
              className="bg-transparent w-full outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* --- BRAND CATEGORIES --- */}
        {!searchQuery && (
          <div className="mt-8">
            <div className="px-6 flex justify-between items-end mb-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Select Brand</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto px-6 pb-2 no-scrollbar scrollbar-hide">
              {["Bellavista", "Ozaano", "Siggnature"].map((brand) => (
                <button
                  key={brand}
                  onClick={() => setActiveCategory(brand)}
                  className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold text-xs transition-all border ${
                    activeCategory === brand 
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100 scale-105" 
                    : "bg-white text-slate-400 border-slate-100"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- PRODUCT GRID --- */}
        <div className="px-5 mt-6">
          <div className="flex items-center gap-2 mb-4 ml-1">
            <Leaf size={14} className="text-emerald-500" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {searchQuery ? `Search Results for "${searchQuery}"` : `Available in ${activeCategory}`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={product.id}
                    >
                      {/* ProductCard handles the new Amazon-style manual quantity input */}
                      <ProductCard product={product} onAdd={handleAdd} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 py-10 text-center">
                    <p className="text-slate-400 text-sm font-medium">No products found matching your search.</p>
                  </div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      <AddToCartPopup show={showPopup} product={selectedProduct} />
      <BottomNav />
    </MainLayout>
  );
}