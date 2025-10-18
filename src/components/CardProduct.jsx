import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducer/coffeOrder";
import { useState } from "react";

/**
 * @typedef {Object} Product
 * @property {number} id - ID unik produk.
 * @property {string} name - Nama produk.
 * @property {string} description - Deskripsi singkat produk.
 * @property {string} image - URL gambar produk.
 * @property {number} price - Harga diskon atau harga utama produk.
 * @property {number} [originalPrice] - Harga asli sebelum diskon (jika ada).
 * @property {boolean} [isFlashSale] - Menandakan apakah produk termasuk flash sale.
 * @property {number} rating - Nilai rating produk (0–5).
 * @property {string} slug - Slug produk untuk URL detail.
 */

function CardProduct({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.coffeOrder.cart || []);
  const [added, setAdded] = useState(false);
  const currentStock = product.stock ?? 0;

  const formatRupiah = (price) => `IDR ${price.toLocaleString("id-ID")}`;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`${
            i < fullStars ? "text-yellow-400" : "text-gray-300"
          } text-sm`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleAddToCart = (product) => {
    if (product.stock <= 0) return;
    const exists = cartItems.find((item) => item.productId === product.id);
    if (!exists) {
      dispatch(
        addToCart({
          id: product.id,
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          originalPrice: product.originalPrice,
          isFlashSale: product.isFlashSale,
          quantity: 1,
          size: "Regular",
          temperature: "Ice",
          delivery: "Dine In",
          cartItemId: Date.now() + Math.random().toString(36).substr(2, 5),
        })
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className="relative shadow-md hover:shadow-lg transition-shadow overflow-visible min-h-[520px] pb-6">
      {product.isFlashSale && (
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded z-10">
          FLASH SALE!
        </div>
      )}
      <div className="w-full h-60 sm:h-64 md:h-72 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
            currentStock <= 0 ? "opacity-60" : "hover:scale-105"
          }`}
        />
        {currentStock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">SOLD OUT</span>
          </div>
        )}
      </div>

      <div className="absolute top-[230px] left-1/2 -translate-x-1/2 w-[90%] sm:w-[85%] bg-white p-4 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center mb-3">
          <div className="flex mr-1">{renderStars(product.rating)}</div>
          <span className="text-xs text-gray-600 ml-1">
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            {product.isFlashSale ? (
              <>
                {product.originalPrice && (
                  <span className="text-sm text-red-500 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
                <span className="text-lg font-bold text-[#FF8906]">
                  {formatRupiah(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">
                {formatRupiah(product.originalPrice ?? product.price)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {product.stock > 0 ? (
            <Link
              to={`/detail-product/${product.slug}`}
              className="flex-1 text-sm py-2 px-4 rounded-md font-semibold transition-colors duration-300 flex items-center justify-center bg-[#FF8906] hover:bg-[#e67a05] text-white"
            >
              Buy
            </Link>
          ) : (
            <button
              disabled
              className="flex-1 text-sm py-2 px-4 rounded-md font-semibold bg-gray-300 text-gray-600 cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
          <button
            onClick={() => handleAddToCart(product)}
            className="border border-[#FF8906] p-2 rounded-md transition-colors h-10 w-10 flex items-center justify-center shrink-0 hover:bg-[#FFF3E0]"
          >
            <ShoppingCart className="w-5 h-5 text-[#FF8906]" />
          </button>
        </div>

        {added && product.stock > 0 && (
          <div className="mt-2 text-center text-green-600 text-sm font-semibold">
            Added to Cart!
          </div>
        )}
      </div>
    </div>
  );
}

export default CardProduct;
