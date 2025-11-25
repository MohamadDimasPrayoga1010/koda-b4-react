import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  MapPin,
} from "lucide-react";
import GroupIcon from "/images/Group.png";
import ImgUpload from "/images/imgupload.png";
import Xcircle from "/images/XCircle.png";
import PasswordIcon from "/images/Password.svg";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import AuthAlert from "../components/AuthAlert";

const UserList = () => {
  const token = useSelector((state) => state.auth.token);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const [users, setUsers] = useState([]);
  const limit = 10;
  const searchDebounceRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchUsers = async (page = currentPage, q = search) => {
    try {
      const endpoint =
        `/admin/users?page=${page}&limit=${limit}` +
        (q ? `&search=${encodeURIComponent(q)}` : "");

      const res = await apiRequest(endpoint, "GET", null, token);

      if (!res || res.success === false) {
        setAlert({ message: "Fullname and email are required", type: "error" });
        return;
      }

      setUsers(res.data || []);

      const pagination = res.pagination || {};
      const totalPagesFromRes =
        pagination.totalPages ||
        res.totalPages ||
        Math.max(
          1,
          Math.ceil(
            (pagination.total || res.total || (res.data || []).length) /
              (pagination.limit || res.limit || limit)
          )
        );

      setTotalPages(totalPagesFromRes);
      setCurrentPage(pagination.page || res.page || page);
    } catch (err) {
      console.error("fetchUsers error:", err);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, search);
  }, [currentPage]);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, search);
    }, 450);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [search]);

  const handleAddUser = () => {
    setIsEditing(false);
    setSelectedUser({
      id: null,
      image: "",
      file: null,
      fullname: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      role: "user",
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setSelectedUser({
      id: user.id ?? null,
      image: user.profile?.image ?? user.image ?? "",
      file: null,
      fullname: user.fullname ?? "",
      email: user.email ?? "",
      phone: user.profile?.phone ?? user.phone ?? "",
      password: "",
      address: user.profile?.address ?? user.address ?? "",
      role: user.role ?? "user",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteUserId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!deleteUserId) return;
      console.log("Deleting user with ID:", deleteUserId);
      const res = await apiRequest(
        `/admin/users/${deleteUserId}`,
        "DELETE",
        null,
        token
      );
      console.log("Response:", res);

      if (!res || res.success === false) {
        setAlert({ message: "Failed to delete user", type: "error" });
        return;
      }
      setAlert({ message: "User deleted successfully", type: "success" });

      fetchUsers(currentPage, search);
    } catch (err) {
      console.error("handleDelete error:", err);
      setAlert({ message: "Delete request failed", type: "error" });
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteUserId(null);
    }
  };

  const handleSaveUser = async () => {
    try {
      if (!selectedUser) return;

      if (!selectedUser.fullname?.trim() || !selectedUser.email?.trim()) {
        setAlert({ message: "Fullname and email are required", type: "error" });
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("fullname", selectedUser.fullname ?? "");
      formData.append("email", selectedUser.email ?? "");
      formData.append("phone", selectedUser.phone ?? "");
      formData.append("address", selectedUser.address ?? "");
      if (!isEditing) formData.append("password", selectedUser.password ?? "");
      formData.append("role", selectedUser.role ?? "user");

      if (selectedUser.file) {
        formData.append("image", selectedUser.file);
      }

      let res;
      if (isEditing) {
        res = await apiRequest(
          `/admin/users/${selectedUser.id}`,
          "PATCH",
          formData,
          token,
          true
        );
      } else {
        res = await apiRequest(`/admin/users`, "POST", formData, token, true);
      }

      if (!res || res.success === false) {
        setAlert({
          message: res?.message || "Save user failed",
          type: "error",
        });
        return;
      }
      setAlert({
        message: isEditing
          ? "User updated successfully"
          : "User added successfully",
        type: "success",
      });
      setIsModalOpen(false);
      if (isEditing) {
        fetchUsers(currentPage, search);
      } else {
        setCurrentPage(1);
        fetchUsers(1, search);
      }
    } catch (err) {
      console.error("handleSaveUser error:", err);
      setAlert({ message: res?.message || "Save user failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedUser((prev) => ({
      ...(prev || {}),
      file,
      image: file ? URL.createObjectURL(file) : prev?.image ?? "",
    }));
  };

  const filteredUsers = (users || []).filter((item) =>
    (item.fullname ?? "").toLowerCase().includes((search ?? "").toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">User List</h1>
        <Loading
          show={loading}
          text={isEditing ? "Updating user..." : "Saving new user..."}
        />
        <AuthAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ message: "", type: "success" })}
        />
        <div className="my-4 flex flex-wrap justify-between items-end gap-4">
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold transition"
          >
            <Plus size={20} /> Add User
          </button>

          <div className="flex flex-wrap items-end gap-4">
            <div className="relative w-full md:w-[250px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search User
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter user name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <Search
                className="absolute right-3 top-10 text-gray-400"
                size={20}
              />
            </div>

            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold transition">
              <Filter size={20} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-700 text-sm">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-orange-500"
                  />
                </th>
                {[
                  "Image",
                  "Full Name",
                  "Phone",
                  "Address",
                  "Email",
                  "Action",
                ].map((th, i) => (
                  <th key={i} className="px-6 py-3 font-semibold">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition text-sm"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-orange-500"
                    />
                  </td>

                  <td className="px-6 py-3">
                    <img
                      src={
                        item.profile?.image ||
                        item.image ||
                        "/images/testiImg/profile.png"
                      }
                      alt={item.fullname}
                      className="w-10 h-10 rounded object-cover"
                    />
                  </td>

                  <td className="px-6 py-3 font-medium text-gray-800">
                    {item.fullname}
                  </td>

                  <td className="px-6 py-3 text-gray-600">
                    {item.profile?.phone || item.phone || "-"}
                  </td>

                  <td className="px-6 py-3 text-gray-600">
                    {item.profile?.address || item.address || "-"}
                  </td>

                  <td className="px-6 py-3 text-gray-600">{item.email}</td>

                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => handleEditUser(item)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded transition"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition"
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
            Show {filteredUsers.length} users of {users.length} total
          </p>

          <div className="flex gap-2 items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && selectedUser && (
        <div className="absolute right-0 top-[26px] w-[600px] flex items-end justify-end p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full p-6 max-h-screen overflow-y-auto mt-10 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <img src={Xcircle} alt="close-icon" />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Update User" : "Insert User"}
            </h2>

            <div className="flex flex-col mb-4">
              <label className="block text-sm font-semibold mb-3">
                Image User
              </label>

              <img
                src={
                  selectedUser.file
                    ? URL.createObjectURL(selectedUser.file)
                    : selectedUser.image || ImgUpload
                }
                className="w-20 h-20 rounded object-cover mb-2"
                alt="preview"
              />

              <input
                type="file"
                onChange={handleFileInput}
                className="hidden"
                id="upload"
              />

              <label
                htmlFor="upload"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer"
              >
                Upload
              </label>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-1 relative">
                <label className="font-medium">FullName</label>
                <input
                  type="text"
                  value={selectedUser.fullname ?? ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      fullname: e.target.value,
                    })
                  }
                  className="w-full pl-10 py-2.5 border rounded-lg"
                />
                <User className="absolute top-9 left-3 text-gray-400" />
              </div>

              <div className="flex flex-col gap-1 relative">
                <label className="font-medium">Email</label>
                <input
                  type="text"
                  value={selectedUser.email ?? ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="w-full pl-10 py-2.5 border rounded-lg"
                />
                <Mail className="absolute top-9 left-3 text-gray-400" />
              </div>

              <div className="flex flex-col gap-1 relative">
                <label className="font-medium">Phone</label>
                <input
                  type="text"
                  value={selectedUser.phone ?? ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, phone: e.target.value })
                  }
                  className="w-full pl-10 py-2.5 border rounded-lg"
                />
                <Phone className="absolute top-9 left-3 text-gray-400" />
              </div>

              <div className="flex flex-col gap-1 relative">
                <label className="font-medium">Password</label>

                <input
                  type={showPassword ? "text" : "password"}
                  value={selectedUser.password ?? ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      password: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-10 py-2.5 border rounded-lg"
                />

                <img
                  src={PasswordIcon}
                  className="absolute top-9 left-3 w-6 h-6"
                  alt="pwd"
                />

                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-9"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              <div className="flex flex-col gap-1 relative">
                <label className="font-medium">Address</label>
                <input
                  type="text"
                  value={selectedUser.address ?? ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      address: e.target.value,
                    })
                  }
                  className="w-full pl-10 py-2.5 border rounded-lg"
                />
                <MapPin className="absolute top-9 left-3 text-gray-400" />
              </div>

              {!isEditing && (
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Type of User
                  </label>

                  <div className="flex gap-2">
                    {["user", "admin"].map((role) => (
                      <button
                        key={role}
                        onClick={() =>
                          setSelectedUser({ ...selectedUser, role })
                        }
                        className={`flex-1 border rounded py-2 text-sm font-medium ${
                          selectedUser.role === role
                            ? "border-orange-500"
                            : "bg-white text-gray-600"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSaveUser}
              className="w-full bg-orange-500 hover:bg-orange-600 font-semibold py-2 mt-5 rounded-lg"
            >
              {isEditing ? "Update" : "Add User"}
            </button>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Delete User</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
