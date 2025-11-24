import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Plus,
  Search,
  Trash2,
  User,
  MapPin,
  Phone,
  Truck,
} from "lucide-react";
import { apiRequest } from "../utils/api";
import GroupIcon from "/images/Group.png";
import Xcircle from "/images/XCircle.png";
import AuthAlert from "../components/AuthAlert";

const OrderList = () => {
  const token = useSelector((state) => state.auth.token);

  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [alert, setAlert] = useState({ type: "success", message: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  const fetchOrders = async () => {
    const query = `?page=${currentPage}&limit=10&search=${search}`;
    const res = await apiRequest(`/admin/transactions${query}`, "GET", null, token);
    if (res.success) {
      setOrders(res.data);
      setTotalPages(res.pagination?.totalPages || 1);
    } else {
      console.error(res.message);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [currentPage, search, token]);

  const formatRupiah = (price) =>
    price
      ? "IDR " +
        new Intl.NumberFormat("id-ID", {
          minimumFractionDigits: 0,
        }).format(price)
      : "-";

  const statusColors = {
    Done: "bg-green-200 text-green-800",
    Pending: "bg-red-200 text-red-800",
    OnProgress: "bg-orange-200 text-orange-600",
    Waiting: "bg-gray-200 text-gray-800",
  };

  const getStatusColor = (status) =>
    statusColors[status] || "bg-gray-100 text-gray-800";

  const handleHistory = async (order) => {
    const res = await apiRequest(`/admin/transactions/${order.id}`, "GET", null, token);
    if (res.success) {
      setSelectedOrder(res.data);
      setShowModal(true);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const statusMap = { Done: 1, Pending: 2, OnProgress: 3, Waiting: 4 }; 
    const res = await apiRequest(
      `/admin/transactions/${orderId}/status`,
      "PATCH",
      { statusId: statusMap[newStatus] },
      token
    );
    if (res.success) {
      setAlert({ type: "success", message: "Status updated!" });
      fetchOrders();
      setShowModal(false);
    } else {
      setAlert({ type: "error", message: "Failed to update status: " + res.message });
    }
  };

  const confirmDelete = (orderId) => {
    setDeleteOrderId(orderId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteOrderId) return;

    const res = await apiRequest(`/admin/transactions/${deleteOrderId}`, "DELETE", null, token);
    if (res.success) {
      setAlert({ type: "success", message: "Transaction deleted!" });
      fetchOrders();
      setShowDeleteModal(false);
    } else {
      setAlert({ type: "error", message: "Failed to delete: " + res.message });
    }
  };

  const filteredOrders = orders.filter((item) => {
    return (
      status === "all" ||
      item.statusName.toLowerCase().replace(/\s/g, "") ===
        status.toLowerCase()
    );
  });

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All</option>
                <option value="Done">Done</option>
                <option value="Pending">Pending</option>
                <option value="OnProgress">On Progress</option>
                <option value="Waiting">Waiting</option>
              </select>
            </div>

            <div className="relative w-full md:w-[250px]">
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
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
              <Search className="absolute right-3 top-10 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-700 text-sm">
                <th className="px-4 py-3"><input type="checkbox" className="w-4 h-4 accent-orange-500" /></th>
                {["No.Order", "Date", "Order", "Status", "Total", "Action"].map((th, i) => (
                  <th key={i} className="px-6 py-3 font-semibold">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition text-sm">
                  <td className="px-4 py-3"><input type="checkbox" className="w-4 h-4 accent-orange-500" /></td>
                  <td className="px-6 py-3">{item.noOrders}</td>
                  <td className="px-6 py-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <ul className="list-disc pl-5 space-y-1">
                      {item.orderItems.map((oi, idx) => (
                        <li key={idx}>{oi.title} {oi.size} {oi.qty} {oi.variant}x</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.statusName)}`}>
                      {item.statusName}
                    </span>
                  </td>
                  <td className="px-6 py-3">{formatRupiah(item.total)}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <button onClick={() => handleHistory(item)} className="p-2 text-gray-500 hover:bg-gray-100 rounded transition" title="History">
                      <img src={GroupIcon} alt="group-icon" className="w-7" />
                    </button>
                    <button onClick={() => confirmDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
          <p className="text-sm text-gray-600">
            Show {filteredOrders.length} orders of {orders.length} orders
          </p>
          <div className="flex gap-2 items-center">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition">
              Prev
            </button>
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded transition ${
                  currentPage === page ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition">
              Next
            </button>
          </div>
        </div>

      </div>

      {showModal && selectedOrder && (
        <div className="absolute right-0 top-[26px] w-[600px] bg-opacity-50 flex items-end justify-end p-4 z-50">
          <div className="bg-white shadow-lg w-full max-w-xl max-h-screen overflow-y-auto mt-10">
            <div className="flex justify-between items-center p-6 sticky top-0 bg-white">
              <h2 className="text-2xl font-medium text-gray-900">
                Order {selectedOrder.noOrders}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <img src={Xcircle} alt="icon-close" />
              </button>
            </div>

            <div className="p-6">
              <h1 className="text-xl font-medium">Order Information</h1>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-b-gray-400 py-3">
                  <div className="flex gap-3 text-[#4F5665]"><User size={18} /><p className="text-sm">FullName</p></div>
                  <p className="font-bold">{selectedOrder.userFullname}</p>
                </div>

                <div className="flex justify-between items-center border-b border-b-gray-400 py-3">
                  <div className="flex gap-3 text-[#4F5665]"><MapPin size={18} /><p className="text-sm">Address</p></div>
                  <p className="font-bold">{selectedOrder.userAddress}</p>
                </div>

                <div className="flex justify-between items-center border-b border-b-gray-400 py-3">
                  <div className="flex gap-3 text-[#4F5665]"><Phone size={18} /><p className="text-sm">Phone</p></div>
                  <p className="font-bold">{selectedOrder.userPhone}</p>
                </div>

                <div className="flex justify-between items-center border-b border-b-gray-400 py-3">
                  <div className="flex gap-3 text-[#4F5665]"><Truck size={18} /><p className="text-sm">Shipping</p></div>
                  <p className="font-bold">{selectedOrder.shippingName}</p>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-b-gray-400 py-3">
                <div className="flex gap-3 text-[#4F5665]"><p className="text-sm">Status</p></div>
                <select
                  value={selectedOrder.statusName}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="px-3 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {["Done", "Pending", "OnProgress", "Waiting"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center py-3">
                <div className="flex gap-3 text-[#4F5665]"><p className="text-sm">Total Transaksi</p></div>
                <p className="text-lg text-orange-400">{formatRupiah(selectedOrder.total)}</p>
              </div>

              <div className="my-3">
                <h1 className="text-2xl">Your Order</h1>
                {selectedOrder.orderItems.map((item, idx) => (
                  <div key={idx} className="my-3 flex gap-4 bg-gray-200 p-3">
                    <div>
                      <img src={item.image || "/images/Coffe.png"} alt={item.Title} className="w-22 h-22 object-cover" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg">{item.title}</h3>
                      <div className="flex gap-3 text-gray-600">
                        <p>{item.qty} pcs</p>
                        <span>|</span>
                        <p>{item.size}</p>
                        <span>|</span>
                        <p>{item.variant}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Delete Transaction</h2>
            <p>Are you sure you want to delete this transaction?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {alert.message && (
        <AuthAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}
    </div>
  );
};

export default OrderList;
