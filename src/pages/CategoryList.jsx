import React, { useEffect, useState, useRef } from "react";
import { Search, Filter, Edit, Trash2, Plus, Tag } from "lucide-react";
import CategoryModal from "../components/CategoryModal";
import AuthAlert from "../components/AuthAlert";
import { apiRequest } from "../utils/api";
import { useSelector } from "react-redux";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  const [alert, setAlert] = useState({ message: "", type: "success" });
  const { token } = useSelector((state) => state.auth);
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    categoryId: null,
  });

  const topRef = useRef(null);

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const fetchCategories = async () => {
    try {
      const res = await apiRequest(
        `/admin/categories`,
        "GET",
        null,
        token
      );

      if (!res || res.success === false) {
        setAlert({
          message: res?.message || "Failed to fetch categories",
          type: "error",
        });
        return;
      }

      const list = Array.isArray(res.data) ? res.data : [];
      setCategories(list);
    } catch (error) {
      setAlert({
        message: error.message || "Failed to fetch categories",
        type: "error",
      });
    }
  };

  const handleSaveCategory = async () => {
    try {
      if (!formData.name.trim()) {
        setAlert({ message: "Category name is required", type: "error" });
        return;
      }

      if (formData.name.trim().length < 3) {
        setAlert({ message: "Category name must be at least 3 characters", type: "error" });
        return;
      }

      const payload = { name: formData.name.trim() };
      let res;

      if (isEditing && editingCategoryId) {
        res = await apiRequest(
          `/admin/categories/${editingCategoryId}`,
          "PATCH",
          payload,
          token
        );

        if (res.success) {
          setAlert({ message: "Category updated successfully", type: "success" });
          scrollToTop();
          fetchCategories();
        } else {
          setAlert({ message: res.message || "Update failed", type: "error" });
        }
      } else {
        res = await apiRequest(`/admin/categories`, "POST", payload, token);

        if (res.success) {
          setAlert({ message: "Category added successfully", type: "success" });
          scrollToTop();
          fetchCategories();
        } else {
          setAlert({
            message: res.message || "Add category failed",
            type: "error",
          });
        }
      }
    } catch (error) {
      setAlert({
        message: error.message || "Something went wrong",
        type: "error",
      });
    }

    setShowModal(false);
    setIsEditing(false);
    setEditingCategoryId(null);
    setFormData({ name: "" });
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await apiRequest(
        `/admin/categories/${id}`,
        "DELETE",
        null,
        token
      );

      if (res.success) {
        setAlert({ message: "Category deleted successfully", type: "success" });
        scrollToTop();
        fetchCategories();
      } else {
        setAlert({ message: res.message || "Delete failed", type: "error" });
      }
    } catch (error) {
      setAlert({
        message: error.message || "Something went wrong",
        type: "error",
      });
    }
  };

  const confirmDeleteCategory = (id) => {
    setConfirmDelete({ show: true, categoryId: id });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-white p-8">
      <div ref={topRef} className="absolute top-0 left-0" />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Tag className="w-8 h-8 text-[#D4A574]" />
            <h1 className="text-4xl font-bold text-[#1A0F0A]">Category List</h1>
          </div>
          <div className="h-1.5 w-28 bg-gradient-to-r from-[#D4A574] to-transparent rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({ name: "" });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#D4A574] to-[#8B6F47] hover:from-[#8B6F47] hover:to-[#D4A574] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus size={20} /> Add Category
          </button>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Enter Category Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border-2 border-[#D4A574]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all duration-300"
              />
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B7355]"
                size={20}
              />
            </div>
            <button className="flex items-center gap-2 bg-white border-2 border-[#D4A574]/30 hover:bg-[#F5E6D3] text-[#6B5744] px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:border-[#D4A574]">
              <Filter size={20} /> Filter
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#D4A574]/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#F5E6D3] to-[#FAF8F5] border-b-2 border-[#D4A574]/20">
                  <th className="px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#D4A574] rounded"
                    />
                  </th>
                  {[
                    "ID",
                    "Category Name",
                    "Created At",
                    "Updated At",
                    "Action",
                  ].map((th, i) => (
                    <th
                      key={i}
                      className="px-6 py-4 text-left text-sm font-bold text-[#6B5744]"
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-[#8B7355]">
                      <Tag className="w-16 h-16 mx-auto mb-3 text-[#D4A574]/30" />
                      <p className="text-lg font-medium">No categories found</p>
                      <p className="text-sm mt-1">Create your first category to get started</p>
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category, idx) => (
                    <tr
                      key={category.id}
                      className={`border-b border-[#D4A574]/10 hover:bg-[#FAF8F5] transition-all duration-200 ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]/30'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-[#D4A574] rounded"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B5744] font-medium">
                        {category.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#1A0F0A] font-semibold">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#8B7355]">
                        {formatDate(category.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#8B7355]">
                        {formatDate(category.updatedAt)}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
                          onClick={() => {
                            setIsEditing(true);
                            setEditingCategoryId(category.id);
                            setFormData({ name: category.name });
                            setShowModal(true);
                          }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                          onClick={() => confirmDeleteCategory(category.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center px-6 py-5 bg-white border-t-2 border-[#D4A574]/10">
            <p className="text-sm text-[#6B5744] font-medium">
              Total <span className="font-bold text-[#8B6F47]">{filteredCategories.length}</span> categories
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <CategoryModal
          mode={isEditing ? "edit" : "add"}
          formData={formData}
          setFormData={setFormData}
          onClose={() => {
            setShowModal(false);
            setIsEditing(false);
          }}
          onSave={handleSaveCategory}
        />
      )}

      {alert.message && (
        <AuthAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ message: "", type: "success" })}
        />
      )}

      {confirmDelete.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[450px] border-2 border-[#D4A574]/20">
            <h2 className="text-2xl font-bold mb-4 text-[#1A0F0A]">Confirm Delete</h2>
            <p className="text-[#6B5744] mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setConfirmDelete({ show: false, categoryId: null })
                }
                className="px-6 py-2.5 bg-white border-2 border-[#D4A574]/30 text-[#6B5744] rounded-xl hover:bg-[#F5E6D3] transition-all duration-300 font-semibold"
              >
                No
              </button>
              <button
                onClick={() => {
                  handleDeleteCategory(confirmDelete.categoryId);
                  setConfirmDelete({ show: false, categoryId: null });
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}