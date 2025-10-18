import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  User,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  CheckCircle,
} from "lucide-react";

const OrderDetail = () => {
  const { id } = useParams();
  const orderHistory = useSelector(
    (state) => state.coffeOrder.orderHistory || []
  );
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const foundOrder = orderHistory.find((o) => o.id === parseInt(id));
    setOrder(foundOrder || null);
  }, [id, orderHistory]);

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
        <h1 className="text-3xl font-bold mb-2">Order {order.orderId}</h1>
        <p className="text-gray-600 text-sm">
          {order.date} at{" "}
          {new Date(order.createdAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
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
                    {order.customerInfo.fullName}
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
                    {order.customerInfo.address}
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
                    {order.customerInfo.phone || "08123456789"}
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
                    {order.paymentMethod}
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
                    {order.customerInfo.delivery.replace("-", " ")}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center w-full border-b border-gray-200 p-3">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-5 h-5 text-gray-500 mt-1" />
                  <p className="text-sm text-gray-500">Status</p>
                </div>
                <div className="ml-auto text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${order.statusColor}`}
                  >
                    {order.status}
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
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 bg-gray-100 p-3">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    {item.isFlashSale && (
                      <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mb-1">
                        FLASHSALE!
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
                      <span>{item.quantity}pcs</span>
                      <span>|</span>
                      <span>{item.size}</span>
                      <span>|</span>
                      <span>{item.temperature}</span>
                      <span>|</span>
                      <span>{item.delivery}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.isFlashSale && item.originalPrice && (
                        <span className="text-xs text-red-500 line-through">
                          IDR {item.originalPrice.toLocaleString("id-ID")}
                        </span>
                      )}
                      <span className="text-lg font-bold text-[#FF8906]">
                        IDR{" "}
                        {(
                          (item.isFlashSale ? item.price : item.originalPrice) *
                          item.quantity
                        ).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  IDR {order.orderTotal.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">
                  IDR {order.deliveryFee.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-semibold">
                  IDR {Math.round(order.tax).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2">
                <span>Total</span>
                <span className="text-[#FF8906]">
                  IDR {Math.round(order.total).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetail;
