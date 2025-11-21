import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import Xcircle from "/images/XCircle.png";
import { apiRequest } from "../utils/api";
import AuthAlert from "./AuthAlert";
import { useSelector } from "react-redux";

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const token = useSelector((state) => state.auth?.token);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/cart", "GET", null, token);
      if (!response || response.success === false) {
        setAlert({ type: "error", message: response?.message || "Failed to fetch cart" });
        setCartItems([]);
      } else {
        setCartItems(Array.isArray(response.data.items) ? response.data.items : []);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
      setAlert({ type: "error", message: "Failed to fetch cart" });
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const response = await apiRequest("/deletecart", "DELETE", { cart_id: id }, token);
      if (!response || response.success === false) {
        setAlert({ type: "error", message: response?.message || "Failed to remove item" });
      } else {
        setAlert({ type: "success", message: "Item removed successfully" });
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Delete cart item error:", error);
      setAlert({ type: "error", message: "Failed to remove item" });
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  useEffect(() => {
    if (token) {
      fetchCartItems();
    }
  }, [token]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Your Order</h2>
        <Link to="/our-product">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#FF8906] text-white rounded-lg hover:bg-orange-600 transition-colors">
            <Plus size={18} />
            <span>Add Menu</span>
          </button>
        </Link>
      </div>

      {alert.message && <AuthAlert type={alert.type} message={alert.message} />}

      {loading ? (
        <p className="text-center py-12 text-gray-500">Loading cart...</p>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link to="/our-product">
            <button className="bg-[#FF8906] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
              Browse Products
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                {item?.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 flex items-center justify-center rounded-md text-gray-400">
                    No Image
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-bold text-gray-800">{item.title || "Unknown Item"}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span>{item.quantity || 0} pcs</span>
                    {item.size && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span>{item.size}</span>
                      </>
                    )}
                    {item.variant && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span>{item.variant}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {item.originalPrice && (
                      <p className="text-sm text-red-500 line-through">
                        IDR {item.originalPrice.toLocaleString("id-ID")}
                      </p>
                    )}
                    <p className="text-lg font-bold text-[#FF8906]">
                      IDR {(item.subtotal || 0).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-500 transition"
                >
                  <img src={Xcircle} alt="close-icon" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right font-bold text-xl">
            Total: IDR {totalPrice.toLocaleString("id-ID")}
          </div>
        </>
      )}
    </div>
  );
};

export default CartItems;
