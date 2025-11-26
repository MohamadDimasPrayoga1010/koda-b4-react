import React, { useEffect, useState } from "react";
import { Image } from "lucide-react";
import Xcircle from "/images/XCircle.png";
import { apiRequest } from "../utils/api";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";

export default function ProductModal({ mode, formData, setFormData, onClose, onSave }) {
  const { token } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await apiRequest("/admin/categories", "GET", null, token);
        if (catRes.success) setCategories(catRes.data);

        const typeRes = await apiRequest("/admin/type-products", "GET", null, token);
        if (typeRes.success) {
          setSizes(typeRes.data.sizes || []);
          setVariants(typeRes.data.variants || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (sizeId) => {
    setFormData((prev) => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(sizeId)
        ? prev.selectedSizes.filter((s) => s !== sizeId)
        : [...prev.selectedSizes, sizeId],
    }));
  };

  const handleVariantToggle = (variantId) => {
    setFormData((prev) => ({
      ...prev,
      selectedVariants: prev.selectedVariants.includes(variantId)
        ? prev.selectedVariants.filter((v) => v !== variantId)
        : [...prev.selectedVariants, variantId],
    }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFormData((prev) => {
      const images = [...prev.productImages];
      images[index] = file;
      const validImages = images.slice(0, 4);
      
      return { ...prev, productImages: validImages };
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const images = [...prev.productImages];
      images.splice(index, 1);
      
      return { ...prev, productImages: images };
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true); 
      await onSave();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="absolute right-0 top-[26px] w-[600px] flex items-end justify-end p-4 z-50">
      <Loading show={loading} text={mode === "edit" ? "Updating product..." : "Saving product..."} fullScreen={true} />

      <form className="bg-white shadow-lg w-full max-w-xl max-h-screen overflow-y-auto mt-10">
        <div className="flex justify-between items-center p-6 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === "edit" ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <img src={Xcircle} alt="close-icon" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Product Images (max 4)
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => {
                const currentImage = formData.productImages[i];
                let imageUrl = "";
                
                if (currentImage) {
                  if (typeof currentImage === "string") {
                    imageUrl = currentImage;
                  } else if (currentImage instanceof File) {
                    imageUrl = URL.createObjectURL(currentImage);
                  }
                }

                return (
                  <div key={i} className="relative w-16 h-16">
                    <label htmlFor={`imageInput${i}`}>
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-orange-400 transition">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Image className="text-gray-400" />
                        )}
                      </div>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, i)}
                      className="hidden"
                      id={`imageInput${i}`}
                    />
                    {currentImage && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition"
                      >
                        <img src={Xcircle} alt="remove" className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">Click on image to replace or add new images</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, categoryId: cat.id }))}
                  className={`px-4 py-2 rounded-lg font-semibold border-2 ${
                    formData.categoryId === cat.id
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-300 hover:border-orange-500"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
            <input
              type="number"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleInputChange}
              placeholder="Enter Product Price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-3">Sizes</label>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => handleSizeToggle(size.id)}
                  className={`px-4 py-2 rounded-lg font-semibold border-2 ${
                    formData.selectedSizes.includes(size.id)
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-300 hover:border-orange-500"
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Variants</label>
            <div className="flex gap-2 flex-wrap">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => handleVariantToggle(variant.id)}
                  className={`px-4 py-2 rounded-lg font-semibold border-2 ${
                    formData.selectedVariants.includes(variant.id)
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-300 hover:border-orange-500"
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
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
            onClick={handleSave} 
            className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 font-bold rounded-lg transition text-base"
          >
            {mode === "edit" ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}