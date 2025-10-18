import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, MapPin } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import CartItems from "../components/CartItem";
import {
  addOrder,
  clearCart,
  removeFromCart,
} from "../redux/reducer/coffeOrder";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.coffeOrder.cart || []);

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    delivery: "dine-in",
  });
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [orderId, setOrderId] = useState("");

  const paymentMethods = [
    { name: "BRI", image: "/images/bri.png" },
    { name: "Dana", image: "/images/dana.png" },
    { name: "BCA", image: "/images/bca.png" },
    { name: "Gopay", image: "/images/gopay.png" },
    { name: "OVO", image: "/images/ovo.png" },
    { name: "Paypal", image: "/images/paypal.png" },
  ];

  const deliveryFee = formData.delivery === "door-delivery" ? 10000 : 0;
 const orderTotal = cartItems.reduce((sum, item) => {
  const itemPrice = item.isFlashSale
    ? item.price 
    : item.originalPrice || item.price;
  return sum + itemPrice * item.quantity;
}, 0);

  const taxAmount = orderTotal * 0.1;
  const grandTotal = orderTotal + deliveryFee + taxAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.fullName) errors.fullName = "Full name is required";
    if (!formData.address) errors.address = "Address is required";
    if (!selectedPayment) errors.payment = "Please select a payment method";
    if (cartItems.length === 0) errors.cart = "Your cart is empty";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    const generatedOrderId = `#${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    setOrderId(generatedOrderId);

    const newOrder = {
      id: Date.now(),
      orderId: generatedOrderId,
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      items: cartItems,
      total: grandTotal,
      status: "On Progress",
      statusColor: "bg-[#FF890633] text-[#FF8906]",
      customerInfo: { ...formData },
      paymentMethod: selectedPayment,
      orderTotal,
      deliveryFee,
      tax: taxAmount,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      dispatch(addOrder(newOrder));
      dispatch(clearCart());

      setIsProcessing(false);
      setPaymentSuccess(true);

      setFormData({
        email: "",
        fullName: "",
        address: "",
        delivery: "dine-in",
      });
      setSelectedPayment("");
      setValidationErrors({});

      setTimeout(() => {
        setPaymentSuccess(false);
        navigate("/history-order");
      }, 3000);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6 my-20 md:px-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800">
        Payment Details
      </h1>

      {paymentSuccess && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Thank you for your order.</p>
            <p className="text-sm text-gray-500 mt-2">Order ID: {orderId}</p>
            <p className="text-xs text-gray-400 mt-2">
              Redirecting to order history...
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-8">
          <CartItems
            cartItems={cartItems}
            onRemoveItem={(cartItemId) => dispatch(removeFromCart(cartItemId))}
            validationErrors={validationErrors}
          />

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Payment Info & Delivery
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-[#0B132A] mb-2">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter Your Email"
                    className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm bg-white ${
                      validationErrors.email
                        ? "border-red-500"
                        : "border-[#DEDEDE]"
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-[#0B132A] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User />
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter Your Full Name"
                    className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm bg-white ${
                      validationErrors.fullName
                        ? "border-red-500"
                        : "border-[#DEDEDE]"
                    }`}
                  />
                  {validationErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.fullName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-[#0B132A] mb-2">
                  Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin />
                  </span>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter Your Address"
                    className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm bg-white ${
                      validationErrors.address
                        ? "border-red-500"
                        : "border-[#DEDEDE]"
                    }`}
                  />
                  {validationErrors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.address}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Delivery
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "dine-in", label: "Dine in" },
                    { value: "door-delivery", label: "Door Delivery" },
                    { value: "pick-up", label: "Pick Up" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, delivery: value }))
                      }
                      className={`py-3 px-4 rounded-md font-medium transition-all ${
                        formData.delivery === value
                          ? "border border-[#FF8906] text-black"
                          : "bg-white border-2 border-gray-300 text-gray-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-md sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Total</h2>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {[
                { label: "Order", value: orderTotal },
                { label: "Delivery", value: deliveryFee },
                { label: "Tax", value: taxAmount },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <p className="text-gray-600">{label}</p>
                  <p className="font-semibold text-gray-800">
                    IDR {value.toLocaleString("id-ID")}
                  </p>
                </div>
              ))}

              <hr className="border-gray-300" />
              <div className="flex justify-between items-center text-lg">
                <p className="font-bold text-gray-800">Sub Total</p>
                <p className="font-bold text-[#FF8906]">
                  IDR {grandTotal.toLocaleString("id-ID")}
                </p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isProcessing}
                className={`w-full mt-4 py-3 rounded-lg font-semibold transition-colors ${
                  cartItems.length === 0 || isProcessing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#FF8906] text-white hover:bg-orange-600"
                }`}
              >
                {isProcessing ? "Processing..." : "Checkout"}
              </button>

              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">We Accept</p>
                {validationErrors.payment && (
                  <p className="text-red-500 text-xs mb-2">
                    {validationErrors.payment}
                  </p>
                )}
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.name}
                      onClick={() => {
                        setSelectedPayment(method.name);
                        if (validationErrors.payment) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            payment: "",
                          }));
                        }
                      }}
                      className={`flex items-center justify-center p-2 border rounded cursor-pointer transition ${
                        selectedPayment === method.name
                          ? "border-[#FF8906] bg-orange-50"
                          : "border-gray-200 hover:border-[#FF8906]"
                      }`}
                    >
                      <img
                        src={method.image}
                        alt={method.name}
                        className="h-6 object-contain"
                      />
                    </div>
                  ))}
                </div>
                {selectedPayment && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {selectedPayment}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PaymentDetails;
