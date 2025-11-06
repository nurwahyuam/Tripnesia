  import React, { useState } from "react";
  import { Plus, Pencil, Trash2, UsersRound } from "lucide-react";
  import { useShips } from "../../hooks/useShips";
  import { usePagination } from "../../hooks/usePagination";
  import Modal from "../../components/Modal";
  import InputForm from "../../components/InputForm";
  import Table from "../../components/Table";
  import Pagination from "../../components/Pagination";
  import ShipsManagement from "../../assets/icons/Ships.svg";

  const Ships = () => {
    const { ships, loading, error, getShipById, createShip, updateShip, deleteShip, message, clearMessage } = useShips();
    const { currentData: currentShips, currentPage, totalPages, goToPage, nextPage, prevPage, setCurrentPage } = usePagination(ships, 5);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedShip, setSelectedShip] = useState(null);
    const [masterImageFile, setMasterImageFile] = useState(null);
    const [additionalImageFiles, setAdditionalImageFiles] = useState([]);

    const [formData, setFormData] = useState({
      ship: {
        type: "private trip",
        merk: "",
        class: "luxury",
        name: "",
        description: "",
        package: [],
        unpackage: [],
        image_ship: "",
        min_pax: 2,
        max_pax: 10,
        status: true,
      },
      schedules: [
        {
          name: "Default Schedule",
          planDays: [{ day: 1, plans: { 1: "" } }],
        },
      ],
      specifications: [],
      facilities: [],
      securityTools: [],
      images: [],
    });

    // --- Modal Handlers ---
    const openCreateModal = () => {
      setFormData({
        ship: {
          type: "private trip",
          merk: "",
          class: "luxury",
          name: "",
          description: "",
          package: [],
          unpackage: [],
          image_ship: "",
          min_pax: 2,
          max_pax: 10,
          status: true,
        },
        schedules: [{ name: "Default Schedule", planDays: [{ day: 1, plans: { 1: "" } }] }],
        specifications: [],
        facilities: [],
        securityTools: [],
      });
      setIsCreateModalOpen(true);
    };

    const openEditModal = async (ship) => {
      try {
        const fullShipData = await getShipById(ship._id);

        const schedulesData = Array.isArray(fullShipData.schedules) && fullShipData.schedules.length > 0 ? fullShipData.schedules : [{ name: "Default Schedule", planDays: [{ day: 1, plans: { 1: "" } }] }];

        const formattedData = {
          ship: {
            type: fullShipData.type || "private trip",
            merk: fullShipData.merk || "",
            class: fullShipData.class || "luxury",
            name: fullShipData.name || "",
            description: fullShipData.description || "",
            package: Array.isArray(fullShipData.package) ? [...fullShipData.package] : [],
            unpackage: Array.isArray(fullShipData.unpackage) ? [...fullShipData.unpackage] : [],
            image_ship: fullShipData.image_ship || "", // URL asli
            min_pax: fullShipData.min_pax || 2,
            max_pax: fullShipData.max_pax || 10,
            status: fullShipData.status || true,
          },
          schedules: schedulesData,
          specifications: Array.isArray(fullShipData.specifications) ? [...fullShipData.specifications] : [],
          facilities: Array.isArray(fullShipData.facilities) ? [...fullShipData.facilities] : [],
          securityTools: Array.isArray(fullShipData.securityTools) ? [...fullShipData.securityTools] : [],
          images: fullShipData.images.map((img) => img.image_ship_url || ""),
        };

        setSelectedShip(fullShipData);
        setFormData(formattedData);
        setMasterImageFile(null); // Reset file baru
        setAdditionalImageFiles(Array(fullShipData.images.length).fill(null)); // Reset file baru
        setIsEditModalOpen(true);
      } catch {
        alert("Gagal memuat data kapal untuk diedit");
      }
    };

    const openDeleteModal = (ship) => {
      setSelectedShip(ship);
      setIsDeleteModalOpen(true);
    };

    const closeCreateModal = () => setIsCreateModalOpen(false);
    const closeEditModal = () => setIsEditModalOpen(false);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    // --- SHIP BASIC ---
    const handleShipChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        ship: { ...prev.ship, [name]: value },
      }));
    };

    const handleNumberChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        ship: { ...prev.ship, [name]: value ? Number(value) : "" },
      }));
    };

    // --- IMAGES ---
    const handleFileChange = (e, isMaster = false, index = null) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("File too large! Max 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed!");
        return;
      }

      if (isMaster) {
        setMasterImageFile(file);
      } else {
        const newFiles = [...additionalImageFiles];
        newFiles[index] = file;
        setAdditionalImageFiles(newFiles);
      }
    };

    const handleAddImage = () => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ""],
      }));
    };

    const handleRemoveImage = (index) => {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    };

    // --- PACKAGE / UNPACKAGE ---
    const addPackageItem = () => {
      setFormData((prev) => ({
        ...prev,
        ship: { ...prev.ship, package: [...prev.ship.package, ""] },
      }));
    };

    const removePackageItem = (index) => {
      setFormData((prev) => {
        const newPackage = prev.ship.package.filter((_, i) => i !== index);
        return { ...prev, ship: { ...prev.ship, package: newPackage } };
      });
    };

    const handlePackageChange = (index, value) => {
      setFormData((prev) => {
        const newPackage = [...prev.ship.package];
        newPackage[index] = value;
        return { ...prev, ship: { ...prev.ship, package: newPackage } };
      });
    };

    const addUnpackageItem = () => {
      setFormData((prev) => ({
        ...prev,
        ship: { ...prev.ship, unpackage: [...prev.ship.unpackage, ""] },
      }));
    };

    const removeUnpackageItem = (index) => {
      setFormData((prev) => {
        const newUnpackage = prev.ship.unpackage.filter((_, i) => i !== index);
        return { ...prev, ship: { ...prev.ship, unpackage: newUnpackage } };
      });
    };

    const handleUnpackageChange = (index, value) => {
      setFormData((prev) => {
        const newUnpackage = [...prev.ship.unpackage];
        newUnpackage[index] = value;
        return { ...prev, ship: { ...prev.ship, unpackage: newUnpackage } };
      });
    };

    const handleScheduleNameChange = (value) => {
      setFormData((prev) => {
        // Pastikan schedules adalah array
        const currentSchedules = Array.isArray(prev.schedules) ? prev.schedules : [];
        const newSchedules = [...currentSchedules];
        if (newSchedules[0]) {
          newSchedules[0] = { ...newSchedules[0], name: value };
        } else {
          newSchedules.push({ name: value, planDays: [{ day: 1, plans: { 1: "" } }] });
        }
        return { ...prev, schedules: newSchedules };
      });
    };

    const handleAddPlanDay = () => {
      setFormData((prev) => {
        const newSchedules = [...prev.schedules];
        const lastDay = newSchedules[0].planDays.slice(-1)[0]?.day || 0;
        const newDay = {
          day: lastDay + 1,
          plans: { 1: "" },
        };
        newSchedules[0].planDays.push(newDay);
        return { ...prev, schedules: newSchedules };
      });
    };

    const handleRemovePlanDay = (dayIndex) => {
      setFormData((prev) => {
        const newSchedules = [...prev.schedules];
        newSchedules[0].planDays = newSchedules[0].planDays.filter((_, i) => i !== dayIndex);
        return { ...prev, schedules: newSchedules };
      });
    };

    const handleAddPlanActivity = (dayIndex) => {
      setFormData((prev) => {
        const newSchedules = [...prev.schedules];
        const plans = newSchedules[0].planDays[dayIndex].plans;
        const nextKey = Math.max(...Object.keys(plans).map(Number), 0) + 1;
        plans[nextKey] = "";
        return { ...prev, schedules: newSchedules };
      });
    };

    const handlePlanActivityChange = (dayIndex, key, value) => {
      setFormData((prev) => {
        const newSchedules = [...prev.schedules];
        newSchedules[0].planDays[dayIndex].plans[key] = value;
        return { ...prev, schedules: newSchedules };
      });
    };

    const handleRemovePlanActivity = (dayIndex, key) => {
      setFormData((prev) => {
        const newSchedules = [...prev.schedules];
        delete newSchedules[0].planDays[dayIndex].plans[key];
        return { ...prev, schedules: newSchedules };
      });
    };

    // --- SPECIFICATIONS, FACILITIES, SECURITY TOOLS ---
    const addField = (field) => {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], field === "specifications" ? { name: "", unit: "" } : { name: "" }],
      }));
    };

    const removeField = (field, index) => {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    };

    const handleFieldChange = (field, index, key, value) => {
      setFormData((prev) => {
        const newItems = [...prev[field]];
        newItems[index][key] = value;
        return { ...prev, [field]: newItems };
      });
    };

    // --- SUBMIT HANDLERS ---
    const handleCreateSubmit = async (e) => {
      e.preventDefault();

      // Validasi master image
      if (!masterImageFile) {
        alert("Please upload a master image");
        return;
      }

      const formDataToSend = new FormData();

      // Append ship data sebagai JSON string
      const shipData = {
        ...formData.ship,
        image_ship: undefined,
      };
      formDataToSend.append("ship", JSON.stringify(shipData));

      // Append schedules, specs, dll
      formDataToSend.append("schedules", JSON.stringify(formData.schedules));
      formDataToSend.append("specifications", JSON.stringify(formData.specifications));
      formDataToSend.append("facilities", JSON.stringify(formData.facilities));
      formDataToSend.append("securityTools", JSON.stringify(formData.securityTools));

      // Append FILEs
      formDataToSend.append("masterImage", masterImageFile);

      try {
        await createShip(formDataToSend); // pastikan hook terima FormData
        closeCreateModal();
        setCurrentPage(1);
      } catch {
        alert("Failed to create ship");
      }
    };

    const handleEditSubmit = async (e) => {
      e.preventDefault();

      const formDataToSend = new FormData();

      const shipData = {
        ...formData.ship,
        image_ship: undefined, // akan diupdate via file jika ada
      };
      formDataToSend.append("ship", JSON.stringify(shipData));
      formDataToSend.append("schedules", JSON.stringify(formData.schedules));
      formDataToSend.append("specifications", JSON.stringify(formData.specifications));
      formDataToSend.append("facilities", JSON.stringify(formData.facilities));
      formDataToSend.append("securityTools", JSON.stringify(formData.securityTools));
      formDataToSend.append("images", JSON.stringify(formData.images.map(() => ({}))));

      // Hanya append file jika ada perubahan
      if (masterImageFile) {
        formDataToSend.append("masterImage", masterImageFile);
      }
      additionalImageFiles.forEach((file) => {
        if (file) formDataToSend.append("additionalImages", file);
      });

      try {
        await updateShip(selectedShip._id, formDataToSend);
        closeEditModal();
      } catch {
        alert("Failed to update ship");
      }
    };

    const handleDeleteConfirm = async () => {
      try {
        await deleteShip(selectedShip._id);
        closeDeleteModal();
        setCurrentPage(1);
      } catch {
        alert("Failed to delete ship");
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
        {/* Message Toast */}
        {message && (
          <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-md text-white z-50 animate-fadeIn ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`} onClick={clearMessage}>
            {message.text}
          </div>
        )}

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Ships Management</h1>
            <p className="text-gray-500 mt-1">Manage your fleet of ships</p>
          </div>
          <button onClick={openCreateModal} className="bg-[#01ACD7] hover:opacity-90 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 transition">
            <Plus size={18} /> Add Ship
          </button>
        </div>

        {loading ? (
          <p className="text-center mt-5">Loading ships...</p>
        ) : ships.length === 0 ? (
          <p className="text-center mt-5">No ships found.</p>
        ) : (
          <>
            <Table title="Ships Management" src={ShipsManagement}>
              <thead className="text-left text-gray-500 text-sm font-medium">
                <tr className="border-b border-gray-300">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Capacity</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {currentShips.map((ship) => (
                  <tr key={ship._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">
                      <p className="font-semibold">{ship.name}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700 capitalize text-xs">
                      <span className="font-medium border border-gray-400 rounded-full px-5 py-1">{ship.merk || "Cruise"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-5 py-1 rounded-full text-xs font-medium capitalize ${
                          ship.class === "luxury"
                            ? "bg-sky-100 text-sky-700 border border-sky-200"
                            : ship.class === "superior"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : ship.class === "deluxe"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {ship.class}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-1 font-medium">
                        <UsersRound className="w-5 h-5" />
                        {ship.max_pax}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 capitalize text-xs">
                      <span className={`font-medium border  rounded-full px-5 py-1 ${ship.status === true ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                        {ship.status === true ? "Active" : "Not Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEditModal(ship)} className="text-blue-600 hover:text-blue-300 transition-colors" title="Edit">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => openDeleteModal(ship)} className="text-red-600 hover:text-red-300 transition-colors" title="Delete">
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

        {/* CREATE MODAL */}
        {isCreateModalOpen && (
          <Modal title="Add New Ship" onClose={closeCreateModal}>
            <form onSubmit={handleCreateSubmit} className="space-y-8 max-h-[80vh] overflow-y-auto p-2">
              {/* SHIP BASIC INFO */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputForm label="Name" name="name" value={formData.ship.name} onChange={handleShipChange} required />
                  <InputForm
                    label="Type"
                    as="select"
                    name="type"
                    value={formData.ship.type}
                    onChange={handleShipChange}
                    options={[
                      { value: "private trip", label: "Private Trip" },
                      { value: "open trip", label: "Open Trip" },
                    ]}
                    required
                  />
                  <InputForm label="Merk" name="merk" value={formData.ship.merk} onChange={handleShipChange} required />
                  <InputForm
                    label="Class"
                    as="select"
                    name="class"
                    value={formData.ship.class}
                    onChange={handleShipChange}
                    options={[
                      { value: "standard", label: "Standard" },
                      { value: "superior", label: "Superior" },
                      { value: "deluxe", label: "Deluxe" },
                      { value: "luxury", label: "Luxury" },
                    ]}
                    required
                  />
                  <InputForm label="Min Pax" type="number" name="min_pax" value={formData.ship.min_pax} onChange={handleNumberChange} min="1" required />
                  <InputForm label="Max Pax" type="number" name="max_pax" value={formData.ship.max_pax} onChange={handleNumberChange} min="1" required />
                  <InputForm
                    label="Status"
                    as="select"
                    name="status"
                    value={String(formData.ship.status)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ship: { ...prev.ship, status: e.target.value === "true" },
                      }))
                    }
                    options={[
                      { value: "true", label: "Active" },
                      { value: "false", label: "Inactive" },
                    ]}
                    required
                  />
                  <div className="md:col-span-2">
                    <InputForm label="Description" as="textarea" name="description" value={formData.ship.description} onChange={handleShipChange} required rows={3} />
                  </div>
                </div>
              </div>

              {/* MASTER IMAGE */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Master Image *</h3>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, true)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                {/* Preview */}
                {formData.ship.image_ship && (
                  <div className="mt-3">
                    <img src={formData.ship.image_ship} alt="Master preview" className="w-24 h-24 object-cover rounded border" />
                  </div>
                )}
              </div>

              {/* PACKAGE & UNPACKAGE */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Details</h3>

                <div className="mb-4">
                  <h4 className="font-medium text-green-700 mb-2">✅ Termasuk dalam Paket</h4>
                  {formData.ship.package.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <InputForm type="text" placeholder={`Item ${index + 1}`} value={item} onChange={(e) => handlePackageChange(index, e.target.value)} className="flex-1" />
                      <button type="button" onClick={() => removePackageItem(index)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addPackageItem} className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    + Add Included Item
                  </button>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-red-700 mb-2">❌ Tidak Termasuk dalam Paket</h4>
                  {formData.ship.unpackage.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <InputForm type="text" placeholder={`Item ${index + 1}`} value={item} onChange={(e) => handleUnpackageChange(index, e.target.value)} className="flex-1" />
                      <button type="button" onClick={() => removeUnpackageItem(index)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addUnpackageItem} className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    + Add Excluded Item
                  </button>
                </div>
              </div>

              {/* SCHEDULE (Hanya 1) */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule</h3>

                <div className="mb-4">
                  <InputForm label="Schedule Name" value={formData.schedules[0]?.name || "Default Schedule"} onChange={(e) => handleScheduleNameChange(e.target.value)} required />
                </div>

                <h4 className="font-medium text-gray-700 mb-3">Plan Days</h4>

                {formData.schedules[0]?.planDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="mb-5 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-800">Day {day.day}</h5>
                      {formData.schedules[0].planDays.length > 1 && (
                        <button type="button" onClick={() => handleRemovePlanDay(dayIndex)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                          Remove Day
                        </button>
                      )}
                    </div>

                    {/* Daftar Aktivitas */}
                    <div className="space-y-3">
                      {Object.entries(day.plans).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-3">
                          <span className="w-10 text-sm font-medium text-gray-600">#{key}</span>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handlePlanActivityChange(dayIndex, key, e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter activity description"
                          />
                          {Object.keys(day.plans).length > 1 && (
                            <button type="button" onClick={() => handleRemovePlanActivity(dayIndex, key)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm whitespace-nowrap">
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button type="button" onClick={() => handleAddPlanActivity(dayIndex)} className="mt-3 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                      + Add Activity
                    </button>
                  </div>
                ))}

                <button type="button" onClick={handleAddPlanDay} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  + Add Day
                </button>
              </div>

              {/* SPECIFICATIONS */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <InputForm type="text" placeholder="Name (e.g., Length)" value={spec.name} onChange={(e) => handleFieldChange("specifications", index, "name", e.target.value)} className="flex-1" />
                    <InputForm type="text" placeholder="Unit (e.g., 26 Metres)" value={spec.unit || ""} onChange={(e) => handleFieldChange("specifications", index, "unit", e.target.value)} className="flex-1" />
                    <button type="button" onClick={() => removeField("specifications", index)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addField("specifications")} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  + Add Specification
                </button>
              </div>

              {/* FACILITIES */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Facilities</h3>
                {formData.facilities.map((fac, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <InputForm type="text" placeholder="Facility Name (e.g., Jacuzzi)" value={fac.name} onChange={(e) => handleFieldChange("facilities", index, "name", e.target.value)} className="flex-1" />
                    <button type="button" onClick={() => removeField("facilities", index)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addField("facilities")} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  + Add Facility
                </button>
              </div>

              {/* SECURITY TOOLS */}
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Tools</h3>
                {formData.securityTools.map((tool, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <InputForm type="text" placeholder="Security Tool (e.g., Life Jackets)" value={tool.name} onChange={(e) => handleFieldChange("securityTools", index, "name", e.target.value)} className="flex-1" />
                    <button type="button" onClick={() => removeField("securityTools", index)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addField("securityTools")} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  + Add Security Tool
                </button>
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeCreateModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#01ACD7] text-white rounded-lg hover:bg-[#019bc4]">
                  Add Ship
                </button>
              </div>
            </form>
          </Modal>
        )}  

        {/* EDIT MODAL */}
        {isEditModalOpen && selectedShip && (
          <Modal title="Edit Ship" onClose={closeEditModal}>
            <form onSubmit={handleEditSubmit} className="space-y-8 max-h-[80vh] overflow-y-auto p-2">
              {/* SHIP BASIC INFO */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputForm label="Name" name="name" value={formData.ship.name} onChange={handleShipChange} required />
                  <InputForm
                    label="Type"
                    as="select"
                    name="type"
                    value={formData.ship.type}
                    onChange={handleShipChange}
                    options={[
                      { value: "private trip", label: "Private Trip" },
                      { value: "open trip", label: "Open Trip" },
                    ]}
                    required
                  />
                  <InputForm label="Merk" name="merk" value={formData.ship.merk} onChange={handleShipChange} required />
                  <InputForm
                    label="Class"
                    as="select"
                    name="class"
                    value={formData.ship.class}
                    onChange={handleShipChange}
                    options={[
                      { value: "standard", label: "Standard" },
                      { value: "superior", label: "Superior" },
                      { value: "deluxe", label: "Deluxe" },
                      { value: "luxury", label: "Luxury" },
                    ]}
                    required
                  />
                  <InputForm label="Min Pax" type="number" name="min_pax" value={formData.ship.min_pax} onChange={handleNumberChange} min="1" required />
                  <InputForm label="Max Pax" type="number" name="max_pax" value={formData.ship.max_pax} onChange={handleNumberChange} min="1" required />
                  <InputForm
                    label="Status"
                    as="select"
                    name="status"
                    value={String(formData.ship.status)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ship: { ...prev.ship, status: e.target.value === "true" },
                      }))
                    }
                    options={[
                      { value: "true", label: "Active" },
                      { value: "false", label: "Inactive" },
                    ]}
                    required
                  />
                  <div className="md:col-span-2">
                    <InputForm label="Description" as="textarea" name="description" value={formData.ship.description} onChange={handleShipChange} required rows={3} />
                  </div>
                </div>
              </div>

              {/* MASTER IMAGE */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Master Image *</h3>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, true)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                {(masterImageFile || formData.ship.image_ship) && (
                  <div className="mt-3">
                    <img
                      src={masterImageFile ? URL.createObjectURL(masterImageFile) : formData.ship.image_ship}
                      alt="Master preview"
                      className="w-24 h-24 object-cover rounded border"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/96?text=No+Image";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* ADDITIONAL IMAGES */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Images</h3>
                {formData.images.map((url, index) => (
                  <div key={index} className="flex flex-col gap-2 mb-4 p-3 border border-gray-200 rounded">
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, false, index)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    {(additionalImageFiles[index] || url) && (
                      <div className="mt-2">
                        <img
                          src={additionalImageFiles[index] ? URL.createObjectURL(additionalImageFiles[index]) : url}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80?text=No+Image";
                          }}
                        />
                      </div>
                    )}
                    <button type="button" onClick={() => handleRemoveImage(index)} className="self-start px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddImage} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  + Add Image
                </button>
              </div>

              {/* PACKAGE & UNPACKAGE */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Details</h3>
                <div className="mb-4">
                  <h4 className="font-medium text-green-700 mb-2">✅ Termasuk dalam Paket</h4>
                  {formData.ship.package.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <InputForm type="text" placeholder={`Item ${index + 1}`} value={item} onChange={(e) => handlePackageChange(index, e.target.value)} className="flex-1" />
                      <button type="button" onClick={() => removePackageItem(index)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addPackageItem} className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    + Add Included Item
                  </button>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium text-red-700 mb-2">❌ Tidak Termasuk dalam Paket</h4>
                  {formData.ship.unpackage.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <InputForm type="text" placeholder={`Item ${index + 1}`} value={item} onChange={(e) => handleUnpackageChange(index, e.target.value)} className="flex-1" />
                      <button type="button" onClick={() => removeUnpackageItem(index)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addUnpackageItem} className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    + Add Excluded Item
                  </button>
                </div>
              </div>

              {/* SCHEDULE (Hanya 1) - SAMA SEPERTI CREATE */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule</h3>

                <div className="mb-4">
                  <InputForm label="Schedule Name" value={formData.schedules[0]?.name || "Default Schedule"} onChange={(e) => handleScheduleNameChange(e.target.value)} required />
                </div>

                <h4 className="font-medium text-gray-700 mb-3">Plan Days</h4>

                {formData.schedules[0]?.planDays?.map((day, dayIndex) => (
                  <div key={dayIndex} className="mb-5 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-800">Day {day.day}</h5>
                      {formData.schedules[0].planDays.length > 1 && (
                        <button type="button" onClick={() => handleRemovePlanDay(dayIndex)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                          Remove Day
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {Object.entries(day.plans).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-3">
                          <span className="w-10 text-sm font-medium text-gray-600">#{key}</span>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handlePlanActivityChange(dayIndex, key, e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter activity description"
                          />
                          {Object.keys(day.plans).length > 1 && (
                            <button type="button" onClick={() => handleRemovePlanActivity(dayIndex, key)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm whitespace-nowrap">
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button type="button" onClick={() => handleAddPlanActivity(dayIndex)} className="mt-3 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                      + Add Activity
                    </button>
                  </div>
                ))}

                <button type="button" onClick={handleAddPlanDay} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  + Add Day
                </button>
              </div>

              {/* SPECIFICATIONS */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <InputForm type="text" placeholder="Name (e.g., Length)" value={spec.name} onChange={(e) => handleFieldChange("specifications", index, "name", e.target.value)} className="flex-1" />
                    <InputForm type="text" placeholder="Unit (e.g., 26 Metres)" value={spec.unit || ""} onChange={(e) => handleFieldChange("specifications", index, "unit", e.target.value)} className="flex-1" />
                    <button type="button" onClick={() => removeField("specifications", index)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addField("specifications")} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  + Add Specification
                </button>
              </div>

              {/* FACILITIES */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Facilities</h3>
                {formData.facilities.map((fac, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <InputForm type="text" placeholder="Facility Name (e.g., Jacuzzi)" value={fac.name} onChange={(e) => handleFieldChange("facilities", index, "name", e.target.value)} className="flex-1" />
                    <button type="button" onClick={() => removeField("facilities", index)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addField("facilities")} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  + Add Facility
                </button>
              </div>

              {/* SECURITY TOOLS */}
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Tools</h3>
                {formData.securityTools.map((tool, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <InputForm type="text" placeholder="Security Tool (e.g., Life Jackets)" value={tool.name} onChange={(e) => handleFieldChange("securityTools", index, "name", e.target.value)} className="flex-1" />
                    <button type="button" onClick={() => removeField("securityTools", index)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addField("securityTools")} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  + Add Security Tool
                </button>
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
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

        {/* DELETE MODAL */}
        {isDeleteModalOpen && selectedShip && (
          <Modal title="Confirm Delete" onClose={closeDeleteModal}>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{selectedShip.name}</strong>? This action cannot be undone.
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

  export default Ships;
