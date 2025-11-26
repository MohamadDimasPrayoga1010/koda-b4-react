
import CoffeLogo from "/images/logoweb.png";
import { Link} from "react-router-dom";
import SearchIcon from "/images/Search.png";
import CartIcon from "/images/ShoppingCart.png";
import { X, Menu, Search, ShoppingCart, ChevronDown } from "lucide-react";
import profile from "/images/coffeHazel4.jpg";

const NavbarAdmin = () => {
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50  bg-[#E8E8E8]/80  py-5 px-6 md:px-16 ">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-5">
            <img src={CoffeLogo} alt="coffe-logo" className="h-8 md:h-10" />
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link>
              <Search className="w-5 h-5" />
            </Link>
            <Link>
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <Link to="/dashboard">
              <img
                src={profile}
                alt="profile-img"
                className="w-9 h-9 object-cover rounded-full"
              />
            </Link>
            <Link to="">
              <ChevronDown className="w-5 h-5 text-[#4F5665]" />
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default NavbarAdmin;
