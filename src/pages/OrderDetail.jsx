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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Order Not Found
          </h2>
          <Link
            to="/history-order"
            className="inline-block bg-[#FF8906] text-white px-6 py-3 rounded hover:bg-orange-600"
          >
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6 md:my-30 md:px-16">
      <div className="p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Order {order.invoice || "-"}
        </h1>
        {order.createdAt && (
          <p className="text-gray-600 text-sm">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 pb-2">
              Order Information
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center w-full border-b border-gray-200 p-3">
                <div className="flex items-center gap-4">
                  <User className="w-5 h-5 text-gray-500 mt-1" />
                  <p className="text-normal text-gray-500">Full Name</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-semibold text-gray-800">
                    {order.custName || "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center w-full border-b border-gray-200 p-3">
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <p className="text-normal text-gray-500">Address</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-semibold text-gray-800">
                    {order.custAddress || "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center w-full border-b border-gray-200 p-3">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-gray-500 mt-1" />
                  <p className="text-normal text-gray-500">Phone</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-semibold text-gray-800">
                    {order.custPhone || "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center w-full border-b border-gray-200 p-3">
                <div className="flex items-center gap-4">
                  <CreditCard className="w-5 h-5 text-gray-500 mt-1" />
                  <p className="text-normal text-gray-500">Payment Method</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-semibold text-gray-800">
                    {order.paymentMethod || "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center w-full border-b border-gray-200 p-3">
                <div className="flex items-center gap-4">
                  <Truck className="w-5 h-5 text-gray-500 mt-1" />
                  <p className="text-normal text-gray-500">Shipping</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-semibold text-gray-800">
                    {order.deliveryMethod || "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center w-full border-b border-gray-200 p-3">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-5 h-5 text-gray-500 mt-1" />
                  <p className="text-sm text-gray-500">Status</p>
                </div>
                <div className="ml-auto text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold`}>
                    {order.status || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Total Transaction</p>
                <p className="text-2xl font-bold text-[#FF8906]">
                  IDR {Math.round(order.total).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Order</h2>

            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 bg-gray-100 p-3">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
                        <span>{item.quantity}pcs</span>
                        {item.size && (
                          <>
                            <span>|</span>
                            <span>{item.size}</span>
                          </>
                        )}
                        {item.variant && (
                          <>
                            <span>|</span>
                            <span>{item.variant}</span>
                          </>
                        )}
                      </div>
                      <div className="text-lg font-bold text-[#FF8906]">
                        IDR {item.subtotal.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetail;
