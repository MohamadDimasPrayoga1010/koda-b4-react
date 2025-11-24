import React from "react";

const Loading = ({ show, text = "Loading...", fullScreen = true }) => {
  if (!show) return null;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30">
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-orange-500"></div>
      <span>{text}</span>
    </div>
  );
};

export default Loading;
