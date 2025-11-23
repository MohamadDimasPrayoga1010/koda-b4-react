import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import CoffeImg from "/images/coffeder.jpeg";
import BaristaImg from "/images/coffeder2.jpeg";
import CeklisImg from "/images/ceklis.png";
import CardProduct from "../components/CardProduct";
import MapsImg from "/images/maps.png";
import ChatWidget from "../components/ChatWidget";
import Testimonial from "../components/Testimonial";
import { getFavoriteProducts } from "../utils/products";
import { CheckCircle2, Users, Store, Heart } from "lucide-react";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getFavoriteProducts(10);
        console.log(res);
        if (res.success) {
          setProducts(res.data);
        } else {
          setError(res.message);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-700 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-amber-100 opacity-20 mx-auto animate-ping"></div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-500 font-semibold text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="overflow-x-hidden">
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen relative">
        <div className="order-1 lg:order-2 w-full h-[50vh] lg:h-full relative overflow-hidden group">
          <img
            src={CoffeImg}
            alt="coffee-img"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden"></div>
        </div>

        <div className="order-2 lg:order-1 flex items-center justify-center bg-gradient-to-br from-[#777C82] via-[#4a4e54] to-[#0B0909] text-center px-6 py-12 lg:py-20 min-h-[50vh] lg:min-h-screen relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-700/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-800/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-xl relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Start Your Day with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-700">
                Coffee
              </span>{" "}
              and Good Meals
            </h1>
            
            <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
              We provide high quality beans, good taste, and healthy meals made
              by love just for you. Start your day with us for a bigger smile!
            </p>
            
            <Button className="bg-gradient-to-r from-[#8B4513] to-[#654321] hover:from-[#654321] hover:to-[#8B4513] text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-amber-900/30 hover:shadow-xl hover:shadow-amber-900/40 transition-all duration-300 hover:scale-105">
              Get Started
            </Button>

            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/20">
              <div className="text-center group cursor-pointer">
                <div className="mb-2 flex items-center justify-center">
                  <Users className="w-6 h-6 text-amber-400 mr-2" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-700 group-hover:scale-110 transition-transform">
                  90+
                </h3>
                <p className="text-sm md:text-base text-gray-300 mt-1 font-medium">Staff</p>
              </div>
              
              <div className="text-center group cursor-pointer border-x border-white/20">
                <div className="mb-2 flex items-center justify-center">
                  <Store className="w-6 h-6 text-amber-400 mr-2" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-700 group-hover:scale-110 transition-transform">
                  30+
                </h3>
                <p className="text-sm md:text-base text-gray-300 mt-1 font-medium">Stores</p>
              </div>
              
              <div className="text-center group cursor-pointer">
                <div className="mb-2 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-amber-400 mr-2" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-700 group-hover:scale-110 transition-transform">
                  800+
                </h3>
                <p className="text-sm md:text-base text-gray-300 mt-1 font-medium">Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-gradient-to-br from-white to-amber-50/30">
        <div className="order-1 lg:order-1 w-full h-[50vh] lg:h-full relative overflow-hidden group">
          <img
            src={BaristaImg}
            alt="barista"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent lg:hidden"></div>
        </div>

        <div className="order-2 flex items-center justify-center px-6 py-12 lg:py-20 min-h-[50vh] lg:min-h-screen">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              We Provide{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B4423] to-[#8E6447]">
                Good Coffee
              </span>
              <br />
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B4423] to-[#8E6447]">
                  and Healthy Meals
                </span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B4513] to-transparent"></span>
              </span>
            </h2>

            <p className="text-[#4F5665] text-base md:text-lg mb-8 leading-relaxed">
              You can explore the menu that we provide with fun and have their
              own taste and make your day better.
            </p>

            <div className="space-y-4">
              {[
                "High quality beans",
                "Healthy meals, you can request the ingredients",
                "Chat with our staff to get better experience for ordering",
                "Free member card with a minimum purchase of IDR 200.000"
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100 hover:border-amber-200"
                >
                  <div className="flex-shrink-0 w-6 h-6 mt-0.5">
                    <CheckCircle2 className="w-6 h-6 text-amber-700 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-[#4F5665] text-sm md:text-base font-medium flex-1">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Here is People's{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8E6447] to-[#6B4423]">
                Favorite
              </span>
            </h2>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent to-[#8B4513] rounded-full"></div>
              <div className="h-1 w-8 bg-[#8B4513] rounded-full"></div>
              <div className="h-1 w-20 bg-gradient-to-l from-transparent to-[#8B4513] rounded-full"></div>
            </div>
            
            <p className="text-base md:text-lg text-[#4F5665] max-w-2xl mx-auto">
              Let's choose and have a bit taste of people's favorite. It might be
              yours too!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.slice(0, 4).map((product) => (
              <CardProduct key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8E6447] to-[#6B4423]">
                Visit Our Store
              </span>
              <br className="hidden md:block" /> in the Spot on the Map Below
            </h2>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent to-[#8B4513] rounded-full"></div>
              <div className="h-1 w-8 bg-[#8B4513] rounded-full"></div>
              <div className="h-1 w-20 bg-gradient-to-l from-transparent to-[#8B4513] rounded-full"></div>
            </div>
            
            <p className="text-base md:text-lg text-[#4F5665] max-w-2xl mx-auto">
              You can explore the menu that we provide with fun and have their own
              taste and make your day better.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100 hover:border-amber-200 transition-colors duration-300">
            <img 
              src={MapsImg} 
              alt="maps-image" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      <Testimonial />
      <ChatWidget />
    </main>
  );
};

export default HomePage;