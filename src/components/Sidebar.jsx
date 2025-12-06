import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Handbag, Users, LogOut, AlertCircle, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../redux/reducer/auth";
import DashboardIcon from "/images/dashboard.png";
import ProductIcon from "/images/glass.png";

const Sidebar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <img src={DashboardIcon} alt="icon" className="w-5 h-5" />,
      path: "/dashboard",
      action: null,
    },
    {
      name: "Product",
      icon: <img src={ProductIcon} alt="icon" className="w-5 h-5" />,
      path: "/product-list",
      action: null,
    },
    { 
      name: "Order", 
      icon: <Handbag className="w-5 h-5" />, 
      path: "/order-list",
      action: null,
    },
    { 
      name: "User", 
      icon: <Users className="w-5 h-5" />, 
      path: "/user-list",
      action: null,
    },
    {
      name: "Keluar",
      icon: <LogOut className="w-5 h-5" />,
      path: null,
      action: "logout",
    },
  ];

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    dispatch(logoutAction());
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <aside className="w-72 bg-gradient-to-b from-white to-[#FAF8F5] border-r my-20 border-[#D4A574]/20 h-full shadow-lg">
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                {item.action === "logout" ? (
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center px-5 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden text-[#6B5744] hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-red-100/30 to-transparent"></div>
                    
                    <div className="relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      {item.icon}
                    </div>
                    
                    <span className="ml-4 font-semibold text-[15px] relative z-10 transition-all duration-300 group-hover:translate-x-1">
                      {item.name}
                    </span>
                    
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    end
                    className={({ isActive }) =>
                      `flex items-center px-5 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-[#D4A574] to-[#8B6F47] text-white shadow-lg shadow-[#D4A574]/30"
                          : "text-[#6B5744] hover:bg-gradient-to-r hover:from-[#F5E6D3] hover:to-[#FAF8F5] hover:text-[#8B6F47]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${!isActive ? 'bg-gradient-to-r from-transparent via-[#D4A574]/10 to-transparent' : ''}`}></div>
                        
                        <div className={`relative z-10 transition-all duration-300 ${
                          isActive 
                            ? "scale-110" 
                            : "group-hover:scale-110 group-hover:rotate-3"
                        }`}>
                          {item.icon}
                        </div>
                        
                        <span className={`ml-4 font-semibold text-[15px] relative z-10 transition-all duration-300 ${
                          isActive 
                            ? "" 
                            : "group-hover:translate-x-1"
                        }`}>
                          {item.name}
                        </span>
                        
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full shadow-md"></div>
                        )}
                        
                        {!isActive && (
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">
                            <svg className="w-4 h-4 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-12 pt-8 border-t border-[#D4A574]/20">
            <div className="bg-gradient-to-br from-[#F5E6D3] to-[#FAF8F5] rounded-xl p-4 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D4A574] to-[#8B6F47] rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6B5744]">Need Help?</p>
                  <p className="text-[10px] text-[#8B7355]">Contact Support</p>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {showLogoutModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
            onClick={handleLogoutCancel}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#D4A574] to-[#8B6F47] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <AlertCircle size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Confirm Logout
                  </h3>
                </div>
                <button
                  onClick={handleLogoutCancel}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-6">
                <p className="text-[#6B5744] text-center leading-relaxed mb-6">
                  Are you sure you want to logout from admin dashboard?
                  <br />
                  <span className="text-sm text-[#8B7355]">
                    You will be redirected to the login page.
                  </span>
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleLogoutCancel}
                    className="flex-1 py-3 px-4 border-2 border-[#D4A574]/50 text-[#6B5744] rounded-xl font-semibold hover:bg-[#F5E6D3] hover:border-[#D4A574] transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogoutConfirm}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-900/40 flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;