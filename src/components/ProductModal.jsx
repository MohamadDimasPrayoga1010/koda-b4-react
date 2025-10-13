import React from "react";
import { X } from "lucide-react";

export default function ProductModal({
  mode,
  formData,
  setFormData,
  onClose,
  onSave,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter((s) => s !== size)
        : [...prev.selectedSizes, size],
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, productImage: file }));
    }
  };

  return (
    <div className="absolute right-0 top-[26px] w-[600px] bg-opacity-50 flex items-end justify-end p-4 z-50">
      <div className="bg-white shadow-lg w-full max-w-xl max-h-screen overflow-y-auto mt-10">
  
        <div className="flex justify-between items-center p-6 sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === "edit" ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

  
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Photo Product
            </label>
            <div className="flex flex-col gap-2">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl border-2 border-dashed border-gray-300">
                {formData.productImage ? "✓" : "📷"}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageInput"
              />
              <label
                htmlFor="imageInput"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg cursor-pointer w-[80px]"
              >
                {mode === "edit" ? "Change" : "Upload"}
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder="Enter Product Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price
            </label>
            <input
              type="text"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleInputChange}
              placeholder="Enter Product Price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter Product Description"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Product Size
            </label>
            <div className="flex gap-2 flex-wrap">
              {["S", "M", "L", "XL", "250 gr", "500 gr"].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 rounded-lg font-semibold border-2 transition ${
                    formData.selectedSizes.includes(size)
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-300 hover:border-orange-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock || ""}
              onChange={handleInputChange}
              placeholder="Enter stock quantity"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>
        </div>

        <div className="p-6 sticky bottom-0 bg-white">
          <button
            onClick={onSave}
            className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition text-base"
          >
            {mode === "edit" ? "Edit Save" : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
