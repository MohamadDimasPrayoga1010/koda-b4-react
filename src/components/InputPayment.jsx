import React, { useState } from "react";
import { Mail, User, MapPin } from "lucide-react";

const InputPayment = () => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    delivery: "dine-in",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeliveryChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      delivery: type,
    }));
  };

  return (
    <div className="w-full  bg-white   rounded-lg p-8 shadow-lg">
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Email
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter Your Email"
            className="w-full pl-10 pr-12 py-2.5 border border-[#DEDEDE] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm bg-white"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Full Name
        </label>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter Your Full Name"
            className="w-full pl-10 pr-12 py-2.5 border border-[#DEDEDE] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm bg-white"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Address
        </label>
        <div className="relative">
          <MapPin
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter Your Address"
            className="w-full pl-10 pr-12 py-2.5 border border-[#DEDEDE] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm bg-white"
          />
        </div>
      </div>

      <div className="mt-8">
        <label className="block text-sm font-bold text-gray-800 mb-3">
          Delivery
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleDeliveryChange("dine-in")}
            className={`py-3 px-4 rounded-md font-medium transition-all ${
              formData.delivery === "dine-in"
                ? "border border-[#FF8906] text-black"
                : "bg-white border-2 border-gray-300 text-gray-700 "
            }`}
          >
            Dine in
          </button>
          <button
            onClick={() => handleDeliveryChange("door-delivery")}
            className={`py-3 px-4 rounded-md font-medium transition-all ${
              formData.delivery === "door-delivery"
                ? "border border-[#FF8906] text-black"
                : "bg-white border-2 border-gray-300 text-gray-700 "
            }`}
          >
            Door Delivery
          </button>
          <button
            onClick={() => handleDeliveryChange("pick-up")}
            className={`py-3 px-4 rounded-md font-medium transition-all ${
              formData.delivery === "pick-up"
                ? "border border-[#FF8906] text-black"
                : "bg-white border-2 border-gray-300 text-gray-700 "
            }`}
          >
            Pick Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputPayment
