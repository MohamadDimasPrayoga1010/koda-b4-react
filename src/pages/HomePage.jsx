import React from "react";
import Button from "../components/Button";
import CoffeImg from "/images/Coffe.png";
import BaristaImg from "/images/people.png";
import CeklisImg from "/images/ceklis.png";
import { products } from "../../public/data/products";
import CardProduct from "../components/CardProduct";
import MapsImg from "/images/maps.png"
import Testing from "/images/profile.png"
import star from "/images/star.png"
import ChatWidget from "../components/ChatWidget";

const HomePage = () => {
  return (
    <main>
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="order-1 md:order-2 w-full h-full">
          <img
            src={CoffeImg}
            alt="coffee-img"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="order-2 md:order-1 flex items-center justify-center 
                bg-gradient-to-b from-[#777C82] to-[#0B0909] 
                text-center p-6 min-h-screen md:min-h-full"
        >
          <div className="max-w-4/5 flex flex-col justify-start text-left">
            <h1 className="text-3xl md:text-5xl font-medium text-white">
              Start Your Day with Coffee and Good Meals
            </h1>
            <p className="text-gray-200 mt-4 text-base font-normal">
              We provide high quality beans, good taste, and healthy meals made
              by love just for you. Start your day with us for a bigger smile!
            </p>
            <Button className="mt-6 max-w-32">Get Started</Button>
            <div className="grid grid-cols-3 mt-5 text-center divide-x divide-white">
              <div className="flex flex-col items-center justify-center px-4">
                <h1 className="text-2xl md:text-5xl font-semibold text-[#FF8906]">
                  90+
                </h1>
                <p className="mt-2 text-base font-normal text-white">Staff</p>
              </div>
              <div className="flex flex-col items-center justify-center px-4">
                <h1 className="text-2xl md:text-5xl font-semibold text-[#FF8906]">
                  30+
                </h1>
                <p className="mt-2 text-base font-normal text-white">Stores</p>
              </div>
              <div className="flex flex-col items-center justify-center px-4">
                <h1 className="text-2xl md:text-5xl font-semibold text-[#FF8906]">
                  800+
                </h1>
                <p className="mt-2 text-base font-normal text-white">
                  Customer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="order-3 md:order-4 w-full h-full">
          <img
            src={BaristaImg}
            alt="coffee-img"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="order-4 md:order-3  flex items-center justify-center 
                bg-white 
                text-center p-6 min-h-screen md:min-h-full"
        >
          <div className="max-w-4/5 md:order-3 flex flex-col justify-start text-left">
            <h1 className="text-3xl md:text-5xl font-semibold text-black leading-tight">
              We Provide <span className="text-[#6B4423]">Good</span>{" "}
              <span className="text-[#6B4423] border-l-4 border-[#FF8906] pl-2">
                Coffee
              </span>
              <span className="text-[#6B4423]">and Healthy Meals</span>
            </h1>
            <p className="text-[#4F5665] mt-4 text-base font-normal">
              You can explore the menu that we provide with fun and have their
              own taste and make your day better.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <img src={CeklisImg} alt="icon-ceklis" />
                </div>
                <p className="text-[#4F5665] text-sm text-normal">
                  High quality beans
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <img src={CeklisImg} alt="icon-ceklis" />
                </div>
                <p className="text-[#4F5665] text-sm text-normal">
                  Healthy meals, you can request the ingredients
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <img src={CeklisImg} alt="icon-ceklis" />
                </div>
                <p className="text-[#4F5665] text-sm text-normal">
                  Chat with our staff to get better experience for ordering
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <img src={CeklisImg} alt="icon-ceklis" />
                </div>
                <p className="text-[#4F5665] text-sm text-normal">
                  Free member card with a minimum purchase of IDR 200.000.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="my-9">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-3xl md:text-5xl text-center font-medium">
            Here is People's <span className="text-[#8E6447]">Favorite</span>
          </h1>
          <span className="border-b-3 w-15 border-[#FF8906]"></span>
          <p className="text-base mx-4 text-[#4F5665] font-normal">
            Let's choose and have a bit taste of poeple's favorite. It might be
            yours too!
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 mx-2 my-5 gap-6 md:mx-20 md:my-6">
          {products.map((product) => (
            <CardProduct
              key={product.id}
              image={product.image}
              title={product.title}
              description={product.description}
              price={product.price}
              //   onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
        ;
      </section>

      <section className="mx-4 md:mx-20  relative">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-2xl text-center md:text-5xl font-medium">
            <span className="text-[#8E6447]">Visit Our Store</span> in the Spot
            on the Map Below
          </h1>
          <span className="border-b-3 w-15 border-[#FF8906]"></span>
          <p className="text-base text-center text-[#4F5665] font-normal max-w-[529px]">
            You can explore the menu that we provide with fun and have their own
            taste and make your day better.
          </p>
        </div>
        <img src={MapsImg} alt="maps-image" className="w-full" />
      </section>
      <section className=" bg-gradient-to-b from-[#777C82] to-[#0B0909] w-full min-h-[583px]">
        <div className="flex justify-center items-center min-h-screen">
          <div className="flex flex-col md:flex-row mx-3 md:mx-16 gap-6">
            <div>
              <img src={Testing} alt="profile-img" className="w-full" />
            </div>
            <div className="flex flex-col gap-6">
              <h1 className="text-lg font-normal text-white">Testimonial</h1>
              <h3 className="text-2xl md:text-5xl border-l font-medium border-[#FF8906] px-4 text-white">
                Viezh Robert
              </h3>
              <p className="text-base font-normal text-[#FF8906]">
                Manager Coffe Shop
              </p>
              <p className="max-w-[488px] text-base font-normal text-white">
                “Wow... I am very happy to spend my whole day here. the Wi-fi is
                good, and the coffee and meals tho. I like it here!! Very
                recommended!
              </p>
              <div className="flex gap-9">
                <img src={star} alt="icon-start" className="w-5 h-5" />
                <img src={star} alt="icon-start" className="w-5 h-5" />
                <img src={star} alt="icon-start" className="w-5 h-5" />
                <img src={star} alt="icon-start" className="w-5 h-5" />
                <img src={star} alt="icon-start" className="w-5 h-5" />
                <p className="text-white">5.0</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ChatWidget />
    </main>
  );
};

export default HomePage;
