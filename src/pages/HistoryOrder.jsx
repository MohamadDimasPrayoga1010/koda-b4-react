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
    <main className="my-25 px-4 md:px-16 bg-gradient-to-br from-[#f8f5f0] to-[#faf8f5] min-h-screen">
      <div className="flex items-center sm:gap-4 my-9 animate-fadeIn">
        <h1 className="text-3xl md:text-5xl font-bold text-center sm:text-left bg-gradient-to-r from-[#654321] to-[#8b6239] bg-clip-text text-transparent">
          History Order
        </h1>
        <span className="mt-3 sm:mt-0 w-10 h-10 bg-gradient-to-br from-[#654321] to-[#8b6239] text-white flex items-center justify-center rounded-full shadow-md font-semibold mx-auto sm:mx-0 transform hover:scale-110 transition-transform duration-300">
          {orders.length}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <section className="flex-1 w-full lg:max-w-[700px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 bg-gradient-to-r from-[#654321]/10 to-[#8b6239]/10 p-2 rounded-xl shadow-sm backdrop-blur-sm border border-[#654321]/20">
              {status.map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setFilterStatus(btn.key)}
                  className={`${
                    filterStatus === btn.key 
                      ? "bg-gradient-to-r from-[#654321] to-[#8b6239] text-white shadow-md scale-105" 
                      : "bg-white/80 text-[#654321] hover:bg-white hover:shadow-sm"
                  } p-2 px-4 text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-r from-[#654321]/10 to-[#8b6239]/10 p-2 md:p-3 rounded-xl shadow-sm backdrop-blur-sm border border-[#654321]/20">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full border-none bg-transparent text-sm cursor-pointer text-[#654321] font-semibold focus:outline-none"
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
            <div className="text-center py-12 bg-gradient-to-br from-white to-[#faf8f5] rounded-2xl shadow-lg border border-[#654321]/10 transform hover:scale-[1.02] transition-transform duration-300">
              <div className="mb-4 text-6xl">📦</div>
              <p className="text-[#654321] mb-4 text-lg font-semibold">No orders found</p>
              <p className="text-[#8b6239] mb-6 text-sm px-4">Start your shopping journey with us!</p>
              <Link to="/our-product">
                <button className="bg-gradient-to-r from-[#654321] to-[#8b6239] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Browse Products
                </button>
              </Link>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <Pagination
                data={orders}
                itemsPerPage={4}
                renderItem={(order) => <OrderCard key={order.id} order={order} />}
                gridCols="grid-cols-1"
              />
            </div>
          )}
        </section>

        <section className="w-full lg:w-[480px]">
          <div className="p-6 bg-gradient-to-br from-white to-[#faf8f5] rounded-2xl text-center lg:text-left shadow-xl border border-[#654321]/10 transform hover:scale-[1.02] transition-all duration-300">
            <div className="bg-gradient-to-br from-[#654321]/10 to-[#8b6239]/10 w-20 h-20 rounded-2xl flex items-center justify-center my-4 mx-auto lg:mx-0 shadow-md">
              <img
                src={Message}
                alt="message-icon"
                className="w-10 h-10"
              />
            </div>
            <p className="text-xl text-[#654321] font-bold mb-3">
              Send Us Message
            </p>
            <p className="text-sm text-[#8b6239] mb-6 leading-relaxed">
              If you're unable to find an answer or find your product quickly,
              please describe your problem and tell us. We will give you a
              solution.
            </p>
            <Button className="w-full bg-gradient-to-r from-[#654321] to-[#8b6239] text-white font-semibold py-3 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Send Message
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default HistoryOrder;