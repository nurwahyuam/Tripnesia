import React, { useState } from "react";
import { useCabins } from "../../hooks/useCabins";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import InputForm from "../../components/InputForm";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import AllCabinsIcon from "../../assets/icons/Cabins.svg";
import { Calendar, Pencil, Plus, Trash2 } from "lucide-react";
const URL_API = import.meta.env.VITE_API_URL;

const Cabins = () => {
  const { ships, cabins, loading, error, createCabin, updateCabin, deleteCabin, message, clearMessage } = useCabins();

  const { currentData: currentCabins, currentPage, totalPages, goToPage, nextPage, prevPage, setCurrentPage } = usePagination(cabins, 5);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [otherFields, setOtherFields] = useState([{ key: "", value: "" }]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const [formData, setFormData] = useState({
    ship_id: "",
    date_start: "",
    date_end: "",
    type: "private room",
    name: "",
    pax: "",
    bed: "",
    other: "",
    price: "",
  });

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const openCreateModal = () => {
    setFormData({
      ship_id: ships.length > 0 ? ships[0]._id : "",
      date_start: "",
      date_end: "",
      type: "private room",
      name: "",
      pax: "",
      bed: "",
      price: "",
    });
    setOtherFields([{ key: "", value: "" }]);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (cabin) => {
    setFormData({
      ship_id: cabin.ship_id?._id || cabin.ship_id || "",
      date_start: formatDateForInput(cabin.date_start),
      date_end: formatDateForInput(cabin.date_end),
      type: cabin.type || "private room",
      name: cabin.name || "",
      pax: cabin.pax != null ? String(cabin.pax) : "",
      bed: cabin.bed || "",
      price: cabin.price != null ? String(cabin.price) : "",
    });
    const otherFromCabin = cabin.other && Array.isArray(cabin.other) ? cabin.other.map((item) => ({ key: item.key || "", value: item.value || "" })) : [{ key: "", value: "" }];
    const existingPreviews = (cabin.images || []).map((url) => ({
      id: url, // gunakan URL sebagai ID
      url: `${URL_API}${url}`,
      isExisting: true, // flag untuk bedakan
    }));
    setImagePreviews(existingPreviews);
    setOtherFields(otherFromCabin);
    setSelectedCabin(cabin);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (cabin) => {
    setSelectedCabin(cabin);
    setIsDeleteModalOpen(true);
  };

  const closeCreateModal = () => {
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setImagePreviews([]);
    setIsCreateModalOpen(false);
  };
  const closeEditModal = () => {
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setImagePreviews([]);
    setIsEditModalOpen(false);
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle tambah gambar
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) return;

    if (imagePreviews.length + files.length > 5) {
      alert("Maksimal 5 gambar.");
      return;
    }

    const newPreviews = files.map((file) => ({
      id: generateId(),
      file,
      url: URL.createObjectURL(file),
    }));

    // Gabungkan: existing tetap ada, tambahkan yang baru
    setImagePreviews((prev) => {
      const existing = prev.filter((p) => p.isExisting);
      const nonExisting = prev.filter((p) => !p.isExisting);
      // Opsional: batasi total
      const combined = [...existing, ...nonExisting, ...newPreviews].slice(0, 5);
      return combined;
    });
  };

  // Handle hapus gambar
  const handleRemoveImage = (idToRemove) => {
    setImagePreviews((prev) => {
      const item = prev.find((p) => p.id === idToRemove);
      if (item && !item.isExisting) {
        URL.revokeObjectURL(item.url);
        return prev.filter((p) => p.id !== idToRemove);
      }
      return prev; // jangan hapus existing
    });
  };

  const addOtherField = () => {
    setOtherFields((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeOtherField = (index) => {
    setOtherFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOtherChange = (index, field, value) => {
    setOtherFields((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const parsedPax = formData.pax !== "" ? Number(formData.pax) : undefined;
    const parsedPrice = formData.price !== "" ? Number(formData.price) : undefined;

    if (isNaN(parsedPax) || isNaN(parsedPrice)) {
      alert("Pax dan harga harus berupa angka.");
      return;
    }

    const payload = new FormData();
    Object.entries({
      ship_id: formData.ship_id,
      date_start: formData.date_start,
      date_end: formData.date_end,
      type: formData.type,
      name: formData.name,
      pax: parsedPax,
      bed: formData.bed,
      price: parsedPrice,
    }).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        payload.append(key, value);
      }
    });

    // Tambahkan ke payload
    const validOther = otherFields.filter((field) => field.key.trim() && field.value.trim()).map((field) => ({ key: field.key.trim(), value: field.value.trim() }));

    if (validOther.length > 0) {
      payload.append("other", JSON.stringify(validOther));
    }

    // Di handleCreateSubmit & handleEditSubmit
    const newImageFiles = imagePreviews.filter((preview) => !preview.isExisting);
    newImageFiles.forEach((item) => {
      payload.append("images", item.file);
    });

    try {
      await createCabin(payload);
      closeCreateModal();
      setCurrentPage(1);
    } catch {
      alert("Gagal membuat kabin.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const parsedPax = formData.pax !== "" ? Number(formData.pax) : undefined;
    const parsedPrice = formData.price !== "" ? Number(formData.price) : undefined;

    if (isNaN(parsedPax) || isNaN(parsedPrice)) {
      alert("Pax dan harga harus berupa angka.");
      return;
    }

    const payload = new FormData();
    Object.entries({
      ship_id: formData.ship_id,
      date_start: formData.date_start,
      date_end: formData.date_end,
      type: formData.type,
      name: formData.name,
      pax: parsedPax,
      bed: formData.bed,
      price: parsedPrice,
    }).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        payload.append(key, value);
      }
    });

    // Tambahkan ke payload
    const validOther = otherFields.filter((field) => field.key.trim() && field.value.trim()).map((field) => ({ key: field.key.trim(), value: field.value.trim() }));

    if (validOther.length > 0) {
      payload.append("other", JSON.stringify(validOther));
    }

    // Di handleCreateSubmit & handleEditSubmit
    const newImageFiles = imagePreviews.filter((preview) => !preview.isExisting);
    newImageFiles.forEach((item) => {
      payload.append("images", item.file);
    });

    try {
      await updateCabin(selectedCabin._id, payload);
      closeEditModal();
    } catch {
      alert("Gagal memperbarui kabin.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCabin(selectedCabin._id);
      closeDeleteModal();
      setCurrentPage(1);
    } catch {
      alert("Gagal menghapus kabin.");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto pt-6">
        <p className="text-center text-red-600">Error: {error}</p>
      </div>
    );
  }

  const formatRupiah = (value) => {
    if (value == null) return "–";
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
          <h1 className="text-2xl font-bold text-gray-800">Cabins</h1>
          <p className="text-gray-500 mt-1">Manage cabin inventory and details</p>
        </div>
        <button onClick={openCreateModal} className="bg-[#01ACD7] hover:opacity-90 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 transition">
          <Plus size={18} /> Add Cabin
        </button>
      </div>

      {loading ? (
        <p className="text-center mt-5">Loading cabins...</p>
      ) : cabins.length === 0 ? (
        <p className="text-center mt-5">No cabins found.</p>
      ) : (
        <>
          <Table title="All Cabins" src={AllCabinsIcon}>
            <thead className="text-left text-gray-500 text-sm font-medium">
              <tr className="border-b border-gray-300">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Ship</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3 text-center">Price</th>
                <th className="px-6 py-3 text-center">Period</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {currentCabins.map((cabin) => (
                <tr key={cabin._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-700">{cabin.name}</td>
                  <td className="px-6 py-4 text-gray-700">{cabin.ship_id?.name || "–"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${cabin.type === "private room" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>{cabin.type}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">{formatRupiah(cabin.price)}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm text-center">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {cabin.date_start && cabin.date_end ? `${formatDateForInput(cabin.date_start)} to ${formatDateForInput(cabin.date_end)}` : "–"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => openEditModal(cabin)} className="text-blue-600 hover:text-blue-300 transition-colors" title="Edit">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => openDeleteModal(cabin)} className="text-red-600 hover:text-red-300 transition-colors" title="Delete">
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
        <Modal title="Add New Cabin" onClose={closeCreateModal}>
          <form onSubmit={handleCreateSubmit} className="space-y-8 max-h-[80vh] overflow-y-auto p-2" encType="multipart/form-data">
            <InputForm label="Cabin Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <InputForm label="Ship" as="select" name="ship_id" value={formData.ship_id} onChange={handleInputChange} required options={ships.map((ship) => ({ value: ship._id, label: ship.name }))} />
            <InputForm
              label="Type"
              as="select"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              options={[
                { value: "private room", label: "Private Room" },
                { value: "shared room", label: "Shared Room" },
              ]}
            />
            <InputForm label="Max Pax" name="pax" type="number" value={formData.pax} onChange={handleInputChange} />
            <InputForm label="Bed Type" name="bed" value={formData.bed} onChange={handleInputChange} />
            {/* Other Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Features</label>
              <div className="space-y-2">
                {otherFields.map((field, index) => (
                  <div key={index} className="flex gap-2">
                    <input type="text" placeholder="Key (e.g., AC, WiFi)" value={field.key} onChange={(e) => handleOtherChange(index, "key", e.target.value)} className="flex-1 p-2 border border-gray-300 rounded" />
                    <input type="text" placeholder="Value (e.g., Yes, No)" value={field.value} onChange={(e) => handleOtherChange(index, "value", e.target.value)} className="flex-1 p-2 border border-gray-300 rounded" />
                    <button
                      type="button"
                      onClick={() => removeOtherField(index)}
                      className="px-3 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      disabled={otherFields.length === 1} // minimal 1 field
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addOtherField} className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                + Add Feature
              </button>
            </div>
            <InputForm label="Price (Rp)" name="price" type="number" value={formData.price} onChange={handleInputChange} required />
            <InputForm label="Start Date" name="date_start" type="date" value={formData.date_start} onChange={handleInputChange} required />
            <InputForm label="End Date" name="date_end" type="date" value={formData.date_end} onChange={handleInputChange} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cabin Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {imagePreviews.map((preview) => (
                  <div key={preview.id} className="relative w-20 h-20">
                    <img src={preview.url} alt="Preview" className="w-full h-full object-cover rounded border" />
                    <button type="button" onClick={() => handleRemoveImage(preview.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600">
                      <span className="text-xs">×</span>
                    </button>
                  </div>
                ))}
                {imagePreviews.length === 0 && <p className="text-gray-500 text-sm">No images selected</p>}
              </div>
              <label className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer text-sm font-medium">
                + Add Image
                <input type="file" multiple accept="image/*" onChange={handleAddImages} className="hidden" />
              </label>
              <p className="text-xs text-gray-500 mt-1">Supported: JPG, PNG. Max 5 images.</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeCreateModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#01ACD7] text-white rounded hover:bg-[#019bc4]">
                Create Cabin
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedCabin && (
        <Modal title="Edit Cabin" onClose={closeEditModal}>
          <form onSubmit={handleEditSubmit} className="space-y-8 max-h-[80vh] overflow-y-auto p-2" encType="multipart/form-data">
            <InputForm label="Cabin Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <InputForm label="Ship" as="select" name="ship_id" value={formData.ship_id} onChange={handleInputChange} required options={ships.map((ship) => ({ value: ship._id, label: ship.name }))} />
            <InputForm
              label="Type"
              as="select"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              options={[
                { value: "private room", label: "Private Room" },
                { value: "shared room", label: "Shared Room" },
              ]}
            />
            <InputForm label="Max Pax" name="pax" type="number" value={formData.pax} onChange={handleInputChange} />
            <InputForm label="Bed Type" name="bed" value={formData.bed} onChange={handleInputChange} />
            {/* Other Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Features</label>
              <div className="space-y-2">
                {otherFields.map((field, index) => (
                  <div key={index} className="flex gap-2">
                    <input type="text" placeholder="Key (e.g., AC, WiFi)" value={field.key} onChange={(e) => handleOtherChange(index, "key", e.target.value)} className="flex-1 p-2 border border-gray-300 rounded" />
                    <input type="text" placeholder="Value (e.g., Yes, No)" value={field.value} onChange={(e) => handleOtherChange(index, "value", e.target.value)} className="flex-1 p-2 border border-gray-300 rounded" />
                    <button
                      type="button"
                      onClick={() => removeOtherField(index)}
                      className="px-3 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      disabled={otherFields.length === 1} // minimal 1 field
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addOtherField} className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                + Add Feature
              </button>
            </div>
            <InputForm label="Price (Rp)" name="price" type="number" value={formData.price} onChange={handleInputChange} required />
            <InputForm label="Start Date" name="date_start" type="date" value={formData.date_start} onChange={handleInputChange} required />
            <InputForm label="End Date" name="date_end" type="date" value={formData.date_end} onChange={handleInputChange} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cabin Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {imagePreviews.map((preview) => (
                  <div key={preview.id} className="relative w-20 h-20">
                    <img src={preview.url} alt="Preview" className="w-full h-full object-cover rounded border" />
                    {!preview.isExisting && (
                      <button type="button" onClick={() => handleRemoveImage(preview.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600">
                        <span className="text-xs">×</span>
                      </button>
                    )}
                  </div>
                ))}
                {imagePreviews.length === 0 && <p className="text-gray-500 text-sm">No images selected</p>}
              </div>
              <label className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer text-sm font-medium">
                + Add Image
                <input type="file" multiple accept="image/*" onChange={handleAddImages} className="hidden" />
              </label>
              <p className="text-xs text-gray-500 mt-1">Supported: JPG, PNG. Max 5 images.</p>
            </div>
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
      {isDeleteModalOpen && selectedCabin && (
        <Modal title="Confirm Delete" onClose={closeDeleteModal}>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete cabin <strong>{selectedCabin.name}</strong>? This action cannot be undone.
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

export default Cabins;
