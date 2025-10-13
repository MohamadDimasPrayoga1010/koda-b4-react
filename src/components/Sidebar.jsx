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
      path: "/logout",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r my-20 border-gray-200 h-full">
      <nav className="mt-8">
        <ul>
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg ${
                    isActive
                      ? "bg-[#FF8906]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
