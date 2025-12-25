import React, { useState } from "react";
import { usePromos } from "../../hooks/usePromos";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import InputForm from "../../components/InputForm";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import AllPromos from "../../assets/icons/Promos.svg";
import { Calendar, Pencil, Plus, ShieldAlert, ShieldCheck, Trash2, X } from "lucide-react";

const Promos = () => {
  const { promos, loading, error, createPromo, updatePromo, deletePromo, message, clearMessage } = usePromos();

  console.log(promos);
  const { currentData: currentPromos, currentPage, totalPages, goToPage, nextPage, prevPage, setCurrentPage } = usePagination(promos, 5);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    price: "",
    percentage: "",
    start_date: "",
    end_date: "",
    status: true,
  });

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const openCreateModal = () => {
    setFormData({
      code: "",
      description: "",
      price: "",
      percentage: "",
      start_date: "",
      end_date: "",
      status: true,
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (promo) => {
    let price = "";
    let percentage = "";

    if (promo.discount_type === "fixed") {
      price = promo.discount_value;
    } else if (promo.discount_type === "percentage") {
      percentage = promo.discount_value;
    }

    setFormData({
      code: promo.code || "",
      description: promo.description || "",
      price: price, // string atau number
      percentage: percentage,
      start_date: formatDateForInput(promo.start_date),
      end_date: formatDateForInput(promo.end_date),
      status: promo.status ?? true,
    });
    setSelectedPromo(promo);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (promo) => {
    setSelectedPromo(promo);
    setIsDeleteModalOpen(true);
  };

  const closeCreateModal = () => setIsCreateModalOpen(false);
  const closeEditModal = () => setIsEditModalOpen(false);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handler khusus untuk select status
  const handleStatusChange = (e) => {
    const value = e.target.value === "true";
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const safeParseNumber = (value) => {
    if (value === "" || value == null) return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsedPrice = formData.price !== "" ? Number(formData.price) : undefined;
      const parsedPercentage = formData.percentage !== "" ? Number(formData.percentage) : undefined;

      // Tambahkan validasi: pastikan tidak NaN
      if ((parsedPrice !== undefined && isNaN(parsedPrice)) || (parsedPercentage !== undefined && isNaN(parsedPercentage))) {
        alert("Please enter valid numbers for price or percentage.");
        return;
      }

      const payload = {
        ...formData,
        price: safeParseNumber(formData.price),
        percentage: safeParseNumber(formData.percentage),
      };

      await createPromo(payload);
      closeCreateModal();
      setCurrentPage(1);
    } catch {
      alert("Gagal membuat promo.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!formData.price && !formData.percentage) {
      alert("Please fill either Fixed Price or Percentage Discount.");
      return;
    }

    try {
      const parsedPrice = formData.price !== "" ? Number(formData.price) : undefined;
      const parsedPercentage = formData.percentage !== "" ? Number(formData.percentage) : undefined;

      // Tambahkan validasi: pastikan tidak NaN
      if ((parsedPrice !== undefined && isNaN(parsedPrice)) || (parsedPercentage !== undefined && isNaN(parsedPercentage))) {
        alert("Please enter valid numbers for price or percentage.");
        return;
      }

      const payload = {
        ...formData,
        price: safeParseNumber(formData.price),
        percentage: safeParseNumber(formData.percentage),
      };

      await updatePromo(selectedPromo._id, payload);
      closeEditModal();
    } catch {
      alert("Gagal memperbarui promo.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePromo(selectedPromo._id);
      closeDeleteModal();
      setCurrentPage(1);
    } catch {
      alert("Gagal menghapus promo.");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto pt-6">
        <p className="text-center text-red-600">Error: {error}</p>
      </div>
    );
  }

  // Helper: format Rupiah
  const formatRupiah = (value) => {
    if (!value && value !== 0) return "–";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {message && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-md text-white z-50 ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`} onClick={clearMessage}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Promos</h1>
          <p className="text-gray-500 mt-1">Manage promotional codes and discounts</p>
        </div>
        <button onClick={openCreateModal} className="bg-[#01ACD7] hover:opacity-90 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 transition">
          <Plus size={18} /> Add Promo
        </button>
      </div>

      {loading ? (
        <p className="text-center mt-5">Loading promos...</p>
      ) : promos.length === 0 ? (
        <p className="text-center mt-5">No promos found.</p>
      ) : (
        <>
          <Table title="All Promo Codes" src={AllPromos}>
            <thead className="text-left text-gray-500 text-sm font-medium">
              <tr className="border-b border-gray-300">
                <th className="px-6 py-3 text-left">Code</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-center">Discount Value</th>
                <th className="px-6 py-3 text-center">Valid Period</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {currentPromos.map((promo) => (
                <tr key={promo._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-left font-bold text-gray-600">{promo.code}</td>
                  {/* Type */}
                  <td className="px-6 py-4 text-gray-700">
                    <span className="border border-gray-400 rounded-full px-3 py-1 text-xs font-medium capitalize">{promo.discount_type === "fixed" ? "Fixed Price" : "Percentage"}</span>
                  </td>

                  {/* Discount Value */}
                  <td className="px-6 py-4 text-center text-gray-700">{promo.discount_type === "fixed" ? formatRupiah(promo.discount_value) : `${promo.discount_value}% `}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm text-center flex items-center gap-1 justify-center">
                    <Calendar className="w-4 h-4" />
                    {promo.start_date && promo.end_date ? `${new Date(promo.start_date).toISOString().split("T")[0]} to ${new Date(promo.end_date).toISOString().split("T")[0]}` : "–"}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-center capitalize text-xs">
                    <span className={`font-medium border  rounded-full px-5 py-1 ${promo.status === true ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                      {promo.status === true ? "Active" : "Not Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center  gap-3">
                      <button onClick={() => openEditModal(promo)} className=" text-blue-600 hover:text-blue-300 transition-colors" title="Edit">
                        <Pencil size={18} className="" />
                      </button>
                      <button onClick={() => openDeleteModal(promo)} className="text-red-600 hover:text-red-300 transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination currentPage={currentPage} totalPages={totalPages} onNext={nextPage} onPrev={prevPage} onPageChange={goToPage} />
        </>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Modal title="Create Data Promo" onClose={closeCreateModal}>
          <form onSubmit={handleCreateSubmit} className="space-y-8 max-h-[80vh] overflow-y-auto p-2">
            <InputForm label="Promo Code" name="code" value={formData.code} onChange={handleInputChange} required />
            <InputForm label="Description" as="textarea" name="description" value={formData.description} onChange={handleInputChange} rows={3} required />
            <InputForm label="Fixed Price Discount (Rp)" name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Leave empty if using percentage" />
            <InputForm label="Percentage Discount (%)" name="percentage" type="number" value={formData.percentage} onChange={handleInputChange} placeholder="Leave empty if using fixed price" />
            <InputForm label="Start Date" name="start_date" type="date" value={formData.start_date} onChange={handleInputChange} required />
            <InputForm label="End Date" name="end_date" type="date" value={formData.end_date} onChange={handleInputChange} required />
            <InputForm
              label="Status"
              as="select"
              name="status"
              value={formData.status ? "true" : "false"}
              onChange={handleStatusChange}
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeCreateModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#01ACD7] text-white rounded hover:bg-[#019bc4]">
                Create Promo
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedPromo && (
        <Modal title="Edit Data Promo" onClose={closeEditModal}>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <InputForm label="Promo Code" name="code" value={formData.code} onChange={handleInputChange} required />
            <InputForm label="Description" as="textarea" name="description" value={formData.description} onChange={handleInputChange} rows={3} required />
            <InputForm label="Fixed Price Discount (Rp)" name="price" type="number" value={formData.price} onChange={handleInputChange} />
            <InputForm label="Percentage Discount (%)" name="percentage" type="number" value={formData.percentage} onChange={handleInputChange} />
            <InputForm label="Start Date" name="start_date" type="date" value={formData.start_date} onChange={handleInputChange} required />
            <InputForm label="End Date" name="end_date" type="date" value={formData.end_date} onChange={handleInputChange} required />
            <InputForm
              label="Status"
              as="select"
              name="status"
              value={formData.status ? "true" : "false"}
              onChange={handleStatusChange}
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeEditModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedPromo && (
        <Modal title="Confirm Delete" onClose={closeDeleteModal}>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete promo <strong>{selectedPromo.code}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={closeDeleteModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              Cancel
            </button>
            <button type="button" onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Promos;
