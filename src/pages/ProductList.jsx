import React, { useEffect, useState, useRef } from "react";
import { Search, Filter, Edit, Trash2, Plus, Package } from "lucide-react";
import ProductModal from "../components/ProductModal";
import AuthAlert from "../components/AuthAlert";
import { apiRequest } from "../utils/api";
import { useSelector } from "react-redux";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    description: "",
    selectedSizes: [],
    selectedVariants: [],
    productImages: [],
    stock: 0,
    categoryId: "",
  });

  const [alert, setAlert] = useState({ message: "", type: "success" });
  const { token } = useSelector((state) => state.auth);
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    productId: null,
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
    const fetchProducts = async () => {
      try {
        const res = await apiRequest(
          `/admin/products?page=${currentPage}&limit=${itemsPerPage}`,
          "GET",
          null,
          token
        );

        if (!res || res.success === false) {
          setAlert({
            message: res?.message || "Failed to fetch products",
            type: "error",
          });
          return;
        }

        const list = Array.isArray(res.data) ? res.data : [];
        setTotalProducts(res.pagination?.totalItems || 0);

        const mapped = list.map((p) => ({
          id: p.id,
          name: p.title,
          price: p.basePrice,
          desc: p.description,
          sizes: p.sizes || [],
          variants: p.variants || [],
          sizeText: p.sizes?.map((s) => s.name).join(", ") || "-",
          variantIds: p.variants?.map((v) => v.id) || [],
          sizeIds: p.sizes?.map((s) => s.id) || [],
          stock: p.stock,
          method: p.isFlashSale ? "Flash Sale" : "Regular",
          images: p.images?.map((img) => img.image) || [],
          image: p.images?.[0]?.image || "https://via.placeholder.com/80",
          categoryId: p.category?.id || "",
        }));

        setProducts(mapped);
      } catch (error) {
        setAlert({
          message: error.message || "Failed to fetch products",
          type: "error",
        });
      }
    };

    fetchProducts();
  }, [token, currentPage]);

  const formatRupiah = (price) =>
    price
      ? "IDR " +
        new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(
          price
        )
      : "-";

  const handleSaveProduct = async () => {
    try {
      if (!formData.productName.trim()) {
        setAlert({ message: "Product name is required", type: "error" });
        return;
      }

      if (!formData.description.trim()) {
        setAlert({ message: "Description is required", type: "error" });
        return;
      }

      if (formData.description.trim().length < 10) {
        setAlert({ message: "Description must be at least 10 characters", type: "error" });
        return;
      }

      if (!formData.productPrice || Number(formData.productPrice) <= 0) {
        setAlert({ message: "Price must be greater than 0", type: "error" });
        return;
      }

      if (formData.stock === "" || Number(formData.stock) < 0) {
        setAlert({ message: "Stock cannot be negative", type: "error" });
        return;
      }

      if (isEditing && Number(formData.stock) < 1) {
        setAlert({ message: "Stock must be at least 1 when updating", type: "error" });
        return;
      }

      if (!formData.categoryId) {
        setAlert({ message: "Please select a category", type: "error" });
        return;
      }

      if (!isEditing && (!formData.productImages || formData.productImages.length === 0)) {
        setAlert({ message: "At least 1 image is required", type: "error" });
        return;
      }

      const payload = new FormData();
      payload.append("title", formData.productName);
      payload.append("basePrice", formData.productPrice);
      payload.append("description", formData.description);
      payload.append("stock", formData.stock);
      payload.append("categoryId", formData.categoryId);

      formData.selectedSizes.forEach((id) =>
        payload.append("sizes", Number(id))
      );
      formData.selectedVariants?.forEach((id) =>
        payload.append("variant_id", Number(id))
      );

      const newImages = formData.productImages.filter(
        (file) => file instanceof File
      );
      newImages.slice(0, 4).forEach((file) => payload.append("images", file));

      let res;

      if (isEditing && editingProductId) {
        res = await apiRequest(
          `/admin/products/${editingProductId}`,
          "PATCH",
          payload,
          token,
          true
        );

        if (res.success) {
          setAlert({ message: "Product updated successfully", type: "success" });
          scrollToTop();

          setProducts((prev) =>
            prev.map((p) =>
              p.id === editingProductId
                ? {
                    ...p,
                    name: formData.productName,
                    price: formData.productPrice,
                    desc: formData.description,
                    sizeText: formData.selectedSizes.join(", "),
                    sizeIds: formData.selectedSizes,
                    variantIds: formData.selectedVariants || [],
                    stock: formData.stock,
                    images:
                      res.data.images?.map((img) => img.image) || p.images,
                    image: res.data.images?.[0]?.image || p.image,
                    categoryId: formData.categoryId,
                  }
                : p
            )
          );
        } else {
          setAlert({ message: res.message || "Update failed", type: "error" });
        }
      } else {
        res = await apiRequest(`/admin/products`, "POST", payload, token, true);

        if (res.success) {
          setAlert({ message: "Product added successfully", type: "success" });
          scrollToTop();

          const newProduct = {
            id: res.data.id,
            name: res.data.title,
            price: res.data.basePrice,
            desc: res.data.description,
            sizeText: res.data.sizes?.map((s) => s.name).join(", ") || "-",
            sizeIds: res.data.sizes?.map((s) => s.id) || [],
            variantIds: res.data.variants?.map((v) => v.id) || [],
            stock: res.data.stock,
            method: res.data.isFlashSale ? "Flash Sale" : "Regular",
            images: res.data.images?.map((img) => img.image) || [],
            image: res.data.images?.[0]?.image || "",
            categoryId: res.data.category?.id || "",
          };

          setProducts((prev) => [...prev, newProduct]);
          setTotalProducts((prev) => prev + 1);
        } else {
          setAlert({
            message: res.message || "Add product failed",
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
    setEditingProductId(null);
    setFormData({
      productName: "",
      productPrice: "",
      description: "",
      selectedSizes: [],
      selectedVariants: [],
      productImages: [],
      stock: 0,
      categoryId: "",
    });
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await apiRequest(
        `/admin/products/${id}`,
        "DELETE",
        null,
        token,
        true
      );

      if (res.success) {
        setAlert({ message: "Product deleted successfully", type: "success" });
        scrollToTop();
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setTotalProducts((prevTotal) => prevTotal - 1);
        setCurrentPage((prevPage) => {
          const newTotalPages = Math.ceil((totalProducts - 1) / itemsPerPage);
          if (prevPage > newTotalPages && newTotalPages > 0) {
            return newTotalPages;
          }
          return prevPage;
        });

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

  const confirmDeleteProduct = (id) => {
    setConfirmDelete({ show: true, productId: id });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-white p-8">
      <div ref={topRef} className="absolute top-0 left-0" />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-[#D4A574]" />
            <h1 className="text-4xl font-bold text-[#1A0F0A]">Product List</h1>
          </div>
          <div className="h-1.5 w-28 bg-gradient-to-r from-[#D4A574] to-transparent rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({
                productName: "",
                productPrice: "",
                description: "",
                selectedSizes: [],
                selectedVariants: [],
                productImages: [],
                stock: 0,
                categoryId: "",
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#D4A574] to-[#8B6F47] hover:from-[#8B6F47] hover:to-[#D4A574] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus size={20} /> Add Product
          </button>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Enter Product Name"
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
                    "Image",
                    "Product Name",
                    "Price",
                    "Description",
                    "Product Size",
                    "Stock",
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
                {filteredProducts.map((product, idx) => (
                  <tr
                    key={product.id}
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
                    <td className="px-6 py-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg border-2 border-[#D4A574]/20 shadow-md"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1A0F0A] font-semibold">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B5744] font-medium">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8B7355] max-w-xs truncate">
                      {product.desc}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B5744] font-medium">
                      {product.sizeText}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        product.stock > 10 
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : product.stock > 0
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : 'bg-red-100 text-red-700 border border-red-300'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
                        onClick={() => {
                          setIsEditing(true);
                          setEditingProductId(product.id);
                          setFormData({
                            productName: product.name,
                            productPrice: product.price,
                            description: product.desc,
                            selectedSizes: product.sizeIds,
                            selectedVariants: product.variantIds,
                            productImages: product.images,
                            stock: product.stock,
                            categoryId: product.categoryId,
                          });
                          setShowModal(true);
                        }}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                        onClick={() => confirmDeleteProduct(product.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center px-6 py-5 bg-white border-t-2 border-[#D4A574]/10">
            <p className="text-sm text-[#6B5744] font-medium mb-3 md:mb-0">
              Page <span className="font-bold text-[#8B6F47]">{currentPage}</span> of <span className="font-bold text-[#8B6F47]">{totalPages}</span> — Total <span className="font-bold text-[#8B6F47]">{totalProducts}</span> products
            </p>
            <div className="flex gap-2 items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => p - 1);
                  scrollToTop();
                }}
                className="px-4 py-2 text-sm text-[#6B5744] hover:bg-[#F5E6D3] rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      scrollToTop();
                    }}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 font-semibold ${
                      currentPage === page
                        ? "bg-gradient-to-r from-[#D4A574] to-[#8B6F47] text-white shadow-md"
                        : "text-[#6B5744] hover:bg-[#F5E6D3]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => p + 1);
                  scrollToTop();
                }}
                className="px-4 py-2 text-sm text-[#6B5744] hover:bg-[#F5E6D3] rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ProductModal
          mode={isEditing ? "edit" : "add"}
          formData={formData}
          setFormData={setFormData}
          onClose={() => {
            setShowModal(false);
            setIsEditing(false);
          }}
          onSave={handleSaveProduct}
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
            <p className="text-[#6B5744] mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setConfirmDelete({ show: false, productId: null })
                }
                className="px-6 py-2.5 bg-white border-2 border-[#D4A574]/30 text-[#6B5744] rounded-xl hover:bg-[#F5E6D3] transition-all duration-300 font-semibold"
              >
                No
              </button>
              <button
                onClick={() => {
                  handleDeleteProduct(confirmDelete.productId);
                  setConfirmDelete({ show: false, productId: null });
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