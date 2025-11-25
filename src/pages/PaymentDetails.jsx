import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CartItems from "../components/CartItem";
import { apiRequest } from "../utils/api";
import { useSelector } from "react-redux";
import AuthAlert from "../components/AuthAlert";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const buyNowItem = location.state?.item; 

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

  const refreshCart = async () => {
    if (!token) return;
    try {
      const cartRes = await apiRequest("/cart", "GET", null, token);
      if (cartRes && cartRes.success && Array.isArray(cartRes.data.items)) {
        const transformed = cartRes.data.items.map(item => ({
          ...item,
          name: item.name || item.title,
          quantity: item.quantity || 1,
          subtotal: item.subtotal || item.price * (item.quantity || 1),
        }));
        setCartItems(transformed);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("refreshCart error:", err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchOtherData = async () => {
      try {
        const shippingRes = await apiRequest("/shippings", "GET", null, token);
        setShippings(Array.isArray(shippingRes.data) ? shippingRes.data : []);

        const paymentRes = await apiRequest("/payment-methods", "GET", null, token);
        setPaymentMethods(Array.isArray(paymentRes.data) ? paymentRes.data : []);

        const userRes = await apiRequest("/profile", "GET", null, token);
        if (userRes.success && userRes.data) {
          const profile = userRes.data;
          setFormData(prev => ({
            ...prev,
            email: profile.email || prev.email,
            fullName: profile.fullname || profile.full_name || prev.fullName,
            phone: profile.phone || profile.phone_number || prev.phone,
            address: profile.address || prev.address,
          }));
        }
      } catch (err) {
        console.error("Fetch other data error:", err);
        setAlert({ type: "error", message: "Failed to fetch data" });
      }
    };
    refreshCart();
    fetchOtherData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: "" }));
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
        paymentMethodId: paymentMethods.find(p => p.name === selectedPayment)?.id,
        shippingId: shippings.find(s => s.name === formData.delivery)?.id,
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
      await refreshCart();

      setFormData({ email: "", fullName: "", phone: "", address: "", delivery: "" });
      setSelectedPayment("");
      setValidationErrors({});

      setTimeout(() => {
        setPaymentSuccess(false);
        navigate("/history-order");
      }, 3000);
    } catch (err) {
      console.error("Checkout error:", err);
      setAlert({ type: "error", message: err.message || "Failed to process transaction" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8 my-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-4xl md:text-5xl font-bold text-[#654321] mb-2 tracking-tight">
              Payment Details
            </h1>
            <div className="h-1 bg-gradient-to-r from-transparent via-[#654321] to-transparent rounded-full"></div>
          </div>
          <p className="text-[#8B7355] mt-3 text-sm">Complete your purchase securely</p>
        </div>

        {alert.message && <AuthAlert type={alert.type} message={alert.message} />}
        
        {paymentSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md transform animate-bounce-in border-2 border-[#D4C5B0]">
              <div className="bg-gradient-to-br from-green-400 to-green-600 text-white text-7xl mb-6 w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg">
                ✓
              </div>
              <h2 className="text-3xl font-bold mb-3 text-[#654321]">Payment Successful!</h2>
              <p className="text-gray-600 text-lg mb-4">Thank you for your order.</p>
              <div className="bg-[#F5F0E8] rounded-lg p-4 mb-4 border border-[#D4C5B0]">
                <p className="text-sm text-[#8B7355] font-semibold">Order ID</p>
                <p className="text-xl font-bold text-[#654321]">{orderId}</p>
              </div>
              <p className="text-sm text-gray-500">Redirecting to order history...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-[#D4C5B0] overflow-hidden">
              <div className="bg-[#654321] p-4">
                <h2 className="text-xl font-bold text-white">Your Cart</h2>
              </div>
              <div className="p-6">
                <CartItems cartItemsProp={cartItems} refreshCart={refreshCart} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-[#D4C5B0] overflow-hidden">
              <div className="bg-[#654321] p-4">
                <h2 className="text-xl font-bold text-white">Payment Info & Delivery</h2>
              </div>
              
              <form className="p-8 space-y-6">
                <div className="relative">
                  <label className="block text-sm font-bold text-[#654321] mb-2 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] outline-none transition-all text-sm bg-[#F5F0E8] placeholder-[#B8A590] ${
                      validationErrors.email ? "border-red-500 bg-red-50" : "border-[#D4C5B0]"
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{validationErrors.email}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-[#654321] mb-2 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] outline-none transition-all text-sm bg-[#F5F0E8] placeholder-[#B8A590] ${
                      validationErrors.fullName ? "border-red-500 bg-red-50" : "border-[#D4C5B0]"
                    }`}
                  />
                  {validationErrors.fullName && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{validationErrors.fullName}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-[#654321] mb-2 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+62 812 3456 7890"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] outline-none transition-all text-sm bg-[#F5F0E8] placeholder-[#B8A590] ${
                      validationErrors.phone ? "border-red-500 bg-red-50" : "border-[#D4C5B0]"
                    }`}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{validationErrors.phone}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-[#654321] mb-2 uppercase tracking-wide">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] outline-none transition-all text-sm bg-[#F5F0E8] placeholder-[#B8A590] resize-none ${
                      validationErrors.address ? "border-red-500 bg-red-50" : "border-[#D4C5B0]"
                    }`}
                  />
                  {validationErrors.address && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{validationErrors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#654321] mb-3 uppercase tracking-wide">
                    Delivery Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {shippings.map((s) => (
                      <label
                        key={s.id}
                        className={`relative py-4 px-5 rounded-xl font-semibold border-2 cursor-pointer transition-all transform hover:scale-105 ${
                          formData.delivery === s.name 
                            ? "border-[#654321] bg-[#F5F0E8] shadow-lg" 
                            : "border-[#D4C5B0] bg-white hover:border-[#8B7355]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value={s.name}
                          checked={formData.delivery === s.name}
                          onChange={handleInputChange}
                          className="absolute opacity-0"
                        />
                        <div className="flex items-center justify-center">
                          <span className={`text-sm ${formData.delivery === s.name ? "text-[#654321]" : "text-gray-700"}`}>
                            {s.name}
                          </span>
                        </div>
                        {formData.delivery === s.name && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#654321] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                  {validationErrors.delivery && (
                    <p className="text-red-600 text-xs mt-2 font-medium">{validationErrors.delivery}</p>
                  )}
                </div>
              </form>
            </div>
          </section>

          <section className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-[#D4C5B0] overflow-hidden sticky top-6">
              <div className="bg-[#654321] p-4">
                <h2 className="text-xl font-bold text-white">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="bg-[#F5F0E8] rounded-xl p-5 space-y-3 border border-[#D4C5B0]">
                  {[
                    { label: "Subtotal", value: orderTotal },
                    { label: "Delivery Fee", value: deliveryFee },
                    { label: "Tax (10%)", value: taxAmount },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center">
                      <p className="text-sm text-[#8B7355] font-medium">{label}</p>
                      <p className="font-bold text-[#654321]">
                        IDR {value.toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}

                  <div className="border-t-2 border-[#D4C5B0] my-3"></div>
                  
                  <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                    <p className="font-bold text-[#654321] text-lg">Grand Total</p>
                    <p className="font-bold text-[#654321] text-xl">
                      IDR {grandTotal.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || isProcessing}
                  className={`w-full py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg text-lg ${
                    cartItems.length === 0 || isProcessing
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#654321] text-white hover:bg-[#7D5A32]"
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Complete Checkout"
                  )}
                </button>

                <div className="pt-4 border-t-2 border-[#D4C5B0]">
                  <p className="text-sm font-bold text-[#654321] mb-4 uppercase tracking-wide">Payment Methods</p>
                  <div className="grid grid-cols-3 gap-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`relative flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                          selectedPayment === method.name 
                            ? "border-[#654321] bg-[#F5F0E8] shadow-lg" 
                            : "border-[#D4C5B0] bg-white hover:border-[#8B7355]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.name}
                          checked={selectedPayment === method.name}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="absolute opacity-0"
                        />
                        <img src={method.image} alt={method.name} className="h-8 object-contain" />
                        {selectedPayment === method.name && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#654321] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                  {validationErrors.payment && (
                    <p className="text-red-600 text-xs mt-2 font-medium">{validationErrors.payment}</p>
                  )}
                </div>

              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PaymentDetails;