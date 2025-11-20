import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducer/coffeOrder";
import { useState } from "react";

function CardProduct({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.coffeOrder.cart || []);
  const [added, setAdded] = useState(false);

  const price = Number(product.basePrice ?? 0);
  const isFlashSale = product.isFlashSale ?? false;
  const originalPrice = product.originalPrice ?? null;

  const handleAddToCart = (product) => {
    const exists = cartItems.find((item) => item.productId === product.id);

    if (!exists) {
      dispatch(
        addToCart({
          id: product.id,
          productId: product.id,
          name: product.name,
          image: product.image,
          basePrice: product.basePrice,
          originalPrice: originalPrice,
          isFlashSale: isFlashSale,
          quantity: 1,
          size: "Regular",
          temperature: "Ice",
          delivery: "Dine In",
          cartItemId: Date.now() + Math.random().toString(36).substr(2, 5),
        })
      );
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
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
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            {isFlashSale ? (
              <>
                {originalPrice && (
                  <span className="text-sm text-red-500 line-through">
                    IDR {originalPrice?.toLocaleString("id-ID")}
                  </span>
                )}
                <span className="text-lg font-bold text-[#FF8906]">
                  IDR {price.toLocaleString("id-ID")}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">
                IDR {price.toLocaleString("id-ID")}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/detail-product/${product.id}`}
            className="flex-1 text-sm py-2 px-4 rounded-md font-semibold transition-colors duration-300 flex items-center justify-center bg-[#FF8906] hover:bg-[#e67a05] text-white"
          >
            Buy
          </Link>

          <button
            onClick={() => handleAddToCart(product)}
            className="border border-[#FF8906] p-2 rounded-md transition-colors h-10 w-10 flex items-center justify-center shrink-0 hover:bg-[#FFF3E0]"
          >
            <ShoppingCart className="w-5 h-5 text-[#FF8906]" />
          </button>
        </div>

        {added && (
          <div className="mt-2 text-center text-green-600 text-sm font-semibold">
            Added to Cart!
          </div>
        )}
      </div>
    </div>
  );
}

export default CardProduct;