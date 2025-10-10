import React, { useEffect, useState } from "react";
import CoffeImg from "/images/ourproduct.png";
import { MoveLeft, MoveRight, Search } from "lucide-react";
import { ourProductCard } from "../../public/data/products";
import CardPromo from "../components/CardPromo";
import Button from "../components/Button";
import { useSearchParams } from "react-router-dom";
import CardProduct from "../components/CardProduct";

const OurProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
   const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ search: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleResetFilter = () => {
    setSearchInput("");
    setSearchParams({});
  };

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

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = products.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  return (
    <main>
      <section className="relative mt-15 md:mt-0">
        <div className="hidden md:block">
          <img src={CoffeImg} alt="coffe-image" className="w-full" />
          <h1 className="absolute md:top-30 md:left-15 text-5xl text-white max-w-[880px]">
            We Provide Good Coffee and Healthy Meals
          </h1>
        </div>
      </section>

      <section className="my-6 mx-12">
        <div className="flex justify-between items-center">
          <h3 className="text-5xl font-medium">
            Today <span className="text-[#8E6447]">Promo</span>
          </h3>
          <div className="flex gap-2 items-center">
            <button className="bg-[#E8E8E8] p-3 rounded-full">
              <MoveLeft className="w-4 h-4" />
            </button>
            <button className="bg-[#FF8906] p-3 rounded-full">
              <MoveRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 my-5">
          {ourProductCard.map((product) => (
            <CardPromo
              key={product.id}
              image={product.image}
              title={product.title}
              description={product.description}
              ticket={product.ticket}
            />
          ))}
        </div>
      </section>

      <section className="my-8 mx-12">
        <h3 className="text-5xl">
          Our <span className="text-[#8E6447]">Product</span>
        </h3>
        <div className="flex gap-5 my-5">
          <div className="w-[383px] max-h-[900px] bg-black rounded p-5 hidden md:flex flex-col">
            <div className="text-white">
              <div className="flex justify-between mb-3">
                <p className="text-white font-semibold text-xl">Filter</p>
                <button
                  onClick={handleResetFilter}
                  className="text-white font-bold text-lg hover:text-[#FF8906] transition"
                >
                  ResetFilter
                </button>
              </div>
              <div>
                <form onSubmit={handleSearch} className="flex flex-col">
                  <label htmlFor="search" className="text-bold text-lg mb-3">
                    Search
                  </label>
                  <div className="relative mb-4">
                    <input
                      type="search"
                      name="search"
                      id="search"
                      value={searchInput}
                      onChange={handleSearchChange}
                      className="bg-[#DEDEDE] h-10 pl-3 pr-10 text-[#696F79] w-full"
                      autoComplete="off"
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
                  <div className="flex items-center gap-4 my-2">
                    <input
                      type="checkbox"
                      id="favproduct"
                      name="favproduct"
                      className="w-4 h-4 rounded-md border-gray-300 text-orange-500 focus:ring-0 accent-orange-500"
                    />
                    <label htmlFor="favproduct" className="text-lg font-normal">
                      Favorite Product
                    </label>
                  </div>
                  <div className="flex items-center gap-4 my-2">
                    <input
                      type="checkbox"
                      id="coffe"
                      name="coffe"
                      className="w-4 h-4 rounded-md border-gray-300 text-orange-500 focus:ring-0 accent-orange-500"
                    />
                    <label htmlFor="coffe" className="text-lg font-normal">
                      Coffe
                    </label>
                  </div>
                  <div className="flex items-center gap-4 my-2">
                    <input
                      type="checkbox"
                      id="noncoffe"
                      name="noncoffe"
                      className="w-4 h-4 rounded-md border-gray-300 text-orange-500 focus:ring-0 accent-orange-500"
                    />
                    <label htmlFor="noncoffe" className="text-lg font-normal">
                      Non Coffe
                    </label>
                  </div>
                  <div className="flex items-center gap-4 my-2">
                    <input
                      type="checkbox"
                      id="food"
                      name="food"
                      className="w-4 h-4 rounded-md border-gray-300 text-orange-500 focus:ring-0 accent-orange-500"
                    />
                    <label htmlFor="food" className="text-lg font-normal">
                      Foods
                    </label>
                  </div>
                  <div className="flex items-center gap-4 my-2">
                    <input
                      type="checkbox"
                      id="addon"
                      name="addon"
                      className="w-4 h-4 rounded-md border-gray-300 text-orange-500 focus:ring-0 accent-orange-500"
                    />
                    <label htmlFor="addon" className="text-lg font-normal">
                      Add-On
                    </label>
                  </div>

                  <div className="my-4">
                    <h1 className="text-white font-bold text-lg">Sort By</h1>
                  </div>
                  <div className="flex items-center gap-4 my-2">
                    <input
                      type="checkbox"
                      id="buy1get1"
                      name="buy1get1"
                      className="w-4 h-4 rounded-md border-gray-300 text-orange-500 focus:ring-0 accent-orange-500"
                    />
                    <label htmlFor="buy1get1" className="text-lg font-normal">
                      Buy1get1
                    </label>
                  </div>
                  <div className="flex items-center gap-4 my-2">
                    <input
                      type="checkbox"
                      id="flashsale"
                      name="flashsale"
                      className="w-4 h-4 rounded-md border-gray-300 text-orange-500 focus:ring-0 accent-orange-500"
                    />
                    <label htmlFor="flashsale" className="text-lg font-normal">
                      Flash sale
                    </label>
                  </div>
                  <div className="flex items-center gap-4 my-2">
                    <input
                      type="checkbox"
                      id="birthdaypackage"
                      name="birthdaypackage"
                      className="w-4 h-4 rounded-md border-gray-300 text-orange-500 focus:ring-0 accent-orange-500"
                    />
                    <label
                      htmlFor="birthdaypackage"
                      className="text-lg font-normal"
                    >
                      Birthday Package
                    </label>
                  </div>
                  <div className="flex items-center gap-4 my-2">
                    <input
                      type="checkbox"
                      id="Cheap"
                      name="Cheap"
                      className="w-4 h-4 rounded-md border-gray-300 text-orange-500 focus:ring-0 accent-orange-500"
                    />
                    <label htmlFor="Cheap" className="text-lg font-normal">
                      Cheap
                    </label>
                  </div>
                  <div className="flex items-center gap-4 my-2">
                    <input
                      type="checkbox"
                      id="addon2"
                      name="addon2"
                      className="w-4 h-4 rounded-md border-gray-300 text-orange-500 focus:ring-0 accent-orange-500"
                    />
                    <label htmlFor="addon2" className="text-lg font-normal">
                      Add-On
                    </label>
                  </div>

                  <div>
                    <h1 className="text-white font-bold text-lg">
                      Range Price
                    </h1>
                  </div>
                  <div className="my-5">
                    <input type="range" className="w-full" />
                  </div>

                  <Button type="submit">Apply Filter</Button>
                </form>
              </div>
            </div>
          </div>
          <div className=" w-full gap-5 grid grid-cols-2">
            {currentProducts.map((product) => (
              <CardProduct key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          {/* Prev */}
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition ${
              currentPage === 1
                ? "bg-[#E8E8E8] text-[#A0A3BD] cursor-not-allowed opacity-50"
                : "bg-[#FF8906] text-white hover:bg-[#e67a00]"
            }`}
          >
            <MoveLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition ${
                currentPage === page
                  ? "bg-[#FF8906] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-[#FF8906]"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
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
      </section>
    </main>
  );
};

export default OurProduct;
