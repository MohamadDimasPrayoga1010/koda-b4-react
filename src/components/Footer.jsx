import React from "react";
import { Link } from "react-router-dom";
import CoffeIcon from "/images/CoffeLogo.png";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12 px-6 md:px-16 lg:px-32">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src={CoffeIcon} alt="coffee-logo" className="h-8" />
            {/* <h3 className="text-lg font-semibold text-gray-800">Coffee Shop</h3> */}
          </div>
          <p className="text-gray-500 text-base">
            Coffee Shop is a store that sells some good meals, and especially
            coffee. We provide high quality beans.
          </p>
          <p className="text-gray-400 text-xs">©2020CoffeeStore</p>
        </div>

        {/* Product Column */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4">Product</h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/our-product"
                className="text-gray-500 text-base hover:text-[#FF8906] transition"
              >
                Our Product
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="text-gray-500 text-base hover:text-[#FF8906] transition"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/locations"
                className="text-gray-500 text-base hover:text-[#FF8906] transition"
              >
                Locations
              </Link>
            </li>
            <li>
              <Link
                to="/countries"
                className="text-gray-500 text-base hover:text-[#FF8906] transition"
              >
                Countries
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="text-gray-500 text-base hover:text-[#FF8906] transition"
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Engage Column */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4">Engage</h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/partner"
                className="text-gray-500 text-base hover:text-[#FF8906] transition"
              >
                Partner
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="text-gray-500 text-base hover:text-[#FF8906] transition"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-gray-500 text-base hover:text-[#FF8906] transition"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-gray-500 text-base hover:text-[#FF8906] transition"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-gray-500 text-base hover:text-[#FF8906] transition"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media Column */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4">Social Media</h4>
          <div className="flex gap-3">
            <Link
              to="#"
              className="w-10 h-10 rounded-full bg-[#FF8906] flex items-center justify-center hover:bg-[#e67a05] transition"
              aria-label="Facebook"
            >
              <Facebook size={20} className="text-black" />
            </Link>
            <Link
              to="#"
              className="w-10 h-10 rounded-full bg-[#FF8906] flex items-center justify-center hover:bg-[#e67a05] transition"
              aria-label="Twitter"
            >
              <Twitter size={20} className="text-black" />
            </Link>
            <Link
              to="#"
              className="w-10 h-10 rounded-full bg-[#FF8906] flex items-center justify-center hover:bg-[#e67a05] transition"
              aria-label="Instagram"
            >
              <Instagram size={20} className="text-black" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
