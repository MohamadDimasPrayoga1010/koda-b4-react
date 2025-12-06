import React, { useCallback, useEffect, useState } from "react";
import CoffeImg from "/images/ourcoffeder.jpeg";
import CardProduct from "../components/CardProduct";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";
import CardPromo from "../components/CardPromo";
import ProductFilter from "../components/ProductFilter";
import FilterIcon from "/images/Filter.png";
import { apiRequest } from "../utils/api";

const OurProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || null
  );
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get("sort") || null
  );
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 50000,
  ]);

  const [categoriesList, setCategoriesList] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedSort) params.set("sort", selectedSort);
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0]);
    if (priceRange[1] < 50000) params.set("maxPrice", priceRange[1]);
    setSearchParams(params);
  }, [
    searchInput,
    selectedCategory,
    selectedSort,
    priceRange,
    setSearchParams,
  ]);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const res = await apiRequest("/category", "GET");  
      if (res && res.success) {
        const sortedCategories = (res.data || []).sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        setCategoriesList(sortedCategories);
      } else {
        console.error("Failed to fetch categories:", res?.message);
        setCategoriesList([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoriesList([]);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const fetchProducts = useCallback(
    async (
      filters = {
        search: searchInput,
        category: selectedCategory,
        sort: selectedSort,
        priceRange,
      }
    ) => {
      setLoading(true);

      try {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", 50);
        if (filters.search) params.append("q", filters.search);
        if (filters.category) params.append("cat", filters.category);
        params.append("price_min", filters.priceRange?.[0] || 0);
        params.append("price_max", filters.priceRange?.[1] || 500000);
        if (filters.sort && filters.sort !== "") {
          params.append("sortby", filters.sort);
          params.append("order", "ASC");
        }

        let res;
        try {
          res = await apiRequest(`/products?${params.toString()}`, "GET");
        } catch (apiError) {
          console.error("API request failed:", apiError);
          setProducts([]);
          setLoading(false);
          return;
        }

        if (res.success) {
          setProducts(res.data || []);

          if (res.pagination?.totalPages) {
            setTotalPages(res.pagination.totalPages);
          }
        } else {
          console.error("Failed to fetch products:", res.message);
          setProducts([]);
        }
      } catch (err) {
        console.error("Unexpected error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [page, searchInput, selectedCategory, selectedSort, priceRange]
  );

  const handleSearch = (filters) => {
    setSearchInput(filters.search || "");
    setSelectedCategory(filters.category || null);
    setSelectedSort(filters.sort || null);
    setPriceRange(filters.priceRange || [0, 500000]);
    fetchProducts(filters);
    updateURL();
  };

  const handleResetFilter = () => {
    setSearchInput("");
    setSelectedCategory(null);
    setSelectedSort(null);
    setPriceRange([0, 500000]);
    setSearchParams({});
    fetchProducts({
      search: "",
      category: null,
      sort: null,
      priceRange: [0, 500000],
    });
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  if (loading && loadingCategories) {
    return (
      <div className="col-span-full flex items-center justify-center py-12 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <section className="relative mt-26 md:mt-0">
        <div className="hidden md:block relative">
          <img src={CoffeImg} alt="coffee" className="w-full" />
          <h1 className="absolute md:top-30 md:left-15 text-5xl text-white max-w-[880px]">
            We Provide Good Coffee and Healthy Meals
          </h1>
        </div>
      </section>

      <section className="md:hidden mx-12 relative flex items-center gap-3">
        <button onClick={() => setShowFilter(!showFilter)}>
          <img
            src={FilterIcon}
            alt="filter-icon"
            className="p-3.5 bg-orange-400 rounded"
          />
        </button>

        {showFilter && (
          <>
            <div
              className="fixed inset-0 bg-opacity-50 z-40"
              onClick={() => setShowFilter(false)}
            ></div>
            <div className="fixed top-0 right-0 h-full w-80 bg-black text-white z-50 shadow-lg">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold">Filter</h2>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-gray-300 hover:text-orange-400 transition"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto h-[calc(100%-4rem)] p-4">
                <ProductFilter
                  searchInput={searchInput}
                  onSearchSubmit={handleSearch}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedSort={selectedSort}
                  setSelectedSort={setSelectedSort}
                  priceMin={priceRange[0]}
                  priceMax={priceRange[1]}
                  setPriceRange={setPriceRange}
                  onReset={handleResetFilter}
                  categoriesList={categoriesList}
                  className="w-full bg-transparent text-white"
                />
              </div>
            </div>
          </>
        )}
      </section>

      <section className="my-6">
        <CardPromo />
      </section>

      <section className="my-8 mx-12">
        <h3 className="text-5xl mb-5">
          Our <span className="text-[#8E6447]">Product</span>
        </h3>

        <div className="flex gap-5 my-5">
          <ProductFilter
            searchInput={searchInput}
            onSearchSubmit={handleSearch}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            priceMin={priceRange[0]}
            priceMax={priceRange[1]}
            setPriceRange={setPriceRange}
            onReset={handleResetFilter}
            categoriesList={categoriesList}
            className="hidden md:flex p-8 w-sm md:h-full"
          />

          <div className="w-full">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : products.length > 0 ? (
              <Pagination
                data={products}
                itemsPerPage={6}
                gridCols="grid-cols-1 md:grid-cols-2"
                renderItem={(product) => (
                  <CardProduct key={product.id} product={product} />
                )}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-gray-600">
                <p className="text-lg font-medium">Data tidak tersedia</p>
                <p className="text-sm">
                  Coba ubah filter atau pencarian untuk melihat produk lain.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default OurProduct;