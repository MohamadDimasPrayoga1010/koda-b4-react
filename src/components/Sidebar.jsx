import { NavLink } from "react-router-dom";
import { Handbag, Users } from "lucide-react";
import DashboardIcon from "/images/dashboard.png";
import ProductIcon from "/images/glass.png";
import ExitIcon from "/images/Icon.png";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <img src={DashboardIcon} alt="icon" className="w-5 h-5" />,
      path: "/dashboard",
    },
    {
      name: "Product",
      icon: <img src={ProductIcon} alt="icon" className="w-5 h-5" />,
      path: "/product-list",
    },
    { name: "Order", icon: <Handbag className="w-5 h-5" />, path: "/order-list" },
    { name: "User", icon: <Users className="w-5 h-5" />, path: "/user-list" },
    {
      name: "Keluar",
      icon: <img src={ExitIcon} alt="icon" className="w-5 h-5" />,
      path: "/login",
    },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-white to-[#FAF8F5] border-r my-20 border-[#D4A574]/20 h-full shadow-lg">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {menuItems.map((item, idx) => (
            <li key={idx}>
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
  );
};

export default Sidebar;