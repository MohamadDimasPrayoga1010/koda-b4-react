import React, { useEffect, useState } from "react";
import { Search, Filter, Edit, Trash2, Plus } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product List</h1>
        </div>
        <div className="flex justify-between gap-4 mb-6">
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
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold transition"
          >
            <Plus size={20} /> Add Product
          </button>

          <div className="flex gap-2 relative w-full md:w-auto">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Enter Product Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold transition">
              <Filter size={20} /> Filter
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-orange-500"
                    />
                  </th>
                  {[
                    "Image",
                    "Product Name",
                    "Price",
                    "Desc",
                    "Product Size",
                    "Stock",
                    "Action",
                  ].map((th, i) => (
                    <th
                      key={i}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-center text-2xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover mx-auto"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.desc}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.sizeText}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded transition"
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
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition"
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

          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} — Total {totalProducts} products
            </p>
            <div className="flex gap-2 items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition disabled:opacity-40"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded transition ${
                      currentPage === page
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition disabled:opacity-40"
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
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  handleDeleteProduct(confirmDelete.productId);
                  setConfirmDelete({ show: false, productId: null });
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() =>
                  setConfirmDelete({ show: false, productId: null })
                }
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
