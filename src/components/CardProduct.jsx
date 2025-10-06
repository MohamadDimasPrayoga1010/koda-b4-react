import { ShoppingCart } from "lucide-react";

/**
 *  @param {Object} props - Properti yang diteruskan ke komponen.
 * @param {string} props.image - URL atau path gambar produk.
 * @param {string} props.title - Nama atau judul produk.
 * @param {string} props.description - Deskripsi singkat produk.
 * @param {number} props.price - Harga produk dalam format angka (contoh: 40000).
 * @param {Function} props.onAddToCart - Fungsi yang dipanggil ketika tombol "Buy" diklik.
 * @returns 
 */
const CardProduct = ({ image, title, description, price, onAddToCart }) => {
  return (
    <div className="relative bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow w-full sm:w-[280px] md:w-[300px] min-h-[420px] mx-auto">
      <div className="w-full h-48 sm:h-52 md:h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[90%] sm:w-[90%] md:w-[262px] bg-white p-4 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        <div className="flex flex-col text-left">
          <span className="text-lg font-semibold text-[#FF8906] mb-2">
            IDR {price.toLocaleString("id-ID")}
          </span>

          <div className="flex justify-between gap-2">
            <button
              onClick={onAddToCart}
              className="w-full bg-[#FF8906] hover:bg-[#e67a05] text-white font-medium px-4 py-2 rounded-md transition-colors"
            >
              Buy
            </button>
            <button className="border border-[#FF8906] p-2 rounded-md hover:bg-[#FFF3E0] transition-colors">
              <ShoppingCart className="w-5 h-5 text-[#FF8906]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
