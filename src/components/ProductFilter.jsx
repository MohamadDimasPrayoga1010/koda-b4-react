import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import Button from "./Button";

const ProductFilter = ({
  searchInput,
  onSearchSubmit,
  selectedCategory = null,
  setSelectedCategory,
  selectedSort = null,
  setSelectedSort,
  priceMin = 0,
  priceMax = 50000,
  setPriceRange,
  onReset,
  categoriesList = [],
  className = "",
}) => {
  const { register, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      search: searchInput || "",
      category: selectedCategory || "",
      sort: selectedSort || "",
      priceMin,
      priceMax,
    },
  });

  const watchedCategory = watch("category");
  const watchedSort = watch("sort");

  useEffect(() => {
    setValue("search", searchInput || "");
    setValue("category", selectedCategory || "");
    setValue("sort", selectedSort || "");
    setValue("priceMin", priceMin);
    setValue("priceMax", priceMax);
  }, [searchInput, selectedCategory, selectedSort, priceMin, priceMax, setValue]);

  const onSubmit = (data) => {
    const min = Number(data.priceMin) >= 0 ? Number(data.priceMin) : 0;
    const max = Number(data.priceMax) >= min ? Number(data.priceMax) : min;

    setSelectedCategory(data.category || null);
    setSelectedSort(data.sort || "");
    setPriceRange([min, max]);

    onSearchSubmit({
      search: data.search,
      category: data.category || null,
      sort: data.sort || "",
      priceRange: [min, max],
    });
  };

  const handleReset = () => {
    reset({
      search: "",
      category: "",
      sort: "",
      priceMin: 0,
      priceMax: 50000,
    });
    onReset();
  };

  const sortOptions = [
    { label: "Lowest starting price", sortby: "baseprice" }, 
  ];

  return (
    <div className={`flex flex-col gap-4 bg-gradient-to-br from-[#2C1810] to-[#1a0f0a] rounded-2xl text-white shadow-2xl border border-amber-900/30 p-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
          Filter
        </h1>
        <button
          type="button"
          className="text-base text-amber-400 hover:text-amber-300 transition-colors duration-300 cursor-pointer font-semibold"
          onClick={handleReset}
        >
          Reset Filter
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label className="font-bold text-lg mb-3 text-amber-100">Search</label>
        <div className="relative mb-6">
          <input
            type="search"
            {...register("search")}
            placeholder="Search your product.."
            className="bg-white/10 backdrop-blur-sm h-12 pl-4 pr-12 text-white placeholder:text-gray-400 w-full rounded-xl border border-amber-900/30 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700/50 transition-all duration-300"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-300 transition-colors duration-300 hover:scale-110"
          >
            <Search size={22} />
          </button>
        </div>

        <div className="mb-6">
          <h1 className="font-bold text-lg mb-3 text-amber-100">Category</h1>
          <div className="space-y-2">
            {categoriesList.length > 0 ? (
              categoriesList.map((cat) => (
                <div 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-200 cursor-pointer" 
                  key={cat.id}
                >
                  <input
                    type="checkbox"
                    value={cat.id}
                    checked={watchedCategory == cat.id}
                    onChange={() =>
                      setValue("category", watchedCategory == cat.id ? "" : cat.id)
                    }
                    className="w-5 h-5 accent-amber-700 cursor-pointer rounded border-amber-900"
                  />
                  <label className="text-gray-200 cursor-pointer flex-1 font-medium">
                    {cat.name}
                  </label>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                <p className="text-sm">No categories available</p>
                <p className="text-xs mt-1">Categories will appear here once added</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h1 className="font-bold text-lg mb-3 text-amber-100">Sort By</h1>
          <div className="space-y-2">
            {sortOptions.map((sort) => (
              <div 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-200 cursor-pointer" 
                key={sort.label}
              >
                <input
                  type="checkbox"
                  value={sort.label}
                  checked={watchedSort === sort.sortby}
                  onChange={() =>
                    setValue("sort", watchedSort === sort.sortby ? "" : sort.sortby)
                  }
                  className="w-5 h-5 accent-amber-700 cursor-pointer rounded border-amber-900"
                />
                <label className="text-gray-200 cursor-pointer flex-1 font-medium">
                  {sort.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="font-bold text-lg mb-3 text-amber-100">Price Range</h1>
          <div className="flex gap-3">
            <input
              type="number"
              {...register("priceMin")}
              min={0}
              className="w-1/2 p-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-amber-900/30 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700/50 transition-all duration-300 placeholder:text-gray-400"
              placeholder="Min"
            />
            <input
              type="number"
              {...register("priceMax")}
              min={0}
              className="w-1/2 p-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-amber-900/30 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700/50 transition-all duration-300 placeholder:text-gray-400"
              placeholder="Max"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-[#8B4513] to-[#654321] hover:from-[#654321] hover:to-[#8B4513] text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-900/30 hover:shadow-xl hover:shadow-amber-900/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full"
          >
            Apply Filter
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductFilter;