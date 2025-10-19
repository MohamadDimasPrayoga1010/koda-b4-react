import React, { useState, useContext } from "react";
import CoffeLogo from "/images/Frame.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "/images/Search.png";
import CartIcon from "/images/ShoppingCart.png";
import { X, Menu, ChevronDown } from "lucide-react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isLoggedIn, logout } = useContext(AuthContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0B0909]/80 py-5 px-6 md:px-16 lg:px-32">
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

          <div className="hidden md:flex items-center gap-4 relative">
            <Link to="/our-product">
              <img src={SearchIcon} alt="search-icon" className="w-5 h-5" />
            </Link>
            <Link to="/payment-details">
              <img src={CartIcon} alt="cart-icon" className="w-5 h-5" />
            </Link>

            {!isLoggedIn ? (
              <>
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
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 text-white hover:text-[#FF8906]"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.fullName || "User"
                    )}&background=FF8906&color=fff`}
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <ChevronDown size={18} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50">
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

     
          <div className="flex md:hidden items-center gap-4">
            <Link to="/payment-details">
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleMenu}
          ></div>

          <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg md:hidden animate-slide-in">
            <div className="p-6 flex flex-col h-full">
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

           
              {!isLoggedIn ? (
                <div className="space-y-3 flex flex-col gap-1 mt-auto">
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
              ) : (
                <div className="mt-auto">
                  <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.fullName || "User"
                      )}&background=FF8906&color=fff`}
                      alt="profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-gray-800 font-semibold">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Link
                      to="/profile"
                      onClick={toggleMenu}
                      className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
