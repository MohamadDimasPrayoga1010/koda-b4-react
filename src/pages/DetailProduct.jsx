import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, ThumbsUp } from "lucide-react";
import CardProduct from "../components/CardProduct";
import Pagination from "../components/Pagination";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/coffeOrder";
import { fetchDetailProduct } from "../utils/products";

const DetailProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedTemp, setSelectedTemp] = useState("Ice");
  const [mainImage, setMainImage] = useState(0);
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(" Slug from useParams:", slug);
        console.log(" Type of slug:", typeof slug);
        const productId = slug;

        const result = await fetchDetailProduct(productId);
        console.log(result);

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
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message || "Failed to load product");
        setSelectedProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const transformProductData = (data) => {
    return {
      id: data.id,
      name: data.title,
      slug: data.id.toString(),
      description: data.description,
      price: calculateTotalPrice(data),
      basePrice: data.basePrice,
      originalPrice: data.basePrice,
      isFlashSale: false,
      rating: data.rating ?? 0,
      rating: 4.5,
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
    };
  };

  
  const calculateTotalPrice = (product) => {
    let total = product.basePrice || 0;

    if (product.variant && product.variant.additionalPrice) {
      total += product.variant.additionalPrice;
    }

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
      if (size && size.additionalPrice) {
        price += size.additionalPrice;
      }
    }

    return price;
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;

    const currentPrice = getCurrentPrice();
    const selectedSizeObj = selectedProduct.sizes?.find(
      (s) => s.id === selectedSize
    );

    const item = {
      productId: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      price: currentPrice,
      originalPrice: selectedProduct.originalPrice || null,
      isFlashSale: selectedProduct.isFlashSale || false,
      quantity,
      size: selectedSizeObj?.name || "Regular",
      sizeId: selectedSize,
      temperature: selectedTemp,
      variant: selectedProduct.variant?.name || null,
      delivery: "Dine In",
      cartItemId: Date.now() + Math.random().toString(36).substr(2, 5),
    };

    dispatch(addToCart(item));
    navigate("/payment-details");
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const currentPrice = getCurrentPrice();
    const selectedSizeObj = selectedProduct.sizes?.find(
      (s) => s.id === selectedSize
    );

    const item = {
      productId: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      price: currentPrice,
      originalPrice: selectedProduct.originalPrice || null,
      isFlashSale: selectedProduct.isFlashSale || false,
      quantity,
      size: selectedSizeObj?.name || "Regular",
      sizeId: selectedSize,
      temperature: selectedTemp,
      variant: selectedProduct.variant?.name || null,
      delivery: "Dine In",
    };

    dispatch(addToCart(item));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            {error || "Product Not Found"}
          </h2>
          <Link
            to="/our-product"
            className="inline-block bg-[#FF8906] text-white px-6 py-3 rounded hover:bg-[#e67a05] transition"
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
    <main className="bg-gray-50 min-h-screen py-8 px-6 md:px-16 my-20">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg p-6 shadow-lg">
        {/* Product Images */}
        <div>
          <div className="relative mb-4">
            {selectedProduct.isFlashSale && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded z-10">
                FLASHSALE!
              </div>
            )}
            {/* {selectedProduct.variant && (
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded z-10">
                {selectedProduct.variant.name}
              </div>
            )} */}
            <img
              src={productImages[mainImage]}
              alt={selectedProduct.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-3 gap-2">
            {productImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${selectedProduct.name} ${idx + 1}`}
                onClick={() => setMainImage(idx)}
                className={`w-full h-24 object-cover rounded cursor-pointer transition ${
                  mainImage === idx
                    ? "ring-2 ring-[#FF8906]"
                    : "hover:opacity-75"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            {selectedProduct.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <div>
              {/* <p className="text-sm text-gray-500 mb-1">
                  Base Price: IDR {selectedProduct.basePrice.toLocaleString("id-ID")}
                </p> */}
              {/* <p className="text-2xl font-bold text-gray-800">
                IDR {getCurrentPrice().toLocaleString("id-ID")}
              </p> */}
            </div>
            {selectedProduct.isFlashSale ? (
              <>
                {selectedProduct.originalPrice && (
                  <p className="text-lg text-red-500 line-through">
                    IDR {selectedProduct.originalPrice.toLocaleString("id-ID")}
                  </p>
                )}
                <p className="text-2xl font-bold text-[#FF8906]">
                  IDR {getCurrentPrice().toLocaleString("id-ID")}
                </p>
              </>
            ) : (
            <div>
                <p className="text-sm text-gray-500 mb-1">
                  Base Price: IDR {selectedProduct.basePrice.toLocaleString("id-ID")}
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  IDR {getCurrentPrice().toLocaleString("id-ID")}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={`${
                  i < Math.floor(selectedProduct.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-lg font-semibold">
              {selectedProduct.rating.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6 text-[#4F5665]">
            <p>200+ Review</p>
            <span className="border-l h-4 border-gray-300"></span>
            <p>Recommendation</p>
            <ThumbsUp size={18} className="text-[#FF8906]" />
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {selectedProduct.description}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 border border-[#FF8906] flex items-center justify-center font-bold hover:bg-orange-50 transition"
            >
              -
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={() => {
                if (quantity < selectedProduct.stock) {
                  setQuantity(quantity + 1);
                }
              }}
              disabled={quantity >= selectedProduct.stock}
              className={`w-8 h-8 flex items-center justify-center font-bold transition ${
                quantity < selectedProduct.stock
                  ? "bg-[#FF8906] text-white hover:bg-orange-600"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              +
            </button>
          </div>

          <div className="mb-6 text-sm text-gray-500">
            {selectedProduct.stock > 0 ? (
              <p>Stock tersisa: {selectedProduct.stock - quantity}</p>
            ) : (
              <p className="text-red-500 font-medium">Stock habis</p>
            )}
          </div>

          {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
            <div className="mb-6">
              <p className="font-bold text-lg mb-3">Choose Size</p>
              <div className="flex gap-3 flex-wrap">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`px-4 py-2 rounded border transition ${
                      selectedSize === size.id
                        ? "border-[#FF8906] bg-orange-50 text-[#FF8906]"
                        : "border-gray-300 hover:border-[#FF8906]"
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
              <p className="font-bold text-lg mb-3">Hot/Ice</p>
              <div className="flex gap-3">
                {["Ice", "Hot"].map((temp) => (
                  <button
                    key={temp}
                    onClick={() => setSelectedTemp(temp)}
                    className={`flex-1 py-2 rounded border transition ${
                      selectedTemp === temp
                        ? "border-[#FF8906] bg-orange-50 text-[#FF8906]"
                        : "border-gray-300 hover:border-[#FF8906]"
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
              onClick={handleBuyNow}
              disabled={selectedProduct.stock === 0}
              className="flex-1 bg-[#FF8906] text-white py-3 rounded font-semibold hover:bg-orange-600 transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {selectedProduct.stock === 0 ? "Out of Stock" : "Buy Now"}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={selectedProduct.stock === 0}
              className="flex-1 border border-[#FF8906] text-[#FF8906] py-3 rounded font-semibold hover:bg-orange-50 transition flex items-center justify-center gap-2 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>

          {added && (
            <div className="mt-3 text-green-600 text-center text-sm font-semibold">
              Added to Cart!
            </div>
          )}
        </div>
      </section>

      {products.length > 0 && (
        <section className="my-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center md:text-start">
            Recommendation <span className="text-[#8E6447]">For You</span>
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
