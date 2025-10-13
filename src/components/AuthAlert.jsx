import { CheckCircle, XCircle } from "lucide-react";

/**
 * 
 * @param {Object} props - Properti komponen.
 * @param {"success" | "error"} [props.type="success"] - Jenis alert yang akan ditampilkan.
 * @param {string} props.message - Pesan yang akan ditampilkan pada alert.
 * @returns {JSX.Element | null} Elemen alert, atau `null` jika tidak ada pesan.
 */

const AuthAlert = ({ type = "success", message }) => {
  if (!message) return null;

  const isSuccess = type === "success";

  const containerClass = isSuccess
    ? "text-green-700 bg-green-50 border border-green-200"
    : "text-red-700 bg-red-50 border border-red-200";

  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <div
      className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${containerClass}`}
    >
      <Icon
        className={`w-5 h-5 ${isSuccess ? "text-green-900" : "text-red-900"}`}
      />
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default AuthAlert;
