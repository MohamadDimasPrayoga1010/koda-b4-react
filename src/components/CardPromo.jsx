import React, { useEffect, useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
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
    <section className="my-10">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl mx-12 md:text-5xl font-medium">
          Today <span className="text-[#8E6447]">Promo</span>
        </h3>
        <div className="flex gap-2 items-center mx-12">
          <button
            onClick={handlePrev}
            className="bg-[#E8E8E8] p-3 rounded-full hover:bg-[#D6D6D6] transition"
          >
            <MoveLeft className="w-4 h-4 text-black" />
          </button>
          <button
            onClick={handleNext}
            className="bg-[#FF8906] p-3 rounded-full hover:bg-[#e67a00] transition"
          >
            <MoveRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-8 mt-8 hide-scrollbar ">
        {displayedPromos.map((promo) => (
          <div
            key={promo.id}
            className={`rounded-xl flex flex-nowrap  items-center gap-4 text-white min-w-sm md:min-w-xs shadow-md ${
              promo.bgColor ? promo.bgColor : "bg-[#88B788]"
            }`}
          >
            <img
              src={promo.image}
              alt={promo.title}
              className=" object-contain"
            />
            <div className="flex flex-col">
              <h1 className="text-base font-semibold">{promo.title}</h1>
              <p className="text-sm font-normal">{promo.description}</p>
              {promo.ticket && (
                <Link to="#" className="mt-2 text-white">
                  {promo.ticket}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4 mx-12 md:justify-start">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <span
            key={idx}
            className={`transition-all duration-300 ${
              idx === currentPage
                ? "bg-[#FF8906] w-6 h-3 rounded-full"
                : "bg-gray-300 w-3 h-3 rounded-full"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default PromoSection;
