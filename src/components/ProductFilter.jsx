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
    setSelectedSort(data.sort || null);
    setPriceRange([min, max]);

    onSearchSubmit({
      search: data.search,
      category: data.category || null,
      sort: data.sort || null,
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
    { name: "Buy1get1", sortby: "name", order: "ASC" },
    { name: "Flash Sale", sortby: "name", order: "ASC" },
    { name: "Birthday Package", sortby: "name", order: "ASC" },
    { name: "Cheap", sortby: "baseprice", order: "ASC" },
  ];

const displayCategories =
  categoriesList.length > 0
    ? categoriesList
    : [
        { id: 1, name: "Favorite Product" },
        { id: 2, name: "Coffe" },
        { id: 3, name: "Non Coffe" },
        { id: 4, name: "Foods" },
        { id: 5, name: "Add-On" },
      ];


  return (
    <div className={`flex flex-col gap-4 bg-black rounded-lg text-white ${className}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Filter</h1>
        <button
          type="button"
          className="text-lg text-orange-400 hover:text-orange-300 transition cursor-pointer"
          onClick={handleReset}
        >
          Reset Filter
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label className="font-bold text-lg mb-2">Search</label>
        <div className="relative mb-4">
          <input
            type="search"
            {...register("search")}
            placeholder="Search your product.."
            className="bg-[#DEDEDE] h-10 pl-3 pr-10 text-[#696F79] w-full rounded"
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
          {displayCategories.map((cat) => (
            <div className="flex items-center gap-3 my-1" key={cat.id}>
              <input
                type="checkbox"
                value={cat.id}
                checked={watchedCategory == cat.id}
                onChange={() =>
                  setValue("category", watchedCategory == cat.id ? "" : cat.id)
                }
                className="w-4 h-4 accent-orange-500"
              />
              <label>{cat.name}</label>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h1 className="font-bold text-lg mb-2">Sort By</h1>
          {sortOptions.map((sort) => (
            <div className="flex items-center gap-3 my-1" key={sort.name}>
              <input
                type="Checkbox"
                value={sort.name}
                checked={watchedSort === sort.name}
                onChange={() =>
                  setValue("sort", watchedSort === sort.name ? "" : sort.name)
                }
                className="w-4 h-4 accent-orange-500"
              />
              <label>{sort.name}</label>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h1 className="font-bold text-lg mb-2">Price Range</h1>
          <div className="flex gap-2">
            <input
              type="number"
              {...register("priceMin")}
              min={0}
              className="w-1/2 p-2 rounded bg-white text-black"
              placeholder="Min"
            />
            <input
              type="number"
              {...register("priceMax")}
              min={0}
              className="w-1/2 p-2 rounded bg-white text-black"
              placeholder="Max"
            />
          </div>
        </div>

        <Button type="submit" className="mt-4">
          Apply
        </Button>
      </form>
    </div>
  );
};

export default ProductFilter;
