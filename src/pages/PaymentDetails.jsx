import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItems from "../components/CartItem";
import { apiRequest } from "../utils/api";
import { useSelector } from "react-redux";
import AuthAlert from "../components/AuthAlert";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const [cartItems, setCartItems] = useState([]);
  const [shippings, setShippings] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    delivery: "",
  });
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [orderId, setOrderId] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const deliveryFee = formData.delivery === "DoorDelivery" ? 10000 : 0;
  const orderTotal = cartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const taxAmount = orderTotal * 0.1;
  const grandTotal = orderTotal + deliveryFee + taxAmount;

  const fetchData = async () => {
    try {
      const cartRes = await apiRequest("/cart", "GET", null, token);
      if (cartRes.success && Array.isArray(cartRes.data.items)) {
        setCartItems(cartRes.data.items);
      }
      const shippingRes = await apiRequest("/shippings", "GET", null, token);
      setShippings(Array.isArray(shippingRes.data) ? shippingRes.data : []);

      const paymentRes = await apiRequest("/payment-methods", "GET", null, token);
      setPaymentMethods(Array.isArray(paymentRes.data) ? paymentRes.data : []);

      const userRes = await apiRequest("/profile", "GET", null, token);
      console.log("User profile:", userRes); 
      if (userRes.success && userRes.data) {
        const profile = userRes.data;
        setFormData((prev) => ({
          ...prev,
          email: profile.email || prev.email,
          fullName: profile.fullname || profile.full_name || prev.fullName,
          phone: profile.phone || profile.phone_number || prev.phone,
          address: profile.address || prev.address,
        }));
      }
    } catch (err) {
      setAlert({ type: "error", message: "Failed to fetch data" });
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.fullName) errors.fullName = "Full name is required";
    if (!formData.phone) errors.phone = "Phone is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.delivery) errors.delivery = "Please select delivery";
    if (!selectedPayment) errors.payment = "Please select a payment method";
    if (cartItems.length === 0) errors.cart = "Your cart is empty";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);

    try {
      const payload = {
        fullname: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        paymentMethodId: paymentMethods.find((p) => p.name === selectedPayment)?.id,
        shippingId: shippings.find((s) => s.name === formData.delivery)?.id,
      };

      if (!payload.paymentMethodId || !payload.shippingId) {
        setAlert({ type: "error", message: "Please select delivery and payment method" });
        setIsProcessing(false);
        return;
      }

      const res = await apiRequest("/transactions", "POST", payload, token);
      if (!res.success) throw new Error(res.message || "Failed to process transaction");

      setOrderId(res.data?.invoiceNumber || "N/A");
      setPaymentSuccess(true);
      setCartItems([]);
      setFormData({ email: "", fullName: "", phone: "", address: "", delivery: "" });
      setSelectedPayment("");
      setValidationErrors({});

      setTimeout(() => {
        setPaymentSuccess(false);
        navigate("/history-order");
      }, 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.message || "Failed to process transaction" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6 my-20 md:px-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800">Payment Details</h1>

      {alert.message && <AuthAlert type={alert.type} message={alert.message} />}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Thank you for your order.</p>
            <p className="text-sm text-gray-500 mt-2">Order ID: {orderId}</p>
            <p className="text-xs text-gray-400 mt-2">Redirecting to order history...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-8">
          <CartItems cartItems={cartItems} setCartItems={setCartItems} token={token} />

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment Info & Delivery</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-[#0B132A] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Your Email"
                  className={`w-full pl-3 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm bg-white ${
                    validationErrors.email ? "border-red-500" : "border-[#DEDEDE]"
                  }`}
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-base font-semibold text-[#0B132A] mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter Your Full Name"
                  className={`w-full pl-3 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm bg-white ${
                    validationErrors.fullName ? "border-red-500" : "border-[#DEDEDE]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-[#0B132A] mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter Your Phone"
                  className={`w-full pl-3 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm bg-white ${
                    validationErrors.phone ? "border-red-500" : "border-[#DEDEDE]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-[#0B132A] mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter Your Address"
                  className={`w-full pl-3 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm bg-white ${
                    validationErrors.address ? "border-red-500" : "border-[#DEDEDE]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Delivery</label>
                <div className="grid grid-cols-3 gap-3">
                  {shippings.map((s) => (
                    <label
                      key={s.id}
                      className={`py-3 px-4 rounded-md font-medium border cursor-pointer ${
                        formData.delivery === s.name ? "border-orange-600 bg-orange-50" : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={s.name}
                        checked={formData.delivery === s.name}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
                {validationErrors.delivery && <p className="text-red-500 text-sm mt-1">{validationErrors.delivery}</p>}
              </div>
            </form>
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
                <p className="font-bold text-gray-800">Grand Total</p>
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
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-center p-2 border rounded cursor-pointer ${
                        selectedPayment === method.name ? "border-orange-600 bg-orange-50" : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.name}
                        checked={selectedPayment === method.name}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="mr-2"
                      />
                      <img src={method.image} alt={method.name} className="h-6 object-contain" />
                    </label>
                  ))}
                  {validationErrors.payment && <p className="text-red-500 text-sm mt-1 col-span-3">{validationErrors.payment}</p>}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PaymentDetails;
