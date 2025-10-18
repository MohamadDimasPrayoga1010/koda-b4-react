import React from "react";
import { Link } from "react-router-dom";
import { Plus, X } from "lucide-react";
import Xcircle from "/images/XCircle.png";

/**
 * @typedef {Object} CartItem
 * @property {string|number} cartItemId - ID unik untuk item dalam keranjang.
 * @property {string} name - Nama produk.
 * @property {string} [image] - URL gambar produk.
 * @property {number} price - Harga satuan produk.
 * @property {number} quantity - Jumlah item yang dibeli.
 * @property {number} [originalPrice] - Harga sebelum diskon (jika ada).
 * @property {string} [size] - Ukuran produk (misalnya: "Medium", "Large").
 * @property {string} [temperature] - Suhu penyajian (misalnya: "Hot", "Ice").
 * @property {string} [delivery] - Metode pengiriman.
 * @property {boolean} [isFlashSale] - Menandakan apakah item termasuk promo flash sale.
 */

const CartItems = ({ cartItems = [], onRemoveItem, validationErrors }) => {
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

      {validationErrors?.cart && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {validationErrors.cart}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link to="/our-product">
            <button className="bg-[#FF8906] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
              Browse Products
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.cartItemId}
              className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              {item?.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 flex items-center justify-center rounded-md text-gray-400">
                  No Image
                </div>
              )}

              <div className="flex-1 space-y-2">
                {item?.isFlashSale && (
                  <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                    FLASHSALE!
                  </span>
                )}
                <h3 className="text-lg font-bold text-gray-800">
                  {item?.name || "Unknown Item"}
                </h3>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span>{item?.quantity || 0}pcs</span>
                  {item?.size && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>{item.size}</span>
                    </>
                  )}
                  {item?.temperature && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>{item.temperature}</span>
                    </>
                  )}
                  {item?.delivery && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>{item.delivery}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {item?.isFlashSale && item?.originalPrice && (
                    <p className="text-sm text-red-500 line-through">
                      IDR {item.originalPrice.toLocaleString("id-ID")}
                    </p>
                  )}
                  <p className="text-lg font-bold text-[#FF8906]">
                    IDR{" "}
                    {(item?.isFlashSale
                      ? item?.price * item?.quantity
                      : item?.originalPrice * item?.quantity ||
                        item?.price * item?.quantity ||
                        0
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onRemoveItem(item.cartItemId)}
                className="flex-shrink-0 text-gray-400 hover:text-red-500 transition"
              >
                <img src={Xcircle} alt="close-icon" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartItems;
