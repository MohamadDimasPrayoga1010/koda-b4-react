import React from "react";
import { Search } from "lucide-react";
import Button from "./Button";

/**
 * @typedef {Object} ProductFilterProps
 * @property {string} searchInput - Nilai teks pencarian saat ini.
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onSearchChange - Fungsi handler untuk menangani perubahan input pencarian.
 * @property {(e: React.FormEvent<HTMLFormElement>) => void} onSearchSubmit - Fungsi handler saat form pencarian disubmit.
 * @property {string} [className] - Kelas tambahan untuk styling komponen utama.
 */

const ProductFilter = ({
  searchInput,
  onSearchChange,
  onSearchSubmit,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-4 bg-black rounded-lg text-white ${className}`}>
      <form onSubmit={onSearchSubmit} className="flex flex-col">
        <label htmlFor="search" className="font-bold text-lg mb-2">
          Search
        </label>
        <div className="relative mb-4">
          <input
            type="search"
            name="search"
            id="search"
            value={searchInput}
            onChange={onSearchChange}
            className="bg-[#DEDEDE] h-10 pl-3 pr-10 text-[#696F79] w-full rounded"
            placeholder="Search your product.."
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#FF8906] transition"
          >
            <Search size={20} />
          </button>
        </div>

        <div>
          <h1 className="font-bold text-lg mb-2">Category</h1>
          {["Favorite Product", "Coffe", "Non Coffe", "Foods", "Add-On"].map(
            (item, i) => (
              <div key={i} className="flex items-center gap-3 my-1">
                <input
                  type="checkbox"
                  id={item}
                  name={item}
                  className="w-4 h-4 accent-orange-500"
                />
                <label htmlFor={item}>{item}</label>
              </div>
            )
          )}
        </div>

        <div>
          <h1 className="font-bold text-lg mb-2 mt-4">Sort By</h1>
          {["Buy1get1", "Flash Sale", "Birthday Package", "Cheap"].map(
            (item, i) => (
              <div key={i} className="flex items-center gap-3 my-1">
                <input
                  type="checkbox"
                  id={item}
                  name={item}
                  className="w-4 h-4 accent-orange-500"
                />
                <label htmlFor={item}>{item}</label>
              </div>
            )
          )}
        </div>

        <div className="mt-4">
          <h1 className="font-bold text-lg mb-2">Range Price</h1>
          <input type="range" className="w-full" />
        </div>

        <Button type="submit">Apply</Button>
      </form>
    </div>
  );
};

export default ProductFilter;
