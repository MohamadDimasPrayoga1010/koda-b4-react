import React, { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, X } from "lucide-react";
import GroupIcon from "/images/Group.png";
import ImgUpload from "/images/imgupload.png";

const UserList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      image: "/images/testiImg/profile.png",
      fullname: "Eleanor Pena",
      phone: "(205) 555-0100",
      address: "3517 W. Gray St. Utica, Pennsylvania 57867",
      email: "eleanor.pena@gmail.com",
      password: "123456",
      type: "Normal User",
    },
    {
      id: 2,
      image: "/images/testiImg/profile.png",
      fullname: "Ronald Richards",
      phone: "(205) 555-0100",
      address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
      email: "cikaracak@gmail.com",
      password: "123456",
      type: "Admin",
    },
  ]);

  const handleAddUser = () => {
    setIsEditing(false);
    setSelectedUser({
      id: null,
      image: "",
      fullname: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      type: "Normal User",
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((item) => item.id !== id));
  };

  const handleSaveUser = () => {
    if (isEditing) {
      setUsers(users.map((u) => (u.id === selectedUser.id ? selectedUser : u)));
    } else {
      const newUser = {
        ...selectedUser,
        id: Date.now(),
        image: selectedUser.image || "/images/testiImg/profile.png",
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter((item) =>
    item.fullname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">User List</h1>

        <div className="my-4 flex flex-wrap justify-between items-end gap-4">
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <Plus size={20} /> Add User
          </button>

          <div className="flex flex-wrap items-end gap-4">
            <div className="relative w-full md:w-[250px]">
              <label
                htmlFor="search"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Search User
              </label>
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter user name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Search
                className="absolute right-3 top-10 text-gray-400"
                size={20}
              />
            </div>

            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition">
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
                      src={item.image}
                      alt={item.fullname}
                      className="w-10 h-10 rounded object-cover"
                    />
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {item.fullname}
                  </td>
                  <td className="px-6 py-3 text-gray-600">{item.phone}</td>
                  <td className="px-6 py-3 text-gray-600">{item.address}</td>
                  <td className="px-6 py-3 text-gray-600">{item.email}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <button
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded transition"
                      title="History"
                    >
                      <img src={GroupIcon} alt="group-icon" className="w-16" />
                    </button>
                    <button
                      onClick={() => handleEditUser(item)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded transition"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                      title="Delete"
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
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition">
              Prev
            </button>
            {[1, 2, 3].map((page) => (
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

      {isModalOpen && selectedUser && (
        <div className="absolute right-0 top-[26px] w-[600px] bg-opacity-50 flex items-end justify-end p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full p-6 max-h-screen overflow-y-auto mt-10 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {isEditing
                ? selectedUser.fullname || "Update User"
                : "Insert User"}
            </h2>

            <div className="flex flex-col mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Image User
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imageInput"
              />
              <img
                src={ImgUpload}
                alt="user"
                className="w-20 h-20 rounded object-cover mb-2"
              />
              <input
                type="file"
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    image: URL.createObjectURL(e.target.files[0]),
                  })
                }
                className="hidden"
                id="upload"
              />
              <label
                htmlFor="upload"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-sm font-semibold rounded-lg cursor-pointer w-[80px]"
              >
                Upload
              </label>
            </div>

            <div className="space-y-3">
              {[
                { label: "Full Name", key: "fullname", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Phone", key: "phone", type: "text" },
                { label: "Password", key: "password", type: "password" },
                { label: "Address", key: "address", type: "text" },
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={selectedUser[field.key]}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        [field.key]: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              ))}

              {!isEditing && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Type of User
                  </label>
                  <div className="flex gap-2">
                    {["Normal User", "Admin"].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setSelectedUser({ ...selectedUser, type: type })
                        }
                        className={`flex-1 border rounded py-2 text-sm font-medium transition ${
                          selectedUser.type === type
                            ? " border-orange-500"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSaveUser}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 mt-5 rounded-lg transition"
            >
              {isEditing ? "Update" : "Add User"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
