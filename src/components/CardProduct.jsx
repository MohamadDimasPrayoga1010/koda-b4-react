import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingCart, Zap, ArrowRight } from "lucide-react";
import { useState } from "react";
import AuthAlert from "../components/AuthAlert";

function CardProduct({ product }) {
  const token = useSelector((state) => state.auth.token);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const price = Number(product.basePrice ?? 0);
  const isFlashSale = product.isFlashSale ?? false;
  const originalPrice = product.originalPrice ?? null;

  const handleBuy = (e) => {
    if (!token) {
      e.preventDefault();
      setAlert({ type: "", message: "" });
      setTimeout(() => {
        setAlert({
          type: "error",
          message: "Anda harus login terlebih dahulu!",
        });
      }, 10);
      return;
    }
  };

  const handleAddCart = () => {
    if (!token) {
      setAlert({ type: "error", message: "Anda harus login terlebih dahulu!" });
      return;
    }
  };

  const closeAlert = () => {
    setAlert({ type: "", message: "" });
  };

  return (
    <>
      {alert.message && (
        <AuthAlert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}

      <div 
        className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10 hover:-translate-y-1"
      >
        <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {isFlashSale && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
              <Zap className="w-3 h-3 fill-white" />
              <span>Flash Sale</span>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-[#8B4513] transition-colors duration-300">
            {product.title}
          </h3>

          <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            {originalPrice && isFlashSale ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#8B4513] to-[#654321] bg-clip-text text-transparent">
                    IDR {price.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 line-through">
                    IDR {originalPrice.toLocaleString("id-ID")}
                  </span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Save {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#8B4513] to-[#654321] bg-clip-text text-transparent">
                IDR {price.toLocaleString("id-ID")}
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            <Link
              to={`/detail-product/${product.id}`}
              onClick={handleBuy}
              className="relative flex-1 overflow-hidden text-sm sm:text-base py-3 px-6 text-center rounded-xl font-bold text-white bg-gradient-to-r from-[#8B4513] to-[#654321] hover:from-[#654321] hover:to-[#8B4513] transition-all duration-300 shadow-lg shadow-amber-900/30 hover:shadow-xl hover:shadow-amber-900/40 hover:scale-[1.02] active:scale-[0.98] group/btn"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Buy Now
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
            </Link>
            
            <Link
              to={`/detail-product/${product.id}`}
              onClick={handleAddCart}
              className="border-2 border-[#8B4513] p-3 rounded-xl flex items-center justify-center bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:to-amber-100 transition-all duration-300 hover:scale-110 hover:rotate-6 active:scale-95 group/cart shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B4513] group-hover/cart:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#8B4513]/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </>
  );
}

export default CardProduct;