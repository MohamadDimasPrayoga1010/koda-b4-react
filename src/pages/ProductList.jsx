import React, { useState } from "react";
import { Search, Filter, Edit, Trash2, Plus } from "lucide-react";
import ProductModal from "../components/ProductModal";

export default function ProductList() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Caramel Macchiato",
      price: "IDR 40.000",
      desc: "Cold brewing...",
      size: "S,M,L,XL,250 gr",
      method: "Deliver, Dine In",
      stock: 200,
      image: "/images/coffeHazelnut.png",
    },
    {
      id: 2,
      name: "Hazelnut Latte",
      price: "IDR 40.000",
      desc: "Cold brewing...",
      size: "S,M,L,XL,500 gr",
      method: "Deliver, Dine In",
      stock: 200,
      image: "/images/coffeHazelnut.png",
    },
  ]);

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
    weight: "250g",
    productImage: null,
    stock: 0,
  });

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveProduct = () => {
    if (isEditing) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProductId
            ? {
                ...p,
                name: formData.productName,
                price: formData.productPrice,
                desc: formData.description,
                size: formData.selectedSizes.join(","),
                stock: formData.stock,
              }
            : p
        )
      );
    } else {
      const newProduct = {
        id: products.length + 1,
        name: formData.productName,
        price: formData.productPrice,
        desc: formData.description,
        size: formData.selectedSizes.join(","),
        stock: formData.stock,
        method: "Deliver",
        image: "",
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    setShowModal(false);
    setIsEditing(false);
    setEditingProductId(null);
    setFormData({
      productName: "",
      productPrice: "",
      description: "",
      selectedSizes: [],
      weight: "250g",
      productImage: null,
      stock: 0,
    });
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

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
                weight: "250g",
                productImage: null,
                stock: 0,
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition"
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
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition">
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
                    "Method",
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
                    className="border-b hover:bg-gray-50 transition"
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
                      {product.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.desc}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.size}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.method}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded transition">
                        <Edit
                          size={18}
                          onClick={() => {
                            setIsEditing(true);
                            setEditingProductId(product.id);
                            setFormData({
                              productName: product.name,
                              productPrice: product.price,
                              description: product.desc,
                              selectedSizes: product.size.split(","),
                              weight: "250g",
                              productImage: null,
                              stock: product.stock,
                            });
                            setShowModal(true);
                          }}
                        />
                      </button>
                      <button
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                        onClick={() => handleDeleteProduct(product.id)}
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
              Show {filteredProducts.length} products of {products.length}{" "}
              product
            </p>
            <div className="flex gap-2 items-center">
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition">
                Prev
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((page) => (
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
              ))}
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition">
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
    </div>
  );
}
