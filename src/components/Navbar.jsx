import React, { useState, useEffect } from "react";
import CoffeLogo from "../../public/images/logoweb.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "/images/Search.png";
import CartIcon from "/images/ShoppingCart.png";
import { X, Menu, ChevronDown, LogOut, AlertCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction, setUser } from "../redux/reducer/auth";
import { apiRequest } from "../utils/api";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoggedIn, token } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoggedIn || !token) return;

      try {
        const res = await apiRequest("/profile", "GET", null, token);

        if (res.success) {
          const data = res.data;
          const avatarUrl = data.image
            ? data.image.startsWith("http")
              ? data.image
              : `${import.meta.env.VITE_API_URL}/${data.image}`
            : null;

          dispatch(
            setUser({
              ...data,
              avatar: avatarUrl,
              token,
            })
          );
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [isLoggedIn, token, dispatch]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

const handleLogoutConfirm = () => {
  dispatch(logoutAction());
  setShowLogoutModal(false);
  navigate("/login", { replace: true, state: {} });
};

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-[#1A0F0A]/95 backdrop-blur-md shadow-lg py-3" 
            : "bg-gradient-to-b from-[#1A0F0A]/90 to-transparent py-5"
        } px-6 md:px-16 lg:px-32`}
      >
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-8">
            <img 
              src={CoffeLogo} 
              alt="coffe-logo" 
              className="h-9 md:h-11 drop-shadow-lg hover:scale-105 transition-transform duration-300" 
            />
            <div className="hidden md:flex gap-8 lg:gap-10">
              <Link
                to="/"
                className={`text-[#F5E6D3] font-medium transition-all duration-300 relative group ${
                  isActive("/") 
                    ? "text-[#D4A574]" 
                    : "hover:text-[#D4A574]"
                }`}
              >
                Home
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#D4A574] to-[#8B6F47] transition-all duration-300 ${
                  isActive("/") ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </Link>
              <Link
                to="/our-product"
                className={`text-[#F5E6D3] font-medium transition-all duration-300 relative group ${
                  isActive("/our-product") 
                    ? "text-[#D4A574]" 
                    : "hover:text-[#D4A574]"
                }`}
              >
                Product
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#D4A574] to-[#8B6F47] transition-all duration-300 ${
                  isActive("/our-product") ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </Link>
              {isLoggedIn && (
                <Link
                  to="/history-order"
                  className={`text-[#F5E6D3] font-medium transition-all duration-300 relative group ${
                    isActive("/history-order") 
                      ? "text-[#D4A574]" 
                      : "hover:text-[#D4A574]"
                  }`}
                >
                  History
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#D4A574] to-[#8B6F47] transition-all duration-300 ${
                    isActive("/history-order") ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-5 relative">
            <Link 
              to="/our-product"
              className="p-2 hover:bg-[#3D2817]/30 rounded-full transition-all duration-300 hover:scale-110"
            >
              <img src={SearchIcon} alt="search-icon" className="w-5 h-5" />
            </Link>
            <Link 
              to="/payment-details"
              className="p-2 hover:bg-[#3D2817]/30 rounded-full transition-all duration-300 hover:scale-110"
            >
              <img src={CartIcon} alt="cart-icon" className="w-5 h-5" />
            </Link>

            {!isLoggedIn ? (
              <div className="flex gap-3">
                <Link to="/login">
                  <button className="py-2.5 px-5 border-2 border-[#D4A574] text-[#F5E6D3] rounded-lg font-medium hover:bg-[#D4A574] hover:text-[#1A0F0A] transition-all duration-300 hover:shadow-lg hover:shadow-[#D4A574]/30">
                    SignIn
                  </button>
                </Link>
                <Link to="/register">
                  <button className="py-2.5 px-5 bg-gradient-to-r from-[#D4A574] to-[#8B6F47] text-white rounded-lg font-medium hover:from-[#8B6F47] hover:to-[#D4A574] transition-all duration-300 hover:shadow-lg hover:shadow-[#D4A574]/40 hover:scale-105">
                    SignUp
                  </button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 text-[#F5E6D3] hover:text-[#D4A574] transition-all duration-300 p-2 rounded-lg hover:bg-[#3D2817]/30"
                >
                  <img
                    src={
                      user?.image
                        ? user.image
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.fullname || "User"
                          )}&background=D4A574&color=fff`
                    }
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#D4A574] shadow-md"
                  />
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-[#2A1810] border border-[#D4A574]/20 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-3 text-[#F5E6D3] hover:bg-[#3D2817] transition-all duration-200 border-b border-[#D4A574]/10"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-3 text-[#F5E6D3] hover:bg-[#3D2817] transition-all duration-200 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-4">
            <Link 
              to="/payment-details"
              className="p-2 hover:bg-[#3D2817]/30 rounded-full transition-all duration-300"
            >
              <img src={CartIcon} alt="cart-icon" className="w-6 h-6" />
            </Link>
            <button 
              onClick={toggleMenu} 
              className="text-[#F5E6D3] p-2 hover:bg-[#3D2817]/30 rounded-lg transition-all duration-300" 
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={toggleMenu}
          ></div>

          <div className="fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-[#2A1810] to-[#1A0F0A] z-50 shadow-2xl md:hidden animate-slide-in">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D4A574]/20">
                <img src={CoffeLogo} alt="coffe-logo" className="h-9 drop-shadow-lg" />
                <button 
                  onClick={toggleMenu} 
                  className="text-[#F5E6D3] p-2 hover:bg-[#3D2817] rounded-lg transition-all duration-300" 
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#D4A574] mb-3 uppercase tracking-wider">
                  Search Product
                </h3>
                <form className="relative">
                  <img
                    src={SearchIcon}
                    alt="search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-60"
                  />
                  <input
                    type="text"
                    placeholder="Find Product"
                    className="w-full pl-10 pr-4 py-3 bg-[#3D2817] border border-[#D4A574]/30 rounded-lg text-sm text-[#F5E6D3] placeholder-[#8B7355] focus:outline-none focus:border-[#D4A574] focus:ring-2 focus:ring-[#D4A574]/20 transition-all duration-300"
                  />
                </form>
              </div>

              <div className="mb-6 space-y-1">
                <Link
                  to="/"
                  className={`block py-3 px-4 rounded-lg transition-all duration-300 ${
                    isActive("/") 
                      ? "bg-gradient-to-r from-[#D4A574]/20 to-transparent text-[#D4A574] font-semibold border-l-4 border-[#D4A574]" 
                      : "text-[#F5E6D3] hover:bg-[#3D2817] hover:text-[#D4A574]"
                  }`}
                  onClick={toggleMenu}
                >
                  Home
                </Link>
                <Link
                  to="/our-product"
                  className={`block py-3 px-4 rounded-lg transition-all duration-300 ${
                    isActive("/our-product") 
                      ? "bg-gradient-to-r from-[#D4A574]/20 to-transparent text-[#D4A574] font-semibold border-l-4 border-[#D4A574]" 
                      : "text-[#F5E6D3] hover:bg-[#3D2817] hover:text-[#D4A574]"
                  }`}
                  onClick={toggleMenu}
                >
                  Product
                </Link>
                {isLoggedIn && (
                  <Link
                    to="/history-order"
                    className={`block py-3 px-4 rounded-lg transition-all duration-300 ${
                      isActive("/history-order") 
                        ? "bg-gradient-to-r from-[#D4A574]/20 to-transparent text-[#D4A574] font-semibold border-l-4 border-[#D4A574]" 
                        : "text-[#F5E6D3] hover:bg-[#3D2817] hover:text-[#D4A574]"
                    }`}
                    onClick={toggleMenu}
                  >
                    History
                  </Link>
                )}
              </div>

              {!isLoggedIn ? (
                <div className="space-y-3 flex flex-col gap-2 mt-auto">
                  <Link to="/login" onClick={toggleMenu}>
                    <button className="w-full py-3 px-4 border-2 border-[#D4A574] text-[#D4A574] rounded-lg font-medium hover:bg-[#D4A574] hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#D4A574]/30">
                      SignIn
                    </button>
                  </Link>
                  <Link to="/register" onClick={toggleMenu}>
                    <button className="w-full py-3 px-4 bg-gradient-to-r from-[#D4A574] to-[#8B6F47] text-white rounded-lg font-medium hover:from-[#8B6F47] hover:to-[#D4A574] transition-all duration-300 hover:shadow-lg hover:shadow-[#D4A574]/40">
                      SignUp
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="mt-auto">
                  <div className="flex items-center gap-3 border-t border-[#D4A574]/20 pt-4 pb-4">
                    <img
                      src={
                        user?.image
                          ? user.image
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user?.fullname || "User"
                            )}&background=D4A574&color=fff`
                      }
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#D4A574] shadow-md"
                    />
                    <div>
                      <p className="text-[#F5E6D3] font-semibold">{user?.fullname || "User"}</p>
                      <p className="text-[#8B7355] text-sm">{user?.email || ""}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      onClick={toggleMenu}
                      className="block py-3 px-4 text-[#F5E6D3] hover:bg-[#3D2817] rounded-lg transition-all duration-300 hover:text-[#D4A574]"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left py-3 px-4 text-[#F5E6D3] hover:bg-[#3D2817] rounded-lg transition-all duration-300 hover:text-[#D4A574] flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {showLogoutModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in"
            onClick={handleLogoutCancel}
          >
            <div 
              className="bg-gradient-to-b from-[#2A1810] to-[#1A0F0A] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#D4A574]/20 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-[#D4A574]/10 rounded-full flex items-center justify-center">
                  <AlertCircle size={32} className="text-[#D4A574]" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-center text-[#F5E6D3] mb-2">
                Confirm Logout
              </h3>
              <p className="text-center text-[#8B7355] mb-6">
                Are you sure you want to logout from your account?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleLogoutCancel}
                  className="flex-1 py-3 px-4 border-2 border-[#D4A574]/50 text-[#F5E6D3] rounded-lg font-medium hover:bg-[#3D2817] hover:border-[#D4A574] transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-900/40 flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;