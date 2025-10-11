import React, { useEffect, useState } from "react";
import CoffeImg from "/images/ourproduct.png";
import CardProduct from "../components/CardProduct";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";
import CardPromo from "../components/CardPromo";
import ProductFilter from "../components/ProductFilter";

const OurProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/data/stockProduct.json");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ search: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleResetFilter = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchInput.toLowerCase())
  );

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
      <section className="relative mt-15 md:mt-0">
        <div className="hidden md:block relative">
          <img src={CoffeImg} alt="coffee" className="w-full" />
          <h1 className="absolute md:top-30 md:left-15 text-5xl text-white max-w-[880px]">
            We Provide Good Coffee and Healthy Meals
          </h1>
        </div>
      </section>

      <section className="my-6 mx-12">
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
            onReset={handleResetFilter}
          />
          <div className="w-full">
            <Pagination
              data={filteredProducts}
              itemsPerPage={4}
              gridCols="grid-cols-2"
              renderItem={(product) => (
                <CardProduct key={product.id} product={product} />
              )}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default OurProduct;
