import React, { useState } from "react";
import { X, Send, MessageCircleMore } from "lucide-react";
import ChatImge from "/images/Ellipse.png"

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-t-[#FF8906]">
          <div className=" p-4 flex items-center justify-between">
            <div>
              <h3 className="text-gray-800 font-bold text-lg">Maria Angela</h3>
              <p className="#FF8906 text-sm font-medium">Admin Support</p>
            </div>
            <button
              onClick={toggleChat}
              className="text-gray-800 hover:bg-orange-600 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-72 overflow-y-auto p-4 bg-gray-50">
            <div className="mb-4 flex items-start gap-2">
              <div className="w-8 h-8 rounded-full flex-shrink-0"><img src={ChatImge} alt="profile" /></div>
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[75%]">
                <p className="text-sm text-gray-700">
                  Halo, Ada yang bisa kami bantu?
                </p>
              </div>
            </div>
            <div className="mb-4 flex justify-end">
              <div className="bg-gray-200 rounded-lg rounded-tr-none p-3 max-w-[75%]">
                <p className="text-sm text-gray-700">
                  Saya kesulitan mencari kopi
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white border-t">
            <form className="flex gap-2 items-center bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Masukan Pesan Anda"
                className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 placeholder-gray-400"
              />
              <button className="bg-[#FF8906] hover:bg-orange-600 text-white rounded p-2 transition-colors flex-shrink-0">
                <Send className="w-5 h-5 text-black"/>
              </button>
            </form>
          </div>
        </div>
      )}
      <button
        onClick={toggleChat}
        className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircleMore />}
      </button>
    </div>
  );
};

export default ChatWidget;
