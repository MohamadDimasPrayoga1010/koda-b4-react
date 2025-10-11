import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CalendarDays, ChevronDown } from "lucide-react";
import Message from "/images/message.png";
import Button from "../components/Button";
import OrderCard from "../components/OrderCard";
import Pagination from "../components/Pagination";

const HistoryOrder = () => {
  const orders = useSelector((state) => state.coffeOrder.orderHistory);
  const [filterStatus, setFilterStatus] = useState("OnProgress");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const getAvailableMonths = () => {
    const months = orders.map((order) => {
      const date = new Date(order.createdAt);
      return {
        value: `${date.getMonth()}-${date.getFullYear()}`,
        label: date.toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        }),
      };
    });
    return [...new Map(months.map((item) => [item.value, item])).values()];
  };

  const filteredOrders = orders.filter((order) => {
    let statusMatch = true;
    if (filterStatus === "OnProgress")
      statusMatch = order.status === "On Progress";
    if (filterStatus === "SendingGoods")
      statusMatch = order.status === "Sending Goods";
    if (filterStatus === "FinishOrder") statusMatch = order.status === "Finish";

    let monthMatch = true;
    if (selectedMonth !== "all") {
      const orderDate = new Date(order.createdAt);
      const orderMonthYear = `${orderDate.getMonth()}-${orderDate.getFullYear()}`;
      monthMatch = orderMonthYear === selectedMonth;
    }

    return statusMatch && monthMatch;
  });

  const getCurrentMonth = () => {
    if (selectedMonth === "all") {
      return new Date().toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });
    }
    const selected = getAvailableMonths().find(
      (m) => m.value === selectedMonth
    );
    return selected ? selected.label : "All Months";
  };

  return (
    <main className="my-10 md:my-20 px-4 md:px-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 my-9">
        <h1 className="text-3xl md:text-5xl font-semibold text-center sm:text-left">
          History Order
        </h1>
        <span className="mt-3 sm:mt-0 w-10 h-10 bg-[#E8E8E8] flex items-center justify-center rounded mx-auto sm:mx-0">
          {filteredOrders.length}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <section className="flex-1 w-full lg:max-w-[700px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 bg-[#E8E8E899] p-2 rounded-md">
              {[
                { key: "OnProgress", label: "On Progress" },
                { key: "SendingGoods", label: "Sending Goods" },
                { key: "FinishOrder", label: "Finish Order" },
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setFilterStatus(btn.key)}
                  className={`${
                    filterStatus === btn.key ? "bg-white" : ""
                  } p-2 px-4 text-sm font-normal rounded-md hover:bg-white/50 transition`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="bg-[#E8E8E899] p-2 md:p-3 rounded-md">
              <div className="flex gap-2 items-center p-2 cursor-pointer justify-center md:justify-start">
                <CalendarDays className="w-5 h-5" />
                <span className="text-sm">{getCurrentMonth()}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-2">
                {orders.length === 0
                  ? "No orders yet"
                  : `No orders found in ${filterStatus}`}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                {orders.length === 0
                  ? "Start shopping to create your first order"
                  : "Try changing the filter"}
              </p>
              <Link to="/our-product">
                <button className="bg-[#FF8906] text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
                  {orders.length === 0 ? "Start Shopping" : "Browse Products"}
                </button>
              </Link>
            </div>
          ) : (
            <Pagination
              data={filteredOrders}
              itemsPerPage={4}
              renderItem={(order) => <OrderCard key={order.id} order={order} />}
              gridCols="grid-cols-1"
            />
          )}
        </section>

        <section className="w-full lg:w-[480px]">
          <div className="p-4 border border-[#E8E8E8] rounded-lg text-center lg:text-left">
            <img
              src={Message}
              alt="message-icon"
              className="my-4 mx-auto lg:mx-0 w-14 md:w-16"
            />
            <p className="text-lg text-[#4F5665] font-semibold mb-2">
              Send Us Message
            </p>
            <p className="text-sm text-[#4F5665] mb-4">
              If you're unable to find an answer or find your product quickly,
              please describe your problem and tell us. We will give you a
              solution.
            </p>
            <Button className="w-full">Send Message</Button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default HistoryOrder;
