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
  selectedCategories = [],
  setSelectedCategories,
  selectedSorts = [],
  setSelectedSorts,
  priceRange = [0, 50000],
  setPriceRange,
  onReset,
  className = "",
}) => {
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSortChange = (sort) => {
    if (selectedSorts.includes(sort)) {
      setSelectedSorts(selectedSorts.filter((s) => s !== sort));
    } else {
      setSelectedSorts([...selectedSorts, sort]);
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 bg-black rounded-lg text-white ${className}`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Filter</h1>
        <button
          type="button"
          className="text-lg text-orange-400 hover:text-orange-300 transition cursor-pointer"
          onClick={onReset}
        >
          Reset Filter
        </button>
      </div>

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

          <div className="flex items-center gap-3 my-1">
            <input
              type="checkbox"
              id="Favorite Product"
              checked={selectedCategories.includes("Favorite Product")}
              onChange={() => handleCategoryChange("Favorite Product")}
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="Favorite Product">Favorite Product</label>
          </div>

          <div className="flex items-center gap-3 my-1">
            <input
              type="checkbox"
              id="Coffe"
              checked={selectedCategories.includes("Coffe")}
              onChange={() => handleCategoryChange("Coffe")}
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="Coffe">Coffe</label>
          </div>

          <div className="flex items-center gap-3 my-1">
            <input
              type="checkbox"
              id="Non Coffe"
              checked={selectedCategories.includes("Non Coffe")}
              onChange={() => handleCategoryChange("Non Coffe")}
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="Non Coffe">Non Coffe</label>
          </div>

          <div className="flex items-center gap-3 my-1">
            <input
              type="checkbox"
              id="Foods"
              checked={selectedCategories.includes("Foods")}
              onChange={() => handleCategoryChange("Foods")}
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="Foods">Foods</label>
          </div>

          <div className="flex items-center gap-3 my-1">
            <input
              type="checkbox"
              id="Add-On"
              checked={selectedCategories.includes("Add-On")}
              onChange={() => handleCategoryChange("Add-On")}
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="Add-On">Add-On</label>
          </div>
        </div>

        <div>
          <h1 className="font-bold text-lg mb-2 mt-4">Sort By</h1>

          <div className="flex items-center gap-3 my-1">
            <input
              type="checkbox"
              id="Buy1get1"
              checked={selectedSorts.includes("Buy1get1")}
              onChange={() => handleSortChange("Buy1get1")}
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="Buy1get1">Buy1get1</label>
          </div>

          <div className="flex items-center gap-3 my-1">
            <input
              type="checkbox"
              id="Flash Sale"
              checked={selectedSorts.includes("Flash Sale")}
              onChange={() => handleSortChange("Flash Sale")}
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="Flash Sale">Flash Sale</label>
          </div>

          <div className="flex items-center gap-3 my-1">
            <input
              type="checkbox"
              id="Birthday Package"
              checked={selectedSorts.includes("Birthday Package")}
              onChange={() => handleSortChange("Birthday Package")}
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="Birthday Package">Birthday Package</label>
          </div>

          <div className="flex items-center gap-3 my-1">
            <input
              type="checkbox"
              id="Cheap"
              checked={selectedSorts.includes("Cheap")}
              onChange={() => handleSortChange("Cheap")}
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="Cheap">Cheap</label>
          </div>
        </div>

        <div className="mt-4">
          <h1 className="font-bold text-lg mb-2">Range Price</h1>
          <input
            type="range"
            min="0"
            max="50000"
            step="5000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-full accent-orange-500"
          />
          <p className="text-sm mt-2">
            Rp{priceRange[0].toLocaleString()} - Rp
            {priceRange[1].toLocaleString()}
          </p>
        </div>

        <Button type="submit" className="mt-4">
          Apply
        </Button>
      </form>
    </div>
  );
};

export default ProductFilter;
