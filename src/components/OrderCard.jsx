import React from "react";
import { CalendarDays, Repeat, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Glass from "/images/glass.png";
import RepeatImg from "/images/repeat.png";

const OrderCard = ({ order }) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const getStatusStyle = (status) => {
    if (status === "On Progress") {
      return "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-200";
    } else if (status === "Sending Goods") {
      return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200";
    } else {
      return "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200";
    }
  };


  return (
    <div key={order.id} className="my-4 flex flex-col sm:flex-row gap-4 group animate-fadeIn">
      <div className="relative w-full sm:w-[111px] h-[200px] sm:h-[105px] flex-shrink-0 overflow-hidden rounded-xl shadow-lg border-2 border-white">
        <img
          src={order.image || "/images/coffeHazel4.jpg"}
          alt="order-img"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#654321]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="flex flex-col bg-gradient-to-br from-white to-[#faf8f5] p-4 sm:p-5 rounded-xl flex-1 shadow-lg border border-[#654321]/10 transform group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300">
        <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#8b6239] font-medium">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#654321]/10 to-[#8b6239]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <img src={Glass} alt="glass-icon" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span>No. Order</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-[#654321] ml-9 sm:ml-10 break-all">
              {order.invoiceNumber}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-2 text-xs sm:text-sm text-[#8b6239] font-medium">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#654321]/10 to-[#8b6239]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#654321]" />
              </div>
              <span>Date</span>
            </p>
            <span className="text-sm sm:text-base font-bold text-[#654321] ml-9 sm:ml-10">
              {orderDate}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-2 text-xs sm:text-sm text-[#8b6239] font-medium">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#654321]/10 to-[#8b6239]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#654321]" />
              </div>
              <span>Total</span>
            </p>
            <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-[#654321] to-[#8b6239] bg-clip-text text-transparent ml-9 sm:ml-10">
              IDR {Number(order.total).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex flex-col gap-1 items-start">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#8b6239] font-medium">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#654321]/10 to-[#8b6239]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <img src={RepeatImg} alt="repeat-icon" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span>Status</span>
            </div>
            <button
              className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-full text-xs font-bold shadow-sm border transform hover:scale-105 transition-all duration-200 ml-9 sm:ml-10 ${getStatusStyle(
                order.status
              )}`}
            >
              {order.status}
            </button>
          </div>
        </div>

        <Link
          to={`/order-detail/${order.id}`}
          className="flex items-center gap-2 bg-gradient-to-r from-[#654321] to-[#8b6239] bg-clip-text text-transparent text-xs sm:text-sm font-bold mt-3 sm:mt-4 pt-3 border-t border-[#654321]/10 group-hover:gap-3 transition-all duration-300"
        >
          <span>View Order Detail</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#654321] transform group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;