import React, { useState } from "react";
import { Pencil, Plus, ShieldAlert, ShieldCheck, Trash2, X } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import AllUsers from "../../assets/icons/Users.svg";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";

const Users = () => {
  const { users, loading, error, createUser, updateUser, deleteUser, message, clearMessage } = useUsers();
  const { currentData: currentUsers, currentPage, totalPages, goToPage, nextPage, prevPage, setCurrentPage } = usePagination(users, 5);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "1234567890",
    number_telephone: "",
    role: "customer",
    support: true,
  });

  // === Modal & Form Handlers (sama seperti sebelumnya) ===
  const getInitials = (name) =>
    name
      .trim() // hapus spasi berlebih di awal/akhir
      .split(" ")
      .filter(Boolean) // hapus elemen kosong (spasi ganda)
      .slice(0, 2) // ambil maksimal 2 kata pertama
      .map((n) => n[0].toUpperCase()) // ambil huruf pertama dari tiap kata
      .join("");

  const openCreateModal = () => {
    setFormData({ name: "", email: "", number_telephone: "", password: "1234567890", role: "customer", support: true });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      number_telephone: user.number_telephone || "",
      role: user.role,
      support: user.support,
    });
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeCreateModal = () => setIsCreateModalOpen(false);
  const closeEditModal = () => setIsEditModalOpen(false);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      closeCreateModal();
      setCurrentPage(1);
    } catch {
      alert("Failed to create user");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser._id, formData);
      closeEditModal();
    } catch {
      alert("Failed to update user");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(selectedUser._id);
      closeDeleteModal();
      setCurrentPage(1);
    } catch {
      alert("Failed to delete user");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto pt-6">
        <p className="text-center text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {message && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-md text-white z-50 animate-fadeIn ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`} onClick={clearMessage}>
          {message.text}
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <p className="text-gray-500 mt-1">Manage user accounts and permissions</p>
        </div>
        <button onClick={openCreateModal} className="bg-[#01ACD7] hover:opacity-90 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 transition">
          <Plus size={18} /> Add User
        </button>
      </div>

      {loading ? (
        <p className="text-center mt-5">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center mt-5">No users found.</p>
      ) : (
        <>
          <Table title="All Users" src={AllUsers}>
            <thead className="text-left text-gray-500 text-sm font-medium">
              <tr className="border-b border-gray-300">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Join Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-800 text-sm">{getInitials(user.name)}</div>
                      <div>
                        <div className="font-semibold text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-500">✉ {user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{user.number_telephone || "–"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        user.role === "admin" ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-green-100 text-green-700 border border-green-200"
                      }`}
                    >
                      {user.support === true ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />} {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEditModal(user)} className=" text-blue-600 hover:text-blue-300 transition-colors" title="Edit">
                        <Pencil size={18} className="" />
                      </button>
                      <button onClick={() => openDeleteModal(user)} className="text-red-600 hover:text-red-300 transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* === Pagination Controls === */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onNext={nextPage} onPrev={prevPage} onPageChange={goToPage} />
        </>
      )}

      {/* Modals (Create, Edit, Delete) */}
      {isCreateModalOpen && (
        <Modal title="Add New User" onClose={closeCreateModal}>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <InputField label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
            <InputField label="Phone" name="number_telephone" value={formData.number_telephone} onChange={handleInputChange} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeCreateModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#01ACD7] text-white rounded-lg hover:bg-[#019bc4]">
                Add User
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isEditModalOpen && selectedUser && (
        <Modal title="Edit User" onClose={closeEditModal}>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <InputField label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
            <InputField label="Phone" name="number_telephone" value={formData.number_telephone} onChange={handleInputChange} />
            <InputField label="Password" name="password" value={formData.password} onChange={handleInputChange} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeEditModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isDeleteModalOpen && selectedUser && (
        <Modal title="Confirm Delete" onClose={closeDeleteModal}>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={closeDeleteModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="button" onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Users;
