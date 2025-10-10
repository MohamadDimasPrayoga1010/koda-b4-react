import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const CardProductStock = ({
  maxItems = null,
  showFlashSaleOnly = false,
  excludeFlashSale = false,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/data/stockProduct.json");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  if (loading) {
    return (
      <div className="col-span-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Filter produk berdasarkan searchQuery
  let filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter flash sale jika showFlashSaleOnly=true
  if (showFlashSaleOnly) {
    filteredProducts = filteredProducts.filter(
      (product) => product.isFlashSale
    );
  }

  // Exclude flash sale jika excludeFlashSale=true
  if (excludeFlashSale) {
    filteredProducts = filteredProducts.filter(
      (product) => !product.isFlashSale
    );
  }


  const displayedProducts = maxItems
    ? filteredProducts.slice(0, maxItems)
    : filteredProducts;

  return (
    <>
      {displayedProducts.map((product) => (
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
      ))}
    </>
  );
};

export default CardProductStock;
