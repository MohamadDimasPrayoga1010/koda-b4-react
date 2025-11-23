import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";
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

      <div className="relative shadow-md hover:shadow-lg transition-shadow overflow-visible min-h-[520px] pb-6">
        {isFlashSale && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded z-10">
            FLASH SALE!
          </div>
        )}

        <div className="w-full h-60 sm:h-64 md:h-72 overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="absolute top-[230px] left-1/2 -translate-x-1/2 w-[90%] sm:w-[85%] bg-white p-4 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {product.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-4">
            {isFlashSale ? (
              <>
                {originalPrice && (
                  <span className="text-sm text-red-500 line-through">
                    IDR {originalPrice?.toLocaleString("id-ID")}
                  </span>
                )}
                <span className="text-lg font-bold text-[#FF8906] block">
                  IDR {price.toLocaleString("id-ID")}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">
                IDR {price.toLocaleString("id-ID")}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              to={`/detail-product/${product.id}`}
              onClick={handleBuy}
              className="flex-1 text-sm py-2 px-4 text-center rounded-md font-semibold bg-[#FF8906] text-white hover:bg-[#e67a05]"
            >
              Buy
            </Link>
            <Link
              to={`/detail-product/${product.id}`} 
              onClick={handleAddCart}
              className="border border-[#FF8906] p-2 rounded-md h-10 w-10 flex items-center justify-center hover:bg-[#FFF3E0]"
            >
              <ShoppingCart className="w-5 h-5 text-[#FF8906]" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardProduct;
