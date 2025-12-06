import { useState, useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

/**
 * 
 * @param {Object} props - Properti komponen.
 * @param {"success" | "error"} [props.type="success"] - Jenis alert yang akan ditampilkan.
 * @param {string} props.message - Pesan yang akan ditampilkan pada alert.
 * @param {number} [props.duration=5000] - Durasi alert dalam milidetik.
 * @param {Function} props.onClose - Callback ketika alert ditutup.
 * @returns {JSX.Element | null} Elemen alert, atau `null` jika tidak ada pesan.
 */
const AuthAlert = ({ type = "success", message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose, type]); 

  if (!message || !visible) return null;

  const isSuccess = type === "success";

  const containerClass = isSuccess
    ? "text-green-700 bg-green-50 border border-green-200"
    : "text-red-700 bg-red-50 border border-red-200";

  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <div className={`fixed top-5 right-5 z-[9999] shadow-lg p-4 rounded-lg flex items-start gap-3 animate-slide-in ${containerClass}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />

      <p className="font-medium max-w-xs">{message}</p>

      <button
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        className="ml-2 text-gray-700 hover:text-gray-900 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AuthAlert;