import React from "react";
import { X, Tag } from "lucide-react";

export default function CategoryModal({ mode, formData, setFormData, onClose, onSave }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-2 border-[#D4A574]/20 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#F5E6D3] to-[#FAF8F5] px-6 py-4 border-b-2 border-[#D4A574]/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Tag className="w-6 h-6 text-[#D4A574]" />
            <h2 className="text-2xl font-bold text-[#1A0F0A]">
              {mode === "edit" ? "Edit Category" : "Add New Category"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#D4A574]/20 rounded-lg transition-all duration-300"
          >
            <X className="w-6 h-6 text-[#6B5744]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#6B5744] mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-[#D4A574]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all duration-300"
            />
            <p className="text-xs text-[#8B7355] mt-1">
              Minimum 3 characters required
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white px-6 py-4 border-t-2 border-[#D4A574]/20 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border-2 border-[#D4A574]/30 text-[#6B5744] rounded-xl hover:bg-[#F5E6D3] transition-all duration-300 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2.5 bg-gradient-to-r from-[#D4A574] to-[#8B6F47] hover:from-[#8B6F47] hover:to-[#D4A574] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            {mode === "edit" ? "Update Category" : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}