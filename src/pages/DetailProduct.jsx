import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, ThumbsUp } from "lucide-react";
import CardProduct from "../components/CardProduct";
import Pagination from "../components/Pagination";
import { fetchDetailProduct } from "../utils/products";
import { apiRequest } from "../utils/api";
import AuthAlert from "../components/AuthAlert";
import { useSelector } from "react-redux";

const DetailProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    selectedProduct?.sizes?.[0]?.id || null
  );
  const [selectedTemp, setSelectedTemp] = useState("Ice");
  const [mainImage, setMainImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchDetailProduct(slug);
        if (!result.success) {
          setError(result.message || "Failed to fetch product");
          setSelectedProduct(null);
          return;
        }

        const transformedProduct = transformProductData(result.data);
        setSelectedProduct(transformedProduct);

        if (result.data.recommended && result.data.recommended.length > 0) {
          const transformedRecommended =
            result.data.recommended.map(transformProductData);
          setProducts(transformedRecommended);
        }

        if (result.data.sizes && result.data.sizes.length > 0) {
          setSelectedSize(result.data.sizes[0].id);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
        setSelectedProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const transformProductData = (data) => ({
    id: data.id,
    name: data.title,
    slug: data.id.toString(),
    description: data.description,
    price: calculateTotalPrice(data),
    basePrice: data.basePrice,
    originalPrice: data.basePrice,
    isFlashSale: false,
    rating: data.rating ?? 4.5,
    stock: data.stock,
    image:
      data.images && data.images.length > 0
        ? data.images[0].image
        : "/placeholder.jpg",
    images: data.images ? data.images.map((img) => img.image) : [],
    category: data.categoryId,
    variant: data.variant,
    sizes: data.sizes || [],
    recommended: data.recommended || [],
  });

  const calculateTotalPrice = (product) => {
    let total = product.basePrice || 0;
    if (product.variant?.additionalPrice)
      total += product.variant.additionalPrice;
    return total;
  };

  const getCurrentPrice = () => {
    if (!selectedProduct) return 0;
    let price = selectedProduct.basePrice;

    if (selectedProduct.variant?.name !== "Food" && selectedTemp === "Ice") {
      price += 7000;
    }

    if (selectedSize && selectedProduct.sizes) {
      const size = selectedProduct.sizes.find((s) => s.id === selectedSize);
      if (size?.additionalPrice) price += size.additionalPrice;
    }

    return price;
  };
  const auth = useSelector((state) => state.auth);
  const token = auth?.token || null;

  const addToCart = async (navigateToPayment = false) => {
    if (!selectedProduct) return;

    const cartItem = {
      productId: selectedProduct.id,
      size_id: selectedSize || null,
      variantId: selectedProduct.variant?.id || null,
      quantity: quantity,
    };
    console.log("Cart item to send:", cartItem);

    try {
      const response = await apiRequest("/cart", "POST", [cartItem], token);
      if (!response.success) {
        setAlertMessage(response.message || "Failed to add to cart");
        setAlertType("error");
        return;
      }

      console.log("Cart response:", response.data);

      if (navigateToPayment) {
        navigate("/payment-details");
      } else {
        setAlertMessage("Item added to cart successfully!");
        setAlertType("success");
        setTimeout(() => setAlertMessage(""), 3000);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setAlertMessage("Network error. Please try again.");
      setAlertType("error");
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-amber-50/30 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-700 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-amber-100 opacity-20 mx-auto animate-ping"></div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-amber-50/30 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            {error || "Product Not Found"}
          </h2>
          <Link
            to="/our-product"
            className="inline-block bg-gradient-to-r from-[#8B4513] to-[#654321] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#654321] hover:to-[#8B4513] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const productImages =
    selectedProduct.images && selectedProduct.images.length > 0
      ? selectedProduct.images
      : [selectedProduct.image];

  return (
    <main className="bg-gradient-to-br from-gray-50 to-amber-50/30 min-h-screen py-8 px-6 md:px-16 my-20">
      <AuthAlert type={alertType} message={alertMessage} />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-amber-100">
        <div>
          <div className="relative mb-4 rounded-2xl overflow-hidden group">
            {selectedProduct.isFlashSale && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-4 py-2 rounded-full z-10 shadow-lg animate-pulse">
                FLASHSALE!
              </div>
            )}
            <img
              src={productImages[mainImage]}
              alt={selectedProduct.name}
              className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {productImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${selectedProduct.name} ${idx + 1}`}
                onClick={() => setMainImage(idx)}
                className={`w-full h-24 object-cover rounded-xl cursor-pointer transition-all duration-300 ${
                  mainImage === idx
                    ? "ring-4 ring-[#8B4513] shadow-lg scale-105"
                    : "hover:opacity-75 hover:scale-105"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 leading-tight">
            {selectedProduct.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            {selectedProduct.isFlashSale ? (
              <>
                {selectedProduct.originalPrice && (
                  <p className="text-lg text-red-500 line-through">
                    IDR {selectedProduct.originalPrice.toLocaleString("id-ID")}
                  </p>
                )}
                <p className="text-3xl font-black bg-gradient-to-r from-[#8B4513] to-[#654321] bg-clip-text text-transparent">
                  IDR {getCurrentPrice().toLocaleString("id-ID")}
                </p>
              </>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Base Price: IDR{" "}
                  {selectedProduct.basePrice.toLocaleString("id-ID")}
                </p>
                <p className="text-3xl font-black bg-gradient-to-r from-[#8B4513] to-[#654321] bg-clip-text text-transparent">
                  IDR {getCurrentPrice().toLocaleString("id-ID")}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={`${
                  i < Math.floor(selectedProduct.rating)
                    ? "text-amber-500 fill-amber-500"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-lg font-semibold ml-1">
              {selectedProduct.rating.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6 text-[#4F5665]">
            <p className="text-sm font-medium">200+ Review</p>
            <span className="border-l h-4 border-gray-300"></span>
            <p className="text-sm font-medium">Recommendation</p>
            <ThumbsUp size={18} className="text-[#8B4513]" />
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed text-base">
            {selectedProduct.description}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 border-2 border-[#8B4513] rounded-lg flex items-center justify-center font-bold text-[#8B4513] hover:bg-amber-50 transition-all duration-300 hover:scale-105"
            >
              -
            </button>
            <span className="text-xl font-semibold min-w-[3ch] text-center">{quantity}</span>
            <button
              onClick={() => {
                if (quantity < selectedProduct.stock) setQuantity(quantity + 1);
              }}
              disabled={quantity >= selectedProduct.stock}
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all duration-300 ${
                quantity < selectedProduct.stock
                  ? "bg-gradient-to-r from-[#8B4513] to-[#654321] text-white hover:from-[#654321] hover:to-[#8B4513] hover:scale-105 shadow-md"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              +
            </button>
          </div>

          <div className="mb-6 text-sm">
            {selectedProduct.stock > 0 ? (
              <p className="text-gray-600 font-medium">
                Stock tersisa: <span className="text-[#8B4513] font-bold">{selectedProduct.stock - quantity}</span>
              </p>
            ) : (
              <p className="text-red-500 font-semibold">Stock habis</p>
            )}
          </div>

          {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
            <div className="mb-6">
              <p className="font-bold text-lg mb-3 text-gray-800">Choose Size</p>
              <div className="flex gap-3 flex-wrap">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(Number(size.id))}
                    className={`px-5 py-3 rounded-xl border-2 transition-all duration-300 ${
                      selectedSize === size.id
                        ? "border-[#8B4513] bg-amber-50 text-[#8B4513] shadow-md scale-105"
                        : "border-gray-300 hover:border-[#8B4513] hover:bg-amber-50/50"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-semibold">{size.name}</span>
                      {size.additionalPrice > 0 && (
                        <span className="text-xs text-gray-500 mt-1">
                          +IDR {size.additionalPrice.toLocaleString("id-ID")}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedProduct.variant?.name !== "Food" && (
            <div className="mb-8">
              <p className="font-bold text-lg mb-3 text-gray-800">Hot/Ice</p>
              <div className="flex gap-3">
                {["Ice", "Hot"].map((temp) => (
                  <button
                    key={temp}
                    onClick={() => setSelectedTemp(temp)}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all duration-300 font-semibold ${
                      selectedTemp === temp
                        ? "border-[#8B4513] bg-amber-50 text-[#8B4513] shadow-md scale-105"
                        : "border-gray-300 hover:border-[#8B4513] hover:bg-amber-50/50"
                    }`}
                  >
                    {temp}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => addToCart(true)}
              disabled={selectedProduct.stock === 0}
              className="flex-1 bg-gradient-to-r from-[#8B4513] to-[#654321] text-white py-3 rounded-xl font-bold hover:from-[#654321] hover:to-[#8B4513] transition-all duration-300 shadow-lg shadow-amber-900/30 hover:shadow-xl hover:shadow-amber-900/40 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.02] active:scale-[0.98]"
            >
              {selectedProduct.stock === 0 ? "Out of Stock" : "Buy Now"}
            </button>
            <button
              onClick={() => addToCart(false)}
              disabled={selectedProduct.stock === 0}
              className="flex-1 border-2 border-[#8B4513] text-[#8B4513] py-3 rounded-xl font-bold hover:bg-amber-50 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>

          {added && (
            <div className="mt-4 text-green-600 text-center text-sm font-bold bg-green-50 py-2 rounded-lg animate-pulse">
              ✓ Added to Cart!
            </div>
          )}
        </div>
      </section>

      {products.length > 0 && (
        <section className="my-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center md:text-start text-gray-800">
            Recommendation <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8E6447] to-[#6B4423]">For You</span>
          </h1>
          <Pagination
            data={products}
            itemsPerPage={4}
            gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            renderItem={(product) => (
              <CardProduct key={product.id} product={product} />
            )}
          />
        </section>
      )}
    </main>
  );
};

export default DetailProduct;