import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "/images/message.png";
import Button from "../components/Button";
import OrderCard from "../components/OrderCard";
import Pagination from "../components/Pagination";
import { apiRequest } from "../utils/api";

const HistoryOrder = () => {
  const token = useSelector((state) => state.auth.token);
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState(""); 
  const [selectedMonth, setSelectedMonth] = useState("all");

  const status = [
    { key: "", label: "All" },
    { key: "OnProgress", label: "On Progress" },
    { key: "SendingGoods", label: "Sending Goods" },
    { key: "FinishOrder", label: "Finish Order" },
  ];

  const months = [
    { key: "all", label: "All Months" },
    { key: 1, label: "January" },
    { key: 2, label: "February" },
    { key: 3, label: "March" },
    { key: 4, label: "April" },
    { key: 5, label: "May" },
    { key: 6, label: "June" },
    { key: 7, label: "July" },
    { key: 8, label: "August" },
    { key: 9, label: "September" },
    { key: 10, label: "October" },
    { key: 11, label: "November" },
    { key: 12, label: "December" },
  ];

  const fetchHistory = async () => {
    try {
      const monthParam = selectedMonth === "all" ? null : selectedMonth;
      const res = await apiRequest(
        `/history?status=${filterStatus}&month=${monthParam}`,
        "GET",
        null,
        token
      );
      if (res.success) {
        setOrders(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    if (token) fetchHistory();
  }, [token, filterStatus, selectedMonth]);

  return (
    <main className="my-25 px-4 md:px-16">
      <div className="flex items-center sm:gap-4 my-9">
        <h1 className="text-3xl md:text-5xl font-semibold text-center sm:text-left">
          History Order
        </h1>
        <span className="mt-3 sm:mt-0 w-10 h-10 bg-[#E8E8E8] flex items-center justify-center rounded mx-auto sm:mx-0">
          {orders.length}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <section className="flex-1 w-full lg:max-w-[700px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 bg-[#E8E8E899] p-2 rounded-md">
              {status.map((btn) => (
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
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full border-none bg-transparent text-sm cursor-pointer"
              >
                {months.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-2">No orders found</p>
              <Link to="/our-product">
                <button className="bg-[#FF8906] text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
                  Browse Products
                </button>
              </Link>
            </div>
          ) : (
            <Pagination
              data={orders}
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
