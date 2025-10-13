import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, ThumbsUp } from "lucide-react";
import CardProduct from "../components/CardProduct";
import Pagination from "../components/Pagination";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/coffeOrder";

const DetailProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Regular");
  const [selectedTemp, setSelectedTemp] = useState("Ice");
  const [mainImage, setMainImage] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/data/stockProduct.json");
        const data = await response.json();
        setProducts(data);
        const found = data.find((item) => item.slug === slug);
        setSelectedProduct(found || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleBuyNow = () => {
    if (!selectedProduct) return;

    const item = {
      productId: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      price: selectedProduct.price,
      originalPrice: selectedProduct.originalPrice || null,
      isFlashSale: selectedProduct.isFlashSale || false,
      quantity,
      size: selectedSize,
      temperature: selectedTemp,
      delivery: "Dine In",
      cartItemId: Date.now() + Math.random().toString(36).substr(2, 5),
    };

    dispatch(addToCart(item));
    navigate("/payment-details");
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const item = {
      productId: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      price: selectedProduct.price,
      originalPrice: selectedProduct.originalPrice || null,
      isFlashSale: selectedProduct.isFlashSale || false,
      quantity,
      size: selectedSize,
      temperature: selectedTemp,
      delivery: "Dine In",
    };

    dispatch(addToCart(item));
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

  if (!selectedProduct) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Product Not Found
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

  const productImages = selectedProduct.images || [
    selectedProduct.image,
    selectedProduct.image,
    selectedProduct.image,
  ];

  return (
    <main className="bg-gray-50 min-h-screen py-8 px-6  md:px-16 my-20">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg p-6 shadow-lg">
        <div>
          <div className="relative mb-4">
            {selectedProduct.isFlashSale && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded z-10">
                FLASHSALE!
              </div>
            )}
            <img
              src={productImages[mainImage]}
              alt={selectedProduct.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
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
            {selectedProduct.originalPrice && (
              <p className="text-lg text-red-500 line-through">
                IDR {selectedProduct.originalPrice.toLocaleString("id-ID")}
              </p>
            )}
            <p className="text-2xl font-bold text-[#FF8906]">
              IDR {selectedProduct.price.toLocaleString("id-ID")}
            </p>
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
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 bg-[#FF8906] text-white flex items-center justify-center font-bold hover:bg-orange-600 transition"
            >
              +
            </button>
          </div>

          <div className="mb-6">
            <p className="font-bold text-lg mb-3">Choose Size</p>
            <div className="flex gap-3">
              {["Regular", "Medium", "Large"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-1 md:px-6 md:py-2 rounded border transition ${
                    selectedSize === size
                      ? "border-[#FF8906] bg-orange-50 text-[#FF8906]"
                      : "border-gray-300 hover:border-[#FF8906]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

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

          <div className="flex gap-4">
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-[#FF8906] text-white py-3 rounded font-semibold hover:bg-orange-600 transition flex items-center justify-center"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 border border-[#FF8906] text-[#FF8906] py-3 rounded font-semibold hover:bg-orange-50 transition flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </section>

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
    </main>
  );
};

export default DetailProduct;
