import React, { useCallback, useEffect, useState } from "react";
import CoffeImg from "/images/ourproduct.png";
import CardProduct from "../components/CardProduct";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";
import CardPromo from "../components/CardPromo";
import ProductFilter from "../components/ProductFilter";
import { Search } from "lucide-react";
import FilterIcon from "/images/Filter.png";

const OurProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category") ? searchParams.get("category").split(",") : []
  );
  const [selectedSorts, setSelectedSorts] = useState(
    searchParams.get("sort") ? searchParams.get("sort").split(",") : []
  );
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 50000,
  ]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/data/stockProduct.json");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    if (selectedCategories.length > 0)
      params.set("category", selectedCategories.join(","));
    if (selectedSorts.length > 0) params.set("sort", selectedSorts.join(","));
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0]);
    if (priceRange[1] < 50000) params.set("maxPrice", priceRange[1]);
    setSearchParams(params);
  }, [
    searchInput,
    selectedCategories,
    selectedSorts,
    priceRange,
    setSearchParams,
  ]);


  const handleSearch = (e) => {
    e.preventDefault();
    updateURL();
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleResetFilter = () => {
    setSearchInput("");
    setSelectedCategories([]);
    setSelectedSorts([]);
    setPriceRange([0, 50000]);
    setSearchParams({});
  };


  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchInput.toLowerCase());

    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category) ||
      (selectedCategories.includes("Coffe") && product.category === "Minuman");

    const matchSort =
      selectedSorts.length === 0 ||
      (selectedSorts.includes("Flash Sale") && product.isFlashSale) ||
      (selectedSorts.includes("Cheap") && product.price < 15000) ||
      (selectedSorts.includes("Buy1get1") &&
        product.name.toLowerCase().includes("hazelnut")) ||
      (selectedSorts.includes("Birthday Package") && product.price > 20000);

    const matchPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchSearch && matchCategory && matchSort && matchPrice;
  });

  useEffect(() => {
    updateURL();
  }, [updateURL]);

 
  if (loading) {
    return (
      <div className="col-span-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
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
        <form onSubmit={handleSearch} className="relative flex-1">
          <input
            type="search"
            placeholder="Find Product"
            name="search-menu"
            value={searchInput}
            onChange={handleSearchChange}
            className="border border-gray-300 w-full pr-12 pl-10 py-2.5 rounded"
          />
          <button type="submit">
            <Search className="absolute top-3 left-3 text-gray-400" />
          </button>
        </form>

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
              className="fixed inset-0  bg-opacity-50 z-40"
              onClick={() => setShowFilter(false)}
            ></div>

            <div className="fixed top-0 right-0 h-full w-80 bg-black text-white z-50 shadow-lg transition-transform duration-300 ease-in-out">
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
                  onSearchChange={handleSearchChange}
                  onSearchSubmit={handleSearch}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedSorts={selectedSorts}
                  setSelectedSorts={setSelectedSorts}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  onReset={handleResetFilter}
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
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearch}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedSorts={selectedSorts}
            setSelectedSorts={setSelectedSorts}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onReset={handleResetFilter}
            className="hidden md:flex p-8 w-sm md:h-[700px]"
          />

          <div className="w-full">
            {filteredProducts.length > 0 ? (
              <Pagination
                data={filteredProducts}
                itemsPerPage={6}
                gridCols="grid-cols-1 md:grid-cols-2"
                renderItem={(product) => (
                  <CardProduct key={product.id} product={product} />
                )}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-gray-600">
                <p className="text-lg font-medium">❌ Data tidak tersedia</p>
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
