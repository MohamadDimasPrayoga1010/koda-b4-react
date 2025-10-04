import React, { useState } from "react";
import CoffeLogo from "/images/Frame.png";
import { Link, useLocation } from "react-router-dom";
import SearchIcon from "/images/Search.png";
import CartIcon from "/images/ShoppingCart.png";
import { X, Menu } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0B090921] py-5 px-6 md:px-16 lg:px-32">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-5">
            <img src={CoffeLogo} alt="coffe-logo" className="h-8 md:h-10" />
            <div className="hidden md:flex gap-8">
              <Link
                to="/"
                className={`text-white transition ${
                  isActive("/")
                    ? "border-b border-b-[#FF8906]"
                    : "hover:text-[#FF8906]"
                }`}
              >
                Home
              </Link>
              <Link
                to="/our-product"
                className={`text-white transition ${
                  isActive("/our-product")
                    ? "border-b border-b-[#FF8906]"
                    : "hover:text-[#FF8906]"
                }`}
              >
                Product
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link>
              <img src={SearchIcon} alt="search-icon" className="w-5 h-5" />
            </Link>
            <Link>
              <img src={CartIcon} alt="cart-icon" className="w-5 h-5" />
            </Link>
            <Link to="/login">
              <button className="py-3 px-4 border border-white text-white rounded hover:bg-white hover:text-black transition">
                SignIn
              </button>
            </Link>
            <Link to="/register">
              <button className="py-3 px-4 bg-[#FF8906] text-black rounded hover:bg-[#e67a05] transition">
                SignUp
              </button>
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-4">
            <Link>
              <img src={CartIcon} alt="cart-icon" className="w-6 h-6" />
            </Link>
            <button
              onClick={toggleMenu}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>
      </header>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleMenu}
          ></div>

          <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg md:hidden animate-slide-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <img src={CoffeLogo} alt="coffe-logo" className="h-8" />
                <button
                  onClick={toggleMenu}
                  className="text-gray-700 p-1"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Search Product
                </h3>
                <div className="relative">
                  <img
                    src={SearchIcon}
                    alt="search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  />
                  <input
                    type="text"
                    placeholder="Find Product"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#FF8906]"
                  />
                </div>
              </div>

              <div className="mb-6">
                <Link
                  to="/"
                  className={`block py-3 border-b border-gray-200 ${
                    isActive("/")
                      ? "text-[#FF8906] font-semibold"
                      : "text-gray-700"
                  }`}
                  onClick={toggleMenu}
                >
                  Home
                </Link>
                <Link
                  to="/our-product"
                  className={`block py-3 border-b border-gray-200 ${
                    isActive("/our-product")
                      ? "text-[#FF8906] font-semibold"
                      : "text-gray-700"
                  }`}
                  onClick={toggleMenu}
                >
                  Product
                </Link>
              </div>

              <div className="space-y-3 mt-auto absolute bottom-6 left-6 right-6">
                <Link to="/login" onClick={toggleMenu}>
                  <button className="w-full py-3 px-4 border border-[#FF8906] text-[#FF8906] rounded-lg font-medium hover:bg-[#FF8906] hover:text-white transition">
                    SignIn
                  </button>
                </Link>
                <Link to="/register" onClick={toggleMenu}>
                  <button className="w-full py-3 px-4 bg-[#FF8906] text-white rounded-lg font-medium hover:bg-[#e67a05] transition">
                    SignUp
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
