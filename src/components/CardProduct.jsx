import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

function CardProduct({ product }) {
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
    console.log("Added to cart:", product);
  };
  return (
    <div
      key={product.id}
      className="relative shadow-md hover:shadow-lg transition-shadow overflow-visible min-h-[520px] pb-6"
    >
      {product.isFlashSale && (
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded z-10">
          FLASH SALE!
        </div>
      )}
      <div className="w-full h-60 sm:h-64 md:h-72 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
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
            {product.originalPrice && (
              <span className="text-sm text-red-500 line-through">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-[#FF8906]">
              {formatRupiah(product.price)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/detail-product/${product.slug}`}
            className="flex-1 bg-[#FF8906] hover:bg-[#e67a05] text-white text-sm py-2 px-4 rounded-md font-semibold transition-colors duration-300 flex items-center justify-center"
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
      </div>
    </div>
  );
}

export default CardProduct;
