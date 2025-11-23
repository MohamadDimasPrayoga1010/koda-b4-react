import { useEffect, useState } from "react";
import { X } from "lucide-react";


const ConfirmAlert = ({ message, onConfirm, onCancel, duration }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      setVisible(false);
      if (onCancel) onCancel();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onCancel]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[320px] relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => { setVisible(false); onCancel?.(); }}
        >
          <X className="w-5 h-5" />
        </button>
        <p className="mb-4 font-medium">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => { setVisible(false); onCancel?.(); }}
          >
            No
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => { setVisible(false); onConfirm?.(); }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
