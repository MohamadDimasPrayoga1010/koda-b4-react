import React from "react";
import { Search } from "lucide-react";
import Button from "./Button";

const ProductFilter = ({
  searchInput,
  onSearchChange,
  onSearchSubmit,
  onReset,
}) => {
  return (
    <div className="w-[383px] max-h-[900px] bg-black rounded p-5 hidden md:flex flex-col">
      <div className="text-white">
        <div className="flex justify-between mb-3">
          <p className="text-white font-semibold text-xl">Filter</p>
          <button
            onClick={onReset}
            className="text-white font-bold text-lg hover:text-[#FF8906] transition"
          >
            ResetFilter
          </button>
        </div>

        <form onSubmit={onSearchSubmit} className="flex flex-col">
          <label htmlFor="search" className="text-bold text-lg mb-3">
            Search
          </label>
          <div className="relative mb-4">
            <input
              type="search"
              name="search"
              id="search"
              value={searchInput}
              onChange={onSearchChange}
              className="bg-[#DEDEDE] h-10 pl-3 pr-10 text-[#696F79] w-full"
              placeholder="Search your product.."
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#FF8906] transition"
            >
              <Search size={20} />
            </button>
          </div>

          <div className="my-4">
            <h1 className="text-white font-bold text-lg">Category</h1>
          </div>
          {["Favorite Product", "Coffe", "Non Coffe", "Foods", "Add-On"].map(
            (item, i) => (
              <div key={i} className="flex items-center gap-4 my-2">
                <input
                  type="checkbox"
                  id={item}
                  name={item}
                  className="w-4 h-4 rounded-md border-gray-300 text-orange-500 focus:ring-0 accent-orange-500"
                />
                <label htmlFor={item} className="text-lg font-normal">
                  {item}
                </label>
              </div>
            )
          )}

          <div className="my-4">
            <h1 className="text-white font-bold text-lg">Sort By</h1>
          </div>
          {["Buy1get1", "Flash Sale", "Birthday Package", "Cheap"].map(
            (item, i) => (
              <div key={i} className="flex items-center gap-4 my-2">
                <input
                  type="checkbox"
                  id={item}
                  name={item}
                  className="w-4 h-4 rounded-md border-gray-300 text-orange-500 focus:ring-0 accent-orange-500"
                />
                <label htmlFor={item} className="text-lg font-normal">
                  {item}
                </label>
              </div>
            )
          )}

          <div>
            <h1 className="text-white font-bold text-lg">Range Price</h1>
          </div>
          <div className="my-5">
            <input type="range" className="w-full" />
          </div>

          <Button type="submit">Apply Filter</Button>
        </form>
      </div>
    </div>
  );
};

export default ProductFilter;
