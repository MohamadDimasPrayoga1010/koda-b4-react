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
      setAlert({ type: "success", message: "Add User Success" });
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
      setAlert({ type: "success", message: "Update User Success" });
     setIsModalOpen(false)
      if (isEditing) {
        fetchUsers(currentPage, search);
      } else {
        setCurrentPage(1);
        fetchUsers(1, search);
      }
    } catch (err) {
      console.error("handleSaveUser error:", err);
      setAlert({
        message: err?.response?.data?.message || "Save user failed",
        type: "error",
      });
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
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1A0F0A] mb-2">User List</h1>
          <div className="h-1.5 w-24 bg-gradient-to-r from-[#D4A574] to-transparent rounded-full"></div>
        </div>

        <Loading
          show={loading}
          text={isEditing ? "Updating user..." : "Saving new user..."}
        />
        <AuthAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ message: "", type: "success" })}
        />

        <div className="my-6 flex flex-wrap justify-between items-end gap-4">
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 bg-gradient-to-r from-[#D4A574] to-[#8B6F47] hover:from-[#8B6F47] hover:to-[#D4A574] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus size={20} /> Add User
          </button>

          <div className="flex flex-wrap items-end gap-4">
            <div className="relative w-full md:w-[280px]">
              <label className="block text-sm font-semibold text-[#6B5744] mb-2">
                Search User
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter user name"
                className="w-full pl-4 pr-12 py-2.5 border-2 border-[#D4A574]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all duration-300"
              />
              <Search
                className="absolute right-4 top-11 text-[#8B7355]"
                size={20}
              />
            </div>

            <button className="flex items-center gap-2 bg-white border-2 border-[#D4A574]/30 hover:bg-[#F5E6D3] text-[#6B5744] px-6 py-2.5 rounded-xl font-semibold transition-all duration-300">
              <Filter size={20} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border-2 border-[#D4A574]/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#F5E6D3] to-[#FAF8F5] border-b-2 border-[#D4A574]/20 text-[#6B5744] text-sm">
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#D4A574] rounded"
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
                  <th key={i} className="px-6 py-4 font-bold">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`border-b border-[#D4A574]/10 hover:bg-[#FAF8F5] transition-all duration-200 text-sm ${
                    idx % 2 === 0 ? "bg-white" : "bg-[#FAF8F5]/30"
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
                      src={
                        item.profile?.image ||
                        item.image ||
                        "/images/testiImg/profile.png"
                      }
                      alt={item.fullname}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-[#D4A574]/20"
                    />
                  </td>

                  <td className="px-6 py-4 font-semibold text-[#6B5744]">
                    {item.fullname}
                  </td>

                  <td className="px-6 py-4 text-[#8B7355]">
                    {item.profile?.phone || item.phone || "-"}
                  </td>

                  <td className="px-6 py-4 text-[#8B7355]">
                    {item.profile?.address || item.address || "-"}
                  </td>

                  <td className="px-6 py-4 text-[#8B7355]">{item.email}</td>

                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEditUser(item)}
                      className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110"
                      title="Edit user"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110"
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap justify-between items-center px-6 py-5 bg-white border-2 border-t-0 border-[#D4A574]/10 rounded-b-2xl shadow-lg">
          <p className="text-sm text-[#6B5744] font-medium">
            Show{" "}
            <span className="font-bold text-[#8B6F47]">
              {filteredUsers.length}
            </span>{" "}
            users of{" "}
            <span className="font-bold text-[#8B6F47]">{users.length}</span>{" "}
            total
          </p>

          <div className="flex gap-2 items-center mt-4 md:mt-0">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 text-sm text-[#6B5744] hover:bg-[#F5E6D3] rounded-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 font-semibold ${
                  currentPage === page
                    ? "bg-gradient-to-r from-[#D4A574] to-[#8B6F47] text-white shadow-md"
                    : "text-[#6B5744] hover:bg-[#F5E6D3]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 text-sm text-[#6B5744] hover:bg-[#F5E6D3] rounded-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && selectedUser && (
        <div className="absolute right-0 top-[26px] w-[600px] flex items-end justify-end p-4 z-50">
          <div className="bg-white shadow-2xl w-full max-w-xl max-h-screen overflow-y-auto rounded-2xl border-2 border-[#D4A574]/20">
            <div className="flex justify-between items-center p-6 sticky top-0 bg-gradient-to-r from-[#F5E6D3] to-[#FAF8F5] border-b-2 border-[#D4A574]/20 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-[#1A0F0A]">
                {isEditing ? "Update User" : "Insert User"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8B7355] hover:text-[#6B5744] transition-colors p-2 hover:bg-white/50 rounded-lg"
              >
                <img src={Xcircle} alt="close-icon" className="w-6 h-6" />
              </button>
            </div>

            <form className="p-6">
              <div className="flex flex-col mb-5">
                <label className="block text-sm font-semibold mb-3 text-[#6B5744]">
                  Image User
                </label>

                <div className="flex items-center gap-4">
                  <img
                    src={
                      selectedUser.file
                        ? URL.createObjectURL(selectedUser.file)
                        : selectedUser.image || ImgUpload
                    }
                    className="w-20 h-20 rounded-xl object-cover border-2 border-[#D4A574]/20"
                    alt="preview"
                  />

                  <div>
                    <input
                      type="file"
                      onChange={handleFileInput}
                      className="hidden"
                      id="upload"
                    />

                    <label
                      htmlFor="upload"
                      className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#D4A574] to-[#8B6F47] hover:from-[#8B6F47] hover:to-[#D4A574] text-white rounded-lg cursor-pointer transition-all duration-300 font-medium"
                    >
                      Upload Image
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2 relative">
                  <label className="font-semibold text-sm text-[#6B5744]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={selectedUser.fullname ?? ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        fullname: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 border-2 border-[#D4A574]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all"
                    placeholder="Enter full name"
                  />
                  <User
                    className="absolute top-[45px] left-3 text-[#8B7355]"
                    size={18}
                  />
                </div>

                <div className="flex flex-col gap-2 relative">
                  <label className="font-semibold text-sm text-[#6B5744]">
                    Email
                  </label>
                  <input
                    type="text"
                    value={selectedUser.email ?? ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 border-2 border-[#D4A574]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all"
                    placeholder="Enter email"
                  />
                  <Mail
                    className="absolute top-[45px] left-3 text-[#8B7355]"
                    size={18}
                  />
                </div>

                <div className="flex flex-col gap-2 relative">
                  <label className="font-semibold text-sm text-[#6B5744]">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={selectedUser.phone ?? ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        phone: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 border-2 border-[#D4A574]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all"
                    placeholder="Enter phone number"
                  />
                  <Phone
                    className="absolute top-[45px] left-3 text-[#8B7355]"
                    size={18}
                  />
                </div>

                <div className="flex flex-col gap-2 relative">
                  <label className="font-semibold text-sm text-[#6B5744]">
                    Password
                  </label>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={selectedUser.password ?? ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        password: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-12 py-3 border-2 border-[#D4A574]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all"
                    placeholder="Enter password"
                  />

                  <img
                    src={PasswordIcon}
                    className="absolute top-[45px] left-3 w-5 h-5 opacity-60"
                    alt="pwd"
                  />

                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-[45px] text-[#8B7355] hover:text-[#6B5744] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="flex flex-col gap-2 relative">
                  <label className="font-semibold text-sm text-[#6B5744]">
                    Address
                  </label>
                  <input
                    type="text"
                    value={selectedUser.address ?? ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        address: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 border-2 border-[#D4A574]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all"
                    placeholder="Enter address"
                  />
                  <MapPin
                    className="absolute top-[45px] left-3 text-[#8B7355]"
                    size={18}
                  />
                </div>

                {!isEditing && (
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-[#6B5744]">
                      Type of User
                    </label>

                    <div className="flex gap-3">
                      {["user", "admin"].map((role) => (
                        <button
                          key={role}
                          onClick={() =>
                            setSelectedUser({ ...selectedUser, role })
                          }
                          className={`flex-1 border-2 rounded-xl py-3 text-sm font-semibold capitalize transition-all duration-200 ${
                            selectedUser.role === role
                              ? "bg-gradient-to-r from-[#D4A574] to-[#8B6F47] text-white border-[#D4A574]"
                              : "border-[#D4A574]/30 bg-white text-[#6B5744] hover:bg-[#F5E6D3]"
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
                className="w-full bg-gradient-to-r from-[#D4A574] to-[#8B6F47] hover:from-[#8B6F47] hover:to-[#D4A574] text-white font-bold py-4 mt-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isEditing ? "Update" : "Add User"}
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl w-[450px] shadow-2xl border-2 border-[#D4A574]/20">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={28} />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-[#1A0F0A]">
                Delete User
              </h2>
              <p className="text-[#6B5744]">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-[#D4A574]/30 hover:bg-[#F5E6D3] transition-all duration-300 font-semibold text-[#6B5744]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
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
