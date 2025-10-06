import React, { useState, useEffect } from "react";
import { CalendarDays, ChevronDown, Repeat, MoveRight } from "lucide-react";
import Glass from "/images/glass.png";
import RepeatImg from "/images/repeat.png";
import { Link } from "react-router-dom";
import Message from "/images/message.png";
import Button from "../components/Button";

const HistoryOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("OnProgress");
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    const orderHistory = JSON.parse(
      localStorage.getItem("orderHistory") || "[]"
    );
    setOrders(orderHistory);
  }, []);


  const getAvailableMonths = () => {
    const months = orders.map(order => {
      const date = new Date(order.createdAt);
      return {
        value: `${date.getMonth()}-${date.getFullYear()}`,
        label: date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      };
    });

    const uniqueMonths = [...new Map(months.map(item => [item.value, item])).values()];
    return uniqueMonths;
  };


  const filteredOrders = orders.filter((order) => {
    let statusMatch = true;
    if (filterStatus === "OnProgress") statusMatch = order.status === "On Progress";
    if (filterStatus === "SendingGoods") statusMatch = order.status === "Sending Goods";
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
      return new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    }
    const availableMonths = getAvailableMonths();
    const selected = availableMonths.find(m => m.value === selectedMonth);
    return selected ? selected.label : "All Months";
  };

  return (
    <main className="my-30 md:mx-16">
      <div className="flex gap-4 items-center my-9">
        <h1 className="text-5xl">History Order</h1>
        <span className="w-10 h-10 bg-[#E8E8E8] flex items-center justify-center rounded">
          {filteredOrders.length}
        </span>
      </div>

      <div className="flex gap-5 flex-col md:flex-row">
        <section className="w-[680px]">
          <div className="flex justify-between gap-5  mb-6 flex-col md:flex-row md:items-center">
            <div className="flex justify-between gap-4 items-center bg-[#E8E8E899] p-3 rounded-md">
              <button
                onClick={() => setFilterStatus("OnProgress")}
                className={`${
                  filterStatus === "OnProgress" ? "bg-white" : ""
                } p-2 px-4 text-sm font-normal rounded-md hover:bg-white/50 transition`}
              >
                On Progress
              </button>
              <button
                onClick={() => setFilterStatus("SendingGoods")}
                className={`${
                  filterStatus === "SendingGoods" ? "bg-white" : ""
                } p-2 px-4 text-sm font-normal rounded-md hover:bg-white/50 transition`}
              >
                Sending Goods
              </button>
              <button
                onClick={() => setFilterStatus("FinishOrder")}
                className={`${
                  filterStatus === "FinishOrder" ? "bg-white" : ""
                } p-2 px-4 text-sm font-normal rounded-md hover:bg-white/50 transition`}
              >
                Finish Order
              </button>
            </div>

            <div className="bg-[#E8E8E899] p-3 rounded-md relative">
              <div className="flex gap-2 items-center p-2 cursor-pointer">
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
            <>
              {filteredOrders.map((order) => (
                <div key={order.id} className="my-4 flex gap-3">
                  <img
                    src={order.items[0]?.image || "/images/coffeHazel4.jpg"}
                    alt="order-img"
                    className="w-[111px] h-[105px] object-cover rounded-md hidden md:flex"
                  />

                  <div className="flex flex-col bg-[#E8E8E84D] p-4 rounded-md flex-1">
                    <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-base text-[#4F5665]">
                          <img
                            src={Glass}
                            alt="glass-icon"
                            className="w-5 h-5"
                          />
                          <span>No. Order</span>
                        </div>
                        <span className="text-base font-bold">
                          {order.orderId}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <p className="flex items-center gap-2 text-base text-[#4F5665]">
                          <CalendarDays className="w-5 h-5" />
                          <span>Date</span>
                        </p>
                        <span className="text-base font-bold">
                          {order.date}
                        </span>
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
                          <img
                            src={RepeatImg}
                            alt="repeat-icon"
                            className="w-5 h-5"
                          />
                          <span>Status</span>
                        </div>
                        <button
                          className={`py-2 px-3 rounded-2xl ${order.statusColor} font-semibold`}
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
              ))}

              <div className="flex gap-3 justify-center items-center mt-8">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF8906] text-white font-medium hover:bg-orange-600 transition">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8E8E8] text-gray-600 font-medium hover:bg-gray-300 transition">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8E8E8] text-gray-600 font-medium hover:bg-gray-300 transition">
                  3
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8E8E8] text-gray-600 font-medium hover:bg-gray-300 transition">
                  4
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF8906] text-white font-medium hover:bg-orange-600 transition">
                  <MoveRight />
                </button>
              </div>
            </>
          )}
        </section>

        <section>
          <div className="w-[480px] p-4 border border-[#E8E8E8] rounded-lg">
            <img src={Message} alt="message-icon" className="my-4" />
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


