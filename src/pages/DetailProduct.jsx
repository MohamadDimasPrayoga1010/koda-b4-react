import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, ThumbsUp, MoveLeft, MoveRight } from "lucide-react";
import CardProductStock from "../components/CardProductStock";
import CardProduct from "../components/CardProduct";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/data/stockProduct.json");
        const data = await response.json();
        setProducts(data)
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

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const newItem = {
      id: Date.now(),
      productId: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      price: selectedProduct.price,
      originalPrice: selectedProduct.originalPrice,
      isFlashSale: selectedProduct.isFlashSale,
      quantity,
      size: selectedSize,
      temperature: selectedTemp,
      delivery: "Dine In",
    };

    existingCart.push(newItem);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    navigate("/payment-details");
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const newItem = {
      id: Date.now(),
      productId: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      price: selectedProduct.price,
      originalPrice: selectedProduct.originalPrice,
      isFlashSale: selectedProduct.isFlashSale,
      quantity,
      size: selectedSize,
      temperature: selectedTemp,
      delivery: "Dine In",
    };

    existingCart.push(newItem);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // alert(`${product.name} added to cart!`);
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


  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);

  };

  const productImages = selectedProduct.images || [
    selectedProduct.image,
    selectedProduct.image,
    selectedProduct.image,
  ];

  return (
    <main className="bg-gray-50 min-h-screen py-8 px-6 md:px-16">
      <Link
        to="/our-product"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <MoveLeft size={20} />
        <span>Back to Products</span>
      </Link>

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
                  className={`px-6 py-2 rounded border transition ${
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
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Recommendation <span className="text-[#8E6447]">For You</span>
        </h1>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {currentProducts.map((product) => (
            <CardProduct key={product.id} product={product} />
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          {/* Prev */}
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition ${
              currentPage === 1
                ? "bg-[#E8E8E8] text-[#A0A3BD] cursor-not-allowed opacity-50"
                : "bg-[#FF8906] text-white hover:bg-[#e67a00]"
            }`}
          >
           <MoveLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition ${
                currentPage === page
                  ? "bg-[#FF8906] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-[#FF8906]"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition ${
              currentPage === totalPages
                ? "bg-[#E8E8E8] text-[#A0A3BD] cursor-not-allowed opacity-50"
                : "bg-[#FF8906] text-white hover:bg-[#e67a00]"
            }`}
          >
           <MoveRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  );
};

export default DetailProduct;
