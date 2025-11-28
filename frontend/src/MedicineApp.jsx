import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Input from "./components/Input";
import Button from "./components/Button";

export default function MedicineApp({ onLogout, onNavigate }) {
  const [form, setForm] = useState({
    userName: "",
    age: "",
    contact: "",
    drugName: "",
    medicineType: "",
  });
  const [file, setFile] = useState({ profileImage: null, documentProof: null });
  const [preview, setPreview] = useState({ profileImage: null, documentProof: null });
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await axiosInstance.get("/medicine");
      setItems(res.data);
    } catch (err) {
      console.error("Error loading items", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file.profileImage) data.append("profileImage", file.profileImage);
    if (file.documentProof) data.append("documentProof", file.documentProof);

    try {
      if (editId) {
        await axiosInstance.put(`/medicine/${editId}`, data);
      } else {
        await axiosInstance.post("/medicine", data);
      }
      setForm({ userName: "", age: "", contact: "", drugName: "", medicineType: "" });
      setFile({ profileImage: null, documentProof: null });
      setPreview({ profileImage: null, documentProof: null });
      setEditId(null);
      setShowForm(false);
      load();
    } catch (err) {
      console.error("Error saving item", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      userName: item.userName,
      age: item.age,
      contact: item.contact,
      drugName: item.drugName,
      medicineType: item.medicineType,
    });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axiosInstance.delete(`/medicine/${id}`);
        load();
      } catch (err) {
        console.error("Error deleting item", err);
      }
    }
  };

  const handleCancel = () => {
    setForm({ userName: "", age: "", contact: "", drugName: "", medicineType: "" });
    setFile({ profileImage: null, documentProof: null });
    setPreview({ profileImage: null, documentProof: null });
    setEditId(null);
    setShowForm(false);
  };

  const filtered = items.filter((i) =>
    [i.userName, i.contact, i.drugName, i.medicineType]
      .filter(Boolean)
      .some((f) => f.toLowerCase().includes(search.toLowerCase()))
  );

  const resolveImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return `http://localhost:4000${path}`;
    const name = path.split(/[/\\]/).pop();
    return `http://localhost:4000/uploads/${name}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onLogout={onLogout} onNavigate={onNavigate} currentPage="inventory" />

      <div className="flex flex-1">

        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Welcome Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Medicine Inventory
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your pharmacy's medicine inventory efficiently
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-60">
                <Input
                  placeholder="Search medicines, users, or types..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowForm(true)}
                icon="➕"
              >
                Add Medicine
              </Button>
            </div>
 
            {/* Modal Overlay */}
            {showForm && (
              <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => handleCancel()}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {editId ? "Edit Medicine" : "Add New Medicine"}
                    </h3>
                    <button
                      onClick={handleCancel}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                      aria-label="Close modal"
                    >
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Patient Name"
                      placeholder="Enter patient name"
                      value={form.userName}
                      onChange={(e) => setForm({ ...form, userName: e.target.value })}
                      required
                      icon="👤"
                    />
                    <Input
                      label="Age"
                      type="number"
                      placeholder="Enter age"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                      required
                      icon="📅"
                    />
                    <Input
                      label="Contact"
                      placeholder="Enter contact number"
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                      required
                      icon="📞"
                    />
                    <Input
                      label="Drug Name"
                      placeholder="Enter drug name"
                      value={form.drugName}
                      onChange={(e) => setForm({ ...form, drugName: e.target.value })}
                      required
                      icon="💊"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Medicine Type
                      </label>
                      <select
                        value={form.medicineType}
                        onChange={(e) => setForm({ ...form, medicineType: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all"
                      >
                        <option value="">Select Type</option>
                        <option>Tablet</option>
                        <option>Syrup</option>
                        <option>Gel</option>
                        <option>Injection</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Profile Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files[0];
                          setFile({ ...file, profileImage: f });
                          if (f && f.type.startsWith("image/")) {
                            setPreview((p) => ({ ...p, profileImage: URL.createObjectURL(f) }));
                          } else {
                            setPreview((p) => ({ ...p, profileImage: null }));
                          }
                        }}
                        className="w-full px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Document Proof
                    </label>
                    <input
                      type="file"
                      onChange={(e) => {
                        const f = e.target.files[0];
                        setFile({ ...file, documentProof: f });
                        if (f) setPreview((p) => ({ ...p, documentProof: f.name }));
                        else setPreview((p) => ({ ...p, documentProof: null }));
                      }}
                      className="w-full px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                    />
                  </div>

                  {/* Previews */}
                  {(preview.profileImage || preview.documentProof) && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                      {preview.profileImage && (
                        <div className="flex items-center gap-2">
                          <img src={preview.profileImage} alt="Preview" className="w-16 h-16 object-cover rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Image preview</span>
                        </div>
                      )}
                      {preview.documentProof && (
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📄</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{preview.documentProof}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button  type="submit" variant="primary" size="lg" loading={loading} className="flex-1">
                      {loading ? "Saving..." : editId ? "Update" : "Add Medicine"}
                    </Button>
                    <Button type="button" variant="secondary" size="lg" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </form>
                </div>
              </div>
            )}

            {/* Table Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              {filtered.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">No medicines found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Patient</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Drug</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Image</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Document</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filtered.map((item, idx) => (
                        <tr
                          key={item.id}
                          className={
                            idx % 2 === 0
                              ? "bg-gray-800"
                              : "bg-gray-700"
                          }
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {item.userName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.userName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.age} yrs • {item.contact}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900 dark:text-white">{item.drugName}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium">
                              {item.medicineType}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {item.profileImage ? (
                              <a href={resolveImageUrl(item.profileImage)} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={resolveImageUrl(item.profileImage)}
                                  alt="Profile"
                                  className="w-10 h-10 object-cover rounded cursor-pointer"
                                />
                              </a>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {item.documentProof ? (
                              <div className="flex gap-2">
                                <a
                                  href={resolveImageUrl(item.documentProof)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                >
                                  View
                                </a>
                                
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEdit(item)}
                                tooltip="Edit medicine"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(item.id)}
                                tooltip="Delete medicine"
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold">{filtered.length}</span> of{" "}
                  <span className="font-semibold">{items.length}</span> medicines
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
