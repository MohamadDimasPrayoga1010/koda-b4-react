import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, X, Mail, User, MapPin } from "lucide-react";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
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

  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const deliveryFee = formData.delivery === "door-delivery" ? 10000 : 0;
  const orderTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxAmount = orderTotal * 0.1;
  const grandTotal = orderTotal + deliveryFee + taxAmount;

  const handleRemoveItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

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
      customerInfo: {
        email: formData.email,
        fullName: formData.fullName,
        address: formData.address,
        delivery: formData.delivery,
      },
      paymentMethod: selectedPayment,
      orderTotal: orderTotal,
      deliveryFee: deliveryFee,
      tax: taxAmount,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      const existingOrders = JSON.parse(
        localStorage.getItem("orderHistory") || "[]"
      );

      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem("orderHistory", JSON.stringify(updatedOrders));

      setIsProcessing(false);
      setPaymentSuccess(true);

      setTimeout(() => {
        setPaymentSuccess(false);
        setCartItems([]);
        localStorage.removeItem("cart");
        setFormData({
          email: "",
          fullName: "",
          address: "",
          delivery: "dine-in",
        });
        setSelectedPayment("");
        setValidationErrors({});

        navigate("/history-order");
      }, 3000);
    }, 2000);
  };

  const InputField = ({ label, name, type = "text", icon: Icon, error }) => (
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-2">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          placeholder={`Enter Your ${label}`}
          className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm bg-white ${
            error ? "border-red-500" : "border-[#DEDEDE]"
          }`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6 md:my-20 md:px-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800">
        Payment Details
      </h1>

      {paymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Order
              </h2>
              <Link to="/our-product">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#FF8906] text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Plus size={18} />
                  <span>Add Menu</span>
                </button>
              </Link>
            </div>

            {validationErrors.cart && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                {validationErrors.cart}
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link to="/our-product">
                  <button className="bg-[#FF8906] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
                    Browse Products
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md flex-shrink-0"
                    />

                    <div className="flex-1 space-y-2">
                      {item.isFlashSale && (
                        <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                          FLASHSALE!
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-gray-800">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        <span>{item.quantity}pcs</span>
                        <span className="text-gray-300">|</span>
                        <span>{item.size}</span>
                        <span className="text-gray-300">|</span>
                        <span>{item.temperature}</span>
                        <span className="text-gray-300">|</span>
                        <span>{item.delivery}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.originalPrice && (
                          <p className="text-sm text-red-500 line-through">
                            IDR {item.originalPrice.toLocaleString("id-ID")}
                          </p>
                        )}
                        <p className="text-lg font-bold text-[#FF8906]">
                          IDR{" "}
                          {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 transition"
                    >
                      <X size={24} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Payment Info & Delivery
            </h2>

            <div className="space-y-6">
              <InputField
                label="Email"
                name="email"
                type="email"
                icon={Mail}
                error={validationErrors.email}
              />
              <InputField
                label="Full Name"
                name="fullName"
                icon={User}
                error={validationErrors.fullName}
              />
              <InputField
                label="Address"
                name="address"
                icon={MapPin}
                error={validationErrors.address}
              />

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

