import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, Search } from "lucide-react";
import Xcircle from "/images/XCircle.png";

const OrderList = () => {
  const token = useSelector((state) => state.auth.token);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  const handleHistory = async (orderId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/history/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.data);
        setShowModal(true);
      }
    } catch (err) {
      console.error("Error fetching order detail:", err);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchStatus =
      status === "all" ||
      order.status.toLowerCase().replace(/\s/g, "") === status.toLowerCase();
    const matchSearch = order.invoiceNumber
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const formatRupiah = (price) =>
    price
      ? "IDR " +
        new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(
          price
        )
      : "-";

  const statusColors = {
    done: "bg-green-200 text-green-800",
    pending: "bg-red-200 text-red-800",
    onprogress: "bg-orange-200 text-orange-600",
    waiting: "bg-gray-200 text-gray-800",
  };

  const getStatusColor = (status) =>
    statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Order List</h1>

        <div className="my-4 flex flex-wrap justify-between items-end gap-4">
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600  px-4 py-2 rounded-lg font-semibold transition">
            <Plus size={20} /> Add Order
          </button>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All</option>
                <option value="done">Done</option>
                <option value="pending">Pending</option>
                <option value="onprogress">On Progress</option>
                <option value="waiting">Waiting</option>
              </select>
            </div>

            <div className="relative w-full md:w-[250px]">
              <label
                htmlFor="search"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Search Order
              </label>
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter your order"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Search
                className="absolute right-3 top-10 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-700 text-sm">
                <th className="px-4 py-3">No.</th>
                <th className="px-6 py-3">Invoice</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition text-sm"
                >
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-6 py-3">{order.invoiceNumber}</td>
                  <td className="px-6 py-3">{order.createdAt}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">{formatRupiah(order.total)}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleHistory(order.id)}
                      className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <img src={Xcircle} alt="Close" className="w-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Order {selectedOrder.invoiceNumber}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Full Name:</p>
                  <p>{selectedOrder.custName}</p>
                </div>
                <div>
                  <p className="font-semibold">Phone:</p>
                  <p>{selectedOrder.custPhone}</p>
                </div>
                <div>
                  <p className="font-semibold">Address:</p>
                  <p>{selectedOrder.custAddress}</p>
                </div>
                <div>
                  <p className="font-semibold">Payment:</p>
                  <p>{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="font-semibold">Shipping:</p>
                  <p>{selectedOrder.deliveryMethod}</p>
                </div>
                <div>
                  <p className="font-semibold">Status:</p>
                  <span
                    className={`px-2 py-1 rounded-full ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-4">Products</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-gray-100 p-3 rounded"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm">
                        {item.quantity} pcs | {item.size || "-"} |{" "}
                        {item.variant || "-"}
                      </p>
                      <p className="text-orange-500 font-bold">
                        {formatRupiah(item.discountPrice || item.basePrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between font-bold text-lg">
                <p>Total:</p>
                <p className="text-orange-500">
                  {formatRupiah(selectedOrder.total)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
