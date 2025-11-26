import React, { useEffect, useState } from "react";
import { MoveLeft, MoveRight, Tag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * @typedef {Object} Promo
 * @property {number} id - ID unik untuk promo.
 * @property {string} title - Judul promo.
 * @property {string} description - Deskripsi singkat promo.
 * @property {string} image - URL gambar promo.
 * @property {string} [ticket] - Keterangan tambahan promo (misalnya kode voucher).
 * @property {string} [bgColor] - Warna latar belakang promo (contoh: "bg-[#88B788]").
 */

const PromoSection = () => {
  const [promos, setPromos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await fetch("/data/promo.json");
        const data = await response.json();
        setPromos(data);
      } catch (error) {
        console.error("Error fetching promos:", error);
      }
    };
    fetchPromos();
  }, []);

  const totalPages = Math.ceil(promos.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const displayedPromos = promos.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <section className="my-16 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#D4A574]/10 to-transparent rounded-full blur-3xl -z-10"></div>
      
      <div className="flex justify-between items-center mb-8">
        <div className="mx-6 md:mx-12">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-7 h-7 text-[#D4A574] animate-pulse" />
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1A0F0A]">
              Today <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A574] to-[#8B6F47]">Promo</span>
            </h3>
          </div>
          <div className="h-1.5 w-24 bg-gradient-to-r from-[#D4A574] to-transparent rounded-full"></div>
        </div>
        
        <div className="flex gap-3 items-center mx-6 md:mx-12">
          <button
            onClick={handlePrev}
            className="bg-white border-2 border-[#D4A574]/30 p-3 rounded-xl hover:bg-gradient-to-br hover:from-[#F5E6D3] hover:to-[#FAF8F5] hover:border-[#D4A574] transition-all duration-300 hover:scale-110 hover:shadow-lg group"
          >
            <MoveLeft className="w-5 h-5 text-[#6B5744] group-hover:text-[#8B6F47] transition-colors" />
          </button>
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-[#D4A574] to-[#8B6F47] p-3 rounded-xl hover:from-[#8B6F47] hover:to-[#D4A574] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#D4A574]/40 group"
          >
            <MoveRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-6 md:gap-8 mt-8 hide-scrollbar mx-6 md:mx-12">
        {displayedPromos.map((promo) => (
          <div
            key={promo.id}
            className={`rounded-xl flex flex-nowrap items-center gap-4 text-white min-w-sm md:min-w-xs shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
              promo.bgColor ? promo.bgColor : "bg-[#88B788]"
            }`}
          >
            <img
              src={promo.image}
              alt={promo.title}
              className="object-contain"
            />
            <div className="flex flex-col pr-4">
              <h1 className="text-base font-semibold">{promo.title}</h1>
              <p className="text-sm font-normal">{promo.description}</p>
              {promo.ticket && (
                <Link to="#" className="mt-2 text-white underline hover:no-underline transition-all">
                  {promo.ticket}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2.5 mt-8 mx-6 md:mx-12 justify-start md:justify-start items-center">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx)}
            className={`transition-all duration-300 cursor-pointer hover:scale-110 ${
              idx === currentPage
                ? "bg-gradient-to-r from-[#D4A574] to-[#8B6F47] w-8 h-3 rounded-full shadow-md"
                : "bg-[#D4A574]/30 hover:bg-[#D4A574]/50 w-3 h-3 rounded-full"
            }`}
            aria-label={`Go to promo page ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default PromoSection;