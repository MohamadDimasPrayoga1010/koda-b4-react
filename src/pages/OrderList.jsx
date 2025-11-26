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
  Package,
  Calendar,
  DollarSign,
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
    Done: "bg-green-100 text-green-700 border-green-300",
    Pending: "bg-red-100 text-red-700 border-red-300",
    OnProgress: "bg-amber-100 text-amber-700 border-amber-300",
    Waiting: "bg-gray-100 text-gray-700 border-gray-300",
  };

  const getStatusColor = (status) =>
    statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300";

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
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1A0F0A] mb-2">Order List</h1>
          <div className="h-1.5 w-24 bg-gradient-to-r from-[#D4A574] to-transparent rounded-full"></div>
        </div>

        <div className="my-6 flex flex-wrap justify-between items-end gap-4">
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#D4A574] to-[#8B6F47] hover:from-[#8B6F47] hover:to-[#D4A574] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            <Plus size={20} /> Add Order
          </button>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-[#6B5744] mb-2">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="min-w-[150px] px-4 py-2.5 border-2 border-[#D4A574]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] bg-white text-[#6B5744] font-medium transition-all duration-300"
              >
                <option value="all">All</option>
                <option value="Done">Done</option>
                <option value="Pending">Pending</option>
                <option value="OnProgress">On Progress</option>
                <option value="Waiting">Waiting</option>
              </select>
            </div>

            <div className="relative w-full md:w-[280px]">
              <label htmlFor="search" className="block text-sm font-semibold text-[#6B5744] mb-2">
                Search Order
              </label>
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter your order"
                className="w-full pl-4 pr-12 py-2.5 border-2 border-[#D4A574]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all duration-300"
              />
              <Search className="absolute right-4 top-11 text-[#8B7355]" size={20} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border-2 border-[#D4A574]/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#F5E6D3] to-[#FAF8F5] border-b-2 border-[#D4A574]/20 text-[#6B5744] text-sm">
                <th className="px-4 py-4">
                  <input type="checkbox" className="w-4 h-4 accent-[#D4A574] rounded" />
                </th>
                {["No.Order", "Date", "Order", "Status", "Total", "Action"].map((th, i) => (
                  <th key={i} className="px-6 py-4 font-bold">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((item, idx) => (
                <tr key={item.id} className={`border-b border-[#D4A574]/10 hover:bg-[#FAF8F5] transition-all duration-200 text-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]/30'}`}>
                  <td className="px-4 py-4">
                    <input type="checkbox" className="w-4 h-4 accent-[#D4A574] rounded" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#6B5744]">{item.noOrders}</td>
                  <td className="px-6 py-4 text-[#8B7355]">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-5 space-y-1 text-[#6B5744]">
                      {item.orderItems.map((oi, idx) => (
                        <li key={idx} className="text-sm">{oi.title} {oi.size} {oi.qty}x {oi.variant}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(item.statusName)}`}>
                      {item.statusName}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#6B5744]">{formatRupiah(item.total)}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleHistory(item)} className="p-2.5 text-[#6B5744] hover:bg-[#F5E6D3] rounded-lg transition-all duration-300 hover:scale-110" title="History">
                      <img src={GroupIcon} alt="group-icon" className="w-14" />
                    </button>
                    <button onClick={() => confirmDelete(item.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center px-6 py-5 bg-white border-2 border-t-0 border-[#D4A574]/10 rounded-b-2xl shadow-lg">
          <p className="text-sm text-[#6B5744] font-medium">
            Show <span className="font-bold text-[#8B6F47]">{filteredOrders.length}</span> orders of <span className="font-bold text-[#8B6F47]">{orders.length}</span> orders
          </p>
          <div className="flex gap-2 items-center">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="px-4 py-2 text-sm text-[#6B5744] hover:bg-[#F5E6D3] rounded-lg transition-all duration-300 font-semibold">
              Prev
            </button>
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 font-semibold ${
                  currentPage === page ? "bg-gradient-to-r from-[#D4A574] to-[#8B6F47] text-white shadow-md" : "text-[#6B5744] hover:bg-[#F5E6D3]"
                }`}
              >
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="px-4 py-2 text-sm text-[#6B5744] hover:bg-[#F5E6D3] rounded-lg transition-all duration-300 font-semibold">
              Next
            </button>
          </div>
        </div>

      </div>

      {showModal && selectedOrder && (
        <div className="absolute right-0 top-[26px] w-[600px] flex items-end justify-end p-4 z-50">
          <div className="bg-white shadow-2xl w-full max-w-xl max-h-screen overflow-y-auto rounded-2xl border-2 border-[#D4A574]/20">
            <div className="flex justify-between items-center p-6 sticky top-0 bg-gradient-to-r from-[#F5E6D3] to-[#FAF8F5] border-b-2 border-[#D4A574]/20 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-[#1A0F0A]">
                Order {selectedOrder.noOrders}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#8B7355] hover:text-[#6B5744] transition-colors p-2 hover:bg-white/50 rounded-lg">
                <img src={Xcircle} alt="icon-close" className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-[#D4A574]" />
                <h1 className="text-xl font-bold text-[#1A0F0A]">Order Information</h1>
              </div>
              
              <div className="flex flex-col gap-3 bg-[#FAF8F5] rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center border-b border-[#D4A574]/20 py-3">
                  <div className="flex gap-3 text-[#6B5744]">
                    <User size={18} className="text-[#8B6F47]" />
                    <p className="text-sm font-semibold">Full Name</p>
                  </div>
                  <p className="font-bold text-[#1A0F0A]">{selectedOrder.userFullname}</p>
                </div>

                <div className="flex justify-between items-center border-b border-[#D4A574]/20 py-3">
                  <div className="flex gap-3 text-[#6B5744]">
                    <MapPin size={18} className="text-[#8B6F47]" />
                    <p className="text-sm font-semibold">Address</p>
                  </div>
                  <p className="font-bold text-[#1A0F0A] text-right max-w-[300px]">{selectedOrder.userAddress}</p>
                </div>

                <div className="flex justify-between items-center border-b border-[#D4A574]/20 py-3">
                  <div className="flex gap-3 text-[#6B5744]">
                    <Phone size={18} className="text-[#8B6F47]" />
                    <p className="text-sm font-semibold">Phone</p>
                  </div>
                  <p className="font-bold text-[#1A0F0A]">{selectedOrder.userPhone}</p>
                </div>

                <div className="flex justify-between items-center border-b border-[#D4A574]/20 py-3">
                  <div className="flex gap-3 text-[#6B5744]">
                    <Truck size={18} className="text-[#8B6F47]" />
                    <p className="text-sm font-semibold">Shipping</p>
                  </div>
                  <p className="font-bold text-[#1A0F0A]">{selectedOrder.shippingName}</p>
                </div>

                <div className="flex justify-between items-center border-b border-[#D4A574]/20 py-3">
                  <div className="flex gap-3 text-[#6B5744]">
                    <p className="text-sm font-semibold">Status</p>
                  </div>
                  <select
                    value={selectedOrder.statusName}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    className="px-3 py-2 rounded-lg border-2 border-[#D4A574]/30 focus:outline-none focus:ring-2 focus:ring-[#D4A574] font-semibold text-[#6B5744]"
                  >
                    {["Done", "Pending", "OnProgress", "Waiting"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center py-3">
                  <div className="flex gap-3 text-[#6B5744]">
                    <p className="text-sm font-semibold">Total Transaction</p>
                  </div>
                  <p className="text-xl font-bold text-[#D4A574]">{formatRupiah(selectedOrder.total)}</p>
                </div>
              </div>

              <div className="my-4">
                <h1 className="text-xl font-bold text-[#1A0F0A] mb-4">Your Order</h1>
                {selectedOrder.orderItems.map((item, idx) => (
                  <div key={idx} className="my-3 flex gap-4 bg-[#FAF8F5] p-4 rounded-xl border-2 border-[#D4A574]/10 hover:border-[#D4A574]/30 transition-all duration-300">
                    <div className="flex-shrink-0">
                      <img src={item.image || "/images/Coffe.png"} alt={item.Title} className="w-20 h-20 object-cover rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                      <h3 className="text-base font-bold text-[#1A0F0A]">{item.title}</h3>
                      <div className="flex gap-3 text-[#8B7355] text-sm">
                        <p className="font-semibold">{item.qty} pcs</p>
                        <span className="text-[#D4A574]">|</span>
                        <p>{item.size}</p>
                        <span className="text-[#D4A574]">|</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl w-[450px] shadow-2xl border-2 border-[#D4A574]/20">
            <h2 className="text-2xl font-bold mb-4 text-[#1A0F0A]">Delete Transaction</h2>
            <p className="text-[#6B5744] mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2.5 rounded-xl border-2 border-[#D4A574]/30 hover:bg-[#F5E6D3] transition-all duration-300 font-semibold text-[#6B5744]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
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