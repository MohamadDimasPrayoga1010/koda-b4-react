import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, ShoppingBag } from "lucide-react";
import { apiRequest } from "../utils/api";
import AuthAlert from "./AuthAlert";
import { useSelector } from "react-redux";

const CartItems = ({ cartItemsProp, refreshCart }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const token = useSelector((state) => state.auth?.token);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        if (cartItemsProp && cartItemsProp.length > 0) {
          const transformed = cartItemsProp.map(item => ({
            ...item,
            name: item.name || item.title,
            quantity: item.quantity || 1,
            subtotal: item.subtotal || item.price * (item.quantity || 1),
          }));
          setCartItems(transformed);
        } else if (token) {
          const response = await apiRequest("/cart", "GET", null, token);
          if (!response || response.success === false) {
            setAlert({ type: "error", message: response?.message || "Failed to fetch cart" });
            setCartItems([]);
          } else {
            const items = Array.isArray(response.data.items) ? response.data.items : [];
            const transformed = items.map(item => ({
              ...item,
              name: item.name || item.title,
              quantity: item.quantity || 1,
              subtotal: item.subtotal || item.price * (item.quantity || 1),
            }));
            setCartItems(transformed);
          }
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Fetch cart error:", error);
        setAlert({ type: "error", message: "Failed to fetch cart" });
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [cartItemsProp, token]);

  const handleRemoveItem = async (id) => {
    try {
      const response = await apiRequest("/deletecart", "DELETE", { cart_id: id }, token);
      if (!response || response.success === false) {
        setAlert({ type: "error", message: response?.message || "Failed to remove item" });
      } else {
        setAlert({ type: "success", message: "Item removed successfully" });
        setCartItems((prev) =>
          prev.filter((item) => item.cartItemId !== id && item.id !== id)
        );

        if (typeof refreshCart === "function") {
          refreshCart();
        }
      }
    } catch (error) {
      console.error("Delete cart item error:", error);
      setAlert({ type: "error", message: "Failed to remove item" });
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#D4C5B0]">
      <div className="bg-gradient-to-r from-[#654321] to-[#7D5A32] p-5 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <ShoppingBag className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Your Order</h2>
          </div>
          <Link to="/our-product">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#654321] rounded-xl hover:bg-[#F5F0E8] transition-all transform hover:scale-105 font-semibold shadow-lg">
              <Plus size={20} />
              <span>Add Menu</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="p-6">
        {alert.message && (
          <div className="mb-4">
            <AuthAlert type={alert.type} message={alert.message} />
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D4C5B0] border-t-[#654321]"></div>
            <p className="text-[#8B7355] mt-4 font-medium">Loading cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-[#F5F0E8] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-[#8B7355]" size={48} />
            </div>
            <p className="text-[#8B7355] text-lg mb-6 font-medium">Your cart is empty</p>
            <Link to="/our-product">
              <button className="bg-[#654321] text-white px-8 py-3 rounded-xl hover:bg-[#7D5A32] transition-all transform hover:scale-105 font-semibold shadow-lg">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div
                  key={item.cartItemId || item.id}
                  className="relative flex gap-4 p-5 border-2 border-[#D4C5B0] rounded-xl hover:shadow-lg hover:border-[#8B7355] transition-all bg-gradient-to-r from-white to-[#FAF8F5]"
                >

                  <div className="absolute -top-3 -left-3 bg-[#654321] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>

                  {item?.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-xl flex-shrink-0 border-2 border-[#D4C5B0] shadow-md"
                    />
                  ) : (
                    <div className="w-28 h-28 md:w-36 md:h-36 bg-[#F5F0E8] flex items-center justify-center rounded-xl text-[#B8A590] border-2 border-[#D4C5B0] flex-shrink-0">
                      <ShoppingBag size={48} />
                    </div>
                  )}

                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-bold text-[#654321]">
                      {item.name || "Unknown Item"}
                    </h3>
     
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 bg-[#F5F0E8] text-[#654321] rounded-full text-sm font-semibold border border-[#D4C5B0]">
                        {item.quantity || 0} pcs
                      </span>
                      {item.size && (
                        <span className="inline-flex items-center px-3 py-1 bg-[#F5F0E8] text-[#654321] rounded-full text-sm font-semibold border border-[#D4C5B0]">
                          Size: {item.size}
                        </span>
                      )}
                      {item.variant && (
                        <span className="inline-flex items-center px-3 py-1 bg-[#F5F0E8] text-[#654321] rounded-full text-sm font-semibold border border-[#D4C5B0]">
                          {item.variant}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-[#654321] to-[#7D5A32] px-4 py-2 rounded-lg shadow-md">
                        <p className="text-lg font-bold text-white">
                          IDR {((item.subtotal !== undefined ? item.subtotal : item.price * (item.quantity || 1))).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.cartItemId || item.id)}
                    className="absolute top-4 right-4 flex-shrink-0 p-2 bg-red-50 hover:bg-red-100 rounded-full transition-all transform hover:scale-110 group"
                    title="Remove item"
                  >
                    <Trash2 className="text-red-500 group-hover:text-red-600" size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-[#D4C5B0] pt-6">
              <div className="bg-gradient-to-r from-[#F5F0E8] to-[#FAF8F5] rounded-xl p-6 border-2 border-[#D4C5B0] shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[#8B7355] font-medium mb-1 uppercase tracking-wide">Order Total</p>
                    <p className="text-3xl font-bold text-[#654321]">
                      IDR {totalPrice.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="bg-[#654321] p-4 rounded-full shadow-lg">
                    <ShoppingBag className="text-white" size={32} />
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-sm text-[#8B7355]">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">{cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartItems;