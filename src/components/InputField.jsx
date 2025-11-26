import { Eye, EyeOff } from "lucide-react";

/** 
 * @property {string} label - Label yang ditampilkan di atas input field.
 * @property {"text" | "email" | "password" | "number" | "date"} [type="text"] - Jenis input yang digunakan.
 * @property {string} name - Nama unik untuk input (biasanya digunakan dengan react-hook-form).
 * @property {string} [placeholder] - Placeholder teks di dalam input.
 * @property {JSX.Element} [icon] - Ikon di sisi kiri input.
 * @property {boolean} [showPassword] - Menentukan apakah password ditampilkan atau disembunyikan.
 * @property {() => void} [onTogglePassword] - Fungsi yang dijalankan saat tombol "show/hide password" ditekan.
 * @property {Function} [register] - Fungsi dari react-hook-form untuk mendaftarkan input.
 * @property {{ message?: string }} [error] - Objek error (biasanya dari validasi react-hook-form).
 * @property {any} [rest] - Properti tambahan yang diteruskan ke elemen input.
 */

const InputField = ({
  label,
  type = "text",
  name,
  placeholder,
  icon,
  showPassword,
  onTogglePassword,
  register,
  error,
  ...rest
}) => {
  return (
    <div>
      <label className="block text-base font-semibold text-[#0B132A] mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          {...(register ? register(name) : {})} 
          {...rest}
          className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm bg-white ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300"
          }`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default InputField;
