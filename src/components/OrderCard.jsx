import React from "react";
import { CalendarDays, Repeat } from "lucide-react";
import { Link } from "react-router-dom";
import Glass from "/images/glass.png";
import RepeatImg from "/images/repeat.png";

const OrderCard = ({ order }) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div key={order.id} className="my-4 flex gap-3">
      <img
        src={order.image || "/images/coffeHazel4.jpg"}
        alt="order-img"
        className="w-[111px] h-[105px] object-cover rounded-md hidden md:flex"
      />

      <div className="flex flex-col bg-[#E8E8E84D] p-4 rounded-md flex-1">
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-base text-[#4F5665]">
              <img src={Glass} alt="glass-icon" className="w-5 h-5" />
              <span>No. Order</span>
            </div>
            <span className="text-base font-bold">{order.invoiceNumber}</span>
          </div>

          <div className="flex flex-col">
            <p className="flex items-center gap-2 text-base text-[#4F5665]">
              <CalendarDays className="w-5 h-5" />
              <span>Date</span>
            </p>
            <span className="text-base font-bold">{orderDate}</span>
          </div>

          <div className="flex flex-col">
            <p className="flex items-center gap-2 text-base text-[#4F5665]">
              <Repeat className="w-5 h-5" />
              <span>Total</span>
            </p>
            <span className="text-base font-bold">
              IDR {Math.round(order.total).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 text-base text-[#4F5665]">
              <img src={RepeatImg} alt="repeat-icon" className="w-5 h-5" />
              <span>Status</span>
            </div>
            <button
              className={`py-2 px-3 rounded-2xl ${
                order.status === "On Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.status === "Sending Goods"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              } font-semibold`}
            >
              {order.status}
            </button>
          </div>
        </div>

        <Link
          to={`/order-detail/${order.id}`}
          className="text-[#FF8906] text-sm font-semibold mt-3 hover:underline"
        >
          View Order Detail
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
