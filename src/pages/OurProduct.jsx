import React from "react";
import CoffeImg from "/images/ourproduct.png";
import { MoveLeft, MoveRight } from "lucide-react";
import { ourProductCard } from "../../public/data/products";
import CardPromo from "../components/CardPromo";
import Button from "../components/Button";
import CardProductStock from "../components/CardProductStock";

const OurProduct = () => {
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-5 ">
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
        <div className="flex my-5">
          <div className="w-[383px] max-h-[900px] bg-black rounded p-5 hidden md:flex flex-col ">
            <div className="text-white">
              <div className="flex justify-between mb-3">
                <p className="text-white font-semibold text-xl">Filter</p>
                <p className="text-white font-bold text-lg">ResetFilter</p>
              </div>
              <div>
                <form className="flex flex-col">
                  <label htmlFor="search" className="text-bold text-lg mb-3">
                    Search
                  </label>
                  <input
                    type="search"
                    name="search"
                    id="search"
                    className="bg-[#DEDEDE] h-10 pl-3 text-[#696F79]"
                    autoComplete="off"
                    placeholder="Search your product.."
                  />

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
                      id="addon"
                      name="addon"
                      className="w-4 h-4 rounded-md border-gray-300 text-orange-500 focus:ring-0 accent-orange-500"
                    />
                    <label htmlFor="addon" className="text-lg font-normal">
                      Add-On
                    </label>
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-lg">
                      Range Price
                    </h1>
                  </div>
                  <div className="my-5">
                    <input type="range" />
                  </div>
                  <Button>Apply Filter</Button>
                </form>
              </div>
            </div>
          </div>
          <div className="w-full">
            <CardProductStock />
          </div>
        </div>
        <div className="flex gap-3 justify-center items-center">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF8906] text-white font-medium">
            1
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8E8E8] text-[##A0A3BD] font-medium">
            2
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8E8E8] text-[##A0A3BD] font-medium">
            3
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8E8E8] text-[##A0A3BD] font-medium">
            4
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF8906] text-white font-medium">
            <MoveRight />
          </button>
        </div>
      </section>
    </main>
  );
};

export default OurProduct;
