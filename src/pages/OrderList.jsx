import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  User,
  MapPin,
  Phone,
  Truck,
  ChevronDown,
} from "lucide-react";
import GroupIcon from "/images/Group.png";
import PortIcon from "/images/u_postcard.png";
import RepeatIcon from "/images/repeat.png";
import Coffe from "/images/coffeHazelnut.png";
import Xcircle from "/images/XCircle.png";

const OrderList = () => {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [product, setProduct] = useState([]);

  useEffect(()=>{
    const orderList = async () =>{
      try{
      const response = await fetch("/data/orderList.json")
      const data = await response.json()
      setProduct(data);
      }catch(err){
        console.log("Error fetching data", err);
      }
    }
    orderList()
  },[])

    const formatRupiah = (price) =>
      price
        ? "IDR " +
          new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: 0,
          }).format(price)
        : "-";

  const statusColors = {
    done: "bg-green-200 text-green-800",
    pending: "bg-red-200 text-red-800",
    onprogress: "bg-orange-200 text-orange-600",
    waiting: "bg-gray-200 text-gary-800",
  };

  const getStatusColor = (status) =>
    statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800";

  

  const handleHistory = (order) => {
    setSelectedOrder(order), setShowModal(true);
  };

  const filteredProducts = product.filter((item) => {
    const matchStatus =
      status === "all" ||
      item.status.toLowerCase().replace(/\s/g, "") === status.toLowerCase();
    const matchSearch = item.noOrder
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

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
                name="status"
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

            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600  px-6 py-2 rounded-lg font-semibold transition">
              <Filter size={20} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-700 text-sm">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-orange-500"
                  />
                </th>
                {["No.Order", "Date", "Order", "Status", "Total", "Action"].map(
                  (th, i) => (
                    <th key={i} className="px-6 py-3 font-semibold">
                      {th}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition text-sm"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-orange-500"
                    />
                  </td>
                  <td className="px-6 py-3">{item.noOrder}</td>
                  <td className="px-6 py-3">{item.date}</td>

                  <td className="px-6 py-3">
                    <ul className="list-disc pl-5 space-y-1">
                      {item.order.map((orderItem, idx) => (
                        <li key={idx}>
                          {orderItem.name} {orderItem.size} {orderItem.qty}x
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-3">{formatRupiah(item.total)}</td>

                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => handleHistory(item)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded transition"
                      title="History"
                    >
                      <img src={GroupIcon} alt="group-icon" className="w-7" />
                    </button>
                    <button
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded transition"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                      title="Delete"
                    >
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
            Show {filteredProducts.length} products of {product.length} product
          </p>
          <div className="flex gap-2 items-center">
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition">
              Prev
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded transition ${
                  currentPage === page
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition">
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
                Order {selectedOrder.noOrder}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              ><img src={Xcircle} alt="icon-close" />
              </button>
            </div>
            <div className="p-6">
              <h1 className="text-xl font-medium">Order Information</h1>
              <div className="flex justify-between items-center border-b border-b-gray-400 py-5">
                <div className="flex gap-3 text-[#4F5665]">
                  <User size={18} />
                  <p className="text-sm">FullName</p>
                </div>
                <p className="font-bold">Yoga</p>
              </div>
              <div className="flex justify-between items-center border-b border-b-gray-400 py-5">
                <div className="flex gap-3 text-[#4F5665]">
                  <MapPin size={18} />
                  <p className="text-sm">Address</p>
                </div>
                <p className="font-bold">Bekasi</p>
              </div>
              <div className="flex justify-between items-center border-b border-b-gray-400 py-5">
                <div className="flex gap-3 text-[#4F5665]">
                  <Phone size={18} />
                  <p className="text-sm">Phone</p>
                </div>
                <p className="font-bold">08123456789</p>
              </div>
              <div className="flex justify-between items-center border-b border-b-gray-400 py-5">
                <div className="flex gap-3 text-[#4F5665]">
                  <img src={PortIcon} alt="post-icon" />
                  <p className="text-sm">Payment Method</p>
                </div>
                <p className="font-bold">Cash</p>
              </div>
              <div className="flex justify-between items-center border-b border-b-gray-400 py-5">
                <div className="flex gap-3 text-[#4F5665]">
                  <Truck size={18} />
                  <p className="text-sm">Shipping</p>
                </div>
                <p className="font-bold">Dine In</p>
              </div>
              <div className="flex justify-between items-center border-b border-b-gray-400 py-5">
                <div className="flex gap-3 text-[#4F5665]">
                  <img
                    src={RepeatIcon}
                    className="object-cover w-5 h-5"
                    alt="repeat-icon"
                  />
                  <p className="text-sm">Status</p>
                </div>
                <button className="flex gap-2 items-center py-2 px-3 bg-gray-300">
                  Onprogress
                  <ChevronDown />
                </button>
              </div>
              <div className="flex justify-between items-center py-5">
                <div className="flex gap-3 text-[#4F5665]">
                  <p className="text-sm">Total Transaksi</p>
                </div>
                <p className="text-lg text-orange-400">{selectedOrder.total}</p>
              </div>
              <div className="my-3">
                <h1 className="text-2xl">Your Order</h1>
                <div className="my-3 flex gap-4 bg-gray-200 p-3">
                  <div>
                    <img
                      src={Coffe}
                      alt="Coffe-image"
                      className="w-22 h-22 object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg">Hazernut</h3>
                    <div className="flex gap-3 text-gray-600">
                      <p>2pcs</p>
                      <span>|</span>
                      <p>Reguler</p>
                      <span>|</span>
                      <p>Ice</p>
                      <span>|</span>
                      <p>Dine In</p>
                    </div>
                    <div className="flex gap-4">
                      <p className="text-red-500 line-through">IDR40.000</p>
                      <p className="text-lg text-orange-400">IDR20.000</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full my-4 px-4 py-3 bg-orange-500 hover:bg-orange-600  font-bold rounded-lg transition text-base">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
