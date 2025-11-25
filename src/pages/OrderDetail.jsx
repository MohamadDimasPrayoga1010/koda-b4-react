import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils/api";
import { User, MapPin, Phone, CreditCard, Truck, CheckCircle } from "lucide-react";

const OrderDetail = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token); 
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await apiRequest(`/history/${id}`, "GET", null, token);
        if (res.success) {
          setOrder(res.Data || res.data); 
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.error("Fetch order detail error:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f0] to-[#faf8f5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#654321] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#654321] font-semibold text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f0] to-[#faf8f5]">
        <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border border-[#654321]/10 transform hover:scale-105 transition-all duration-300">
          <div className="text-8xl mb-6">📦</div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#654321] to-[#8b6239] bg-clip-text text-transparent">
            Order Not Found
          </h2>
          <p className="text-[#8b6239] mb-8">We couldn't find the order you're looking for</p>
          <Link
            to="/history-order"
            className="inline-block bg-gradient-to-r from-[#654321] to-[#8b6239] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#faf8f5] py-8 px-6 md:my-30 md:px-16">
      <div className="p-6 mb-6 bg-gradient-to-r from-white to-[#faf8f5] rounded-2xl shadow-lg border border-[#654321]/10 animate-fadeIn">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#654321] to-[#8b6239] bg-clip-text text-transparent">
          Order {order.invoice || "-"}
        </h1>
        {order.createdAt && (
          <p className="text-[#8b6239] text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-[#654321] rounded-full"></span>
            {new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}{" "}
            at{" "}
            {new Date(order.createdAt).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white to-[#faf8f5] rounded-2xl p-8 shadow-xl border border-[#654321]/10 transform hover:scale-[1.01] transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-[#654321]/20 text-[#654321]">
              Order Information
            </h2>

            <div className="space-y-1">
              <div className="flex justify-between items-center w-full border-b border-[#654321]/10 p-4 hover:bg-[#654321]/5 transition-all duration-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#654321]/10 to-[#8b6239]/10 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-[#654321]" />
                  </div>
                  <p className="text-sm text-[#8b6239] font-medium">Full Name</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-semibold text-[#654321]">
                    {order.custName || "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center w-full border-b border-[#654321]/10 p-4 hover:bg-[#654321]/5 transition-all duration-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#654321]/10 to-[#8b6239]/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#654321]" />
                  </div>
                  <p className="text-sm text-[#8b6239] font-medium">Address</p>
                </div>
                <div className="ml-auto text-right max-w-xs">
                  <p className="font-semibold text-[#654321] text-sm">
                    {order.custAddress || "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center w-full border-b border-[#654321]/10 p-4 hover:bg-[#654321]/5 transition-all duration-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#654321]/10 to-[#8b6239]/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#654321]" />
                  </div>
                  <p className="text-sm text-[#8b6239] font-medium">Phone</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-semibold text-[#654321]">
                    {order.custPhone || "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center w-full border-b border-[#654321]/10 p-4 hover:bg-[#654321]/5 transition-all duration-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#654321]/10 to-[#8b6239]/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#654321]" />
                  </div>
                  <p className="text-sm text-[#8b6239] font-medium">Payment Method</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-semibold text-[#654321]">
                    {order.paymentMethod || "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center w-full border-b border-[#654321]/10 p-4 hover:bg-[#654321]/5 transition-all duration-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#654321]/10 to-[#8b6239]/10 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-[#654321]" />
                  </div>
                  <p className="text-sm text-[#8b6239] font-medium">Shipping</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-semibold text-[#654321]">
                    {order.deliveryMethod || "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center w-full border-b border-[#654321]/10 p-4 hover:bg-[#654321]/5 transition-all duration-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#654321]/10 to-[#8b6239]/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-[#654321]" />
                  </div>
                  <p className="text-sm text-[#8b6239] font-medium">Status</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#654321] to-[#8b6239] text-white shadow-md">
                    {order.status || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-[#654321]/20">
              <div className="flex justify-between items-center bg-gradient-to-r from-[#654321]/10 to-[#8b6239]/10 p-5 rounded-xl">
                <p className="text-[#654321] font-semibold text-lg">Total Transaction</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-[#654321] to-[#8b6239] bg-clip-text text-transparent">
                  IDR {Math.round(order.total).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white to-[#faf8f5] rounded-2xl p-8 shadow-xl border border-[#654321]/10 transform hover:scale-[1.01] transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 text-[#654321] border-b-2 border-[#654321]/20 pb-3">Your Order</h2>

            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 bg-gradient-to-r from-[#654321]/5 to-[#8b6239]/5 p-4 rounded-xl border border-[#654321]/10 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md border-2 border-white">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#654321] mb-2 text-lg">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs text-[#8b6239] mb-3 font-medium">
                        <span className="bg-white px-3 py-1 rounded-full border border-[#654321]/20">{item.quantity}pcs</span>
                        {item.size && (
                          <span className="bg-white px-3 py-1 rounded-full border border-[#654321]/20">{item.size}</span>
                        )}
                        {item.variant && (
                          <span className="bg-white px-3 py-1 rounded-full border border-[#654321]/20">{item.variant}</span>
                        )}
                      </div>
                      <div className="text-xl font-bold bg-gradient-to-r from-[#654321] to-[#8b6239] bg-clip-text text-transparent">
                        IDR {item.subtotal.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-[#8b6239]">
                  <div className="text-6xl mb-4">🛍️</div>
                  <p className="font-semibold">No products found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetail;