import React, { useState } from "react";
import { MoveRight } from "lucide-react";

const Pagination = ({
  data = [],
  itemsPerPage = 4,
  renderItem,
  gridCols = "grid-cols-2 md:grid-cols-4",
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="w-full">
      <div className={`grid ${gridCols} gap-5`}>
        {currentItems.map(renderItem)}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition ${
                currentPage === i + 1
                  ? "bg-[#FF8906] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-[#FF8906]"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={handleNextPage}
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
      )}
    </div>
  );
};

export default Pagination;
