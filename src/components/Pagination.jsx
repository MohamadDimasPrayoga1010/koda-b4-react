import React, { useState } from "react";
import { MoveRight, MoveLeft } from "lucide-react";

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      <div className={`grid ${gridCols} gap-5 md:gap-6`}>
        {currentItems.map(renderItem)}
      </div>
      {totalPages > 1 && (
        <div className="mt-12">
          <div className="text-center mb-6">
            <p className="text-sm text-[#8B7355] font-medium">
              Showing{" "}
              <span className="text-[#6B5744] font-bold">
                {startIndex + 1}-{Math.min(startIndex + itemsPerPage, data.length)}
              </span>{" "}
              of{" "}
              <span className="text-[#6B5744] font-bold">{data.length}</span>{" "}
              products
            </p>
          </div>

          <div className="flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`w-11 h-11 flex items-center justify-center rounded-xl font-medium transition-all duration-300 ${
                currentPage === 1
                  ? "bg-[#F5E6D3]/50 text-[#8B7355] cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-[#D4A574] to-[#8B6F47] text-white hover:shadow-lg hover:shadow-[#D4A574]/30 hover:scale-110"
              }`}
            >
              <MoveLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                const isActive = currentPage === pageNum;
                const isNearCurrent = Math.abs(currentPage - pageNum) <= 1;
                const isFirstOrLast = pageNum === 1 || pageNum === totalPages;

                if (isFirstOrLast || isNearCurrent) {
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-11 h-11 flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-[#D4A574] to-[#8B6F47] text-white shadow-lg shadow-[#D4A574]/40 scale-110"
                          : "bg-white border-2 border-[#D4A574]/20 text-[#6B5744] hover:bg-gradient-to-r hover:from-[#F5E6D3] hover:to-[#FAF8F5] hover:border-[#D4A574] hover:text-[#8B6F47] hover:scale-105"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }

                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return (
                    <span
                      key={i}
                      className="w-11 h-11 flex items-center justify-center text-[#8B7355] font-bold"
                    >
                      ...
                    </span>
                  );
                }

                return null;
              })}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`w-11 h-11 flex items-center justify-center rounded-xl font-medium transition-all duration-300 ${
                currentPage === totalPages
                  ? "bg-[#F5E6D3]/50 text-[#8B7355] cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-[#D4A574] to-[#8B6F47] text-white hover:shadow-lg hover:shadow-[#D4A574]/30 hover:scale-110"
              }`}
            >
              <MoveRight className="w-4 h-4" />
            </button>
          </div>

          {totalPages > 5 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <span className="text-sm text-[#8B7355] font-medium">Jump to:</span>
              <select
                value={currentPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                className="px-4 py-2 bg-white border-2 border-[#D4A574]/30 text-[#6B5744] rounded-lg font-medium focus:outline-none focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300 cursor-pointer hover:border-[#8B6F47]"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i} value={i + 1}>
                    Page {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Pagination;