import React from "react";
import { Link } from "react-router-dom";
import CoffeIcon from "/images/logoweb.png";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-100 to-amber-50/30 py-12 px-6 md:px-16 lg:px-32 border-t border-amber-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src={CoffeIcon} alt="coffee-logo" className="h-8" />
          </div>
          <p className="text-gray-600 text-base leading-relaxed">
            Coffee Shop is a store that sells some good meals, and especially
            coffee. We provide high quality beans.
          </p>
          <p className="text-gray-400 text-xs font-medium">©2020CoffeeStore</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-4 text-lg">Product</h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/our-product"
                className="text-gray-600 text-base hover:text-[#8B4513] transition-colors duration-300 font-medium"
              >
                Our Product
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="text-gray-600 text-base hover:text-[#8B4513] transition-colors duration-300 font-medium"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/locations"
                className="text-gray-600 text-base hover:text-[#8B4513] transition-colors duration-300 font-medium"
              >
                Locations
              </Link>
            </li>
            <li>
              <Link
                to="/countries"
                className="text-gray-600 text-base hover:text-[#8B4513] transition-colors duration-300 font-medium"
              >
                Countries
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="text-gray-600 text-base hover:text-[#8B4513] transition-colors duration-300 font-medium"
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-4 text-lg">Engage</h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/partner"
                className="text-gray-600 text-base hover:text-[#8B4513] transition-colors duration-300 font-medium"
              >
                Partner
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="text-gray-600 text-base hover:text-[#8B4513] transition-colors duration-300 font-medium"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-gray-600 text-base hover:text-[#8B4513] transition-colors duration-300 font-medium"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-gray-600 text-base hover:text-[#8B4513] transition-colors duration-300 font-medium"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-gray-600 text-base hover:text-[#8B4513] transition-colors duration-300 font-medium"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-4 text-lg">Social Media</h4>
          <div className="flex gap-3">
            <Link
              to="#"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8B4513] to-[#654321] flex items-center justify-center hover:from-[#654321] hover:to-[#8B4513] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook size={20} className="text-white" />
            </Link>
            <Link
              to="#"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8B4513] to-[#654321] flex items-center justify-center hover:from-[#654321] hover:to-[#8B4513] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter size={20} className="text-white" />
            </Link>
            <Link
              to="#"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8B4513] to-[#654321] flex items-center justify-center hover:from-[#654321] hover:to-[#8B4513] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram size={20} className="text-white" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;