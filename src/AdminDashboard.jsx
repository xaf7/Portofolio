import React, { useState } from "react";
import {
  Plus,
  Trash2,
  LayoutDashboard,
  FolderPlus,
  MessageSquare,
  LogOut,
  Loader2,
  Briefcase,
  UserCheck,
  Sun,
  Moon,
  Menu,
  X,
  Image as ImageIcon,
  Edit3,
  ExternalLink,
} from "lucide-react";
import { supabase } from "./supabaseClient";

export default function AdminDashboard({
  projects,
  setProjects,
  testimonials,
  setTestimonials,
  onLogout,
  isDarkMode,
  toggleDarkMode,
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [editingProject, setEditingProject] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const [projForm, setProjForm] = useState({
    title: "",
    category: "",
    desc: "",
    tech: "Laravel + React",
    speed: "98/100",
    status: "Production Ready",
    color: "from-blue-600 to-indigo-700",
    web_url: "",
  });

  const [testiForm, setTestiForm] = useState({
    name: "",
    company: "",
    quote: "",
  });

  const [projectFile, setProjectFile] = useState(null);
  const [testimonialFile, setTestimonialFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Perbaikan Utama: Mengembalikan Full Public URL Langsung dari Supabase Storage
  const uploadImage = async (file, folderName = "projects") => {
    if (!file) return null;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    // Memasukkan file ke dalam folder yang sesuai (projects/ atau testimonials/)
    const filePath = `${folderName}/${fileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from("image")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Detail Error Supabase Storage:", uploadError);
      alert("Gagal mengunggah gambar: " + uploadError.message);
      return null;
    }

    // Ambil link URL Publik penuh dari berkas yang barusan diupload
    const { data: publicUrlData } = supabase.storage
      .from("image")
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || null;
  };

  // Handler Submit Projek
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let finalImagePath = editingProject ? editingProject.image_url : "";

    if (projectFile) {
      const uploadedUrl = await uploadImage(projectFile, "projects");
      if (uploadedUrl) finalImagePath = uploadedUrl;
    }

    const formattedDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const payload = {
      title: projForm.title,
      category: projForm.category,
      description: projForm.desc,
      tech: projForm.tech,
      speed: projForm.speed,
      status: projForm.status,
      color: projForm.color,
      web_url: projForm.web_url || null,
      image_url: finalImagePath,
      date: editingProject ? editingProject.date : formattedDate,
    };

    if (editingProject) {
      const { data, error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingProject.id)
        .select();

      if (!error && data) {
        setProjects(
          projects.map((p) => (p.id === editingProject.id ? data[0] : p)),
        );
        setEditingProject(null);
        resetProjectForm();
        setActiveTab("dashboard");
      } else if (error) {
        alert("Gagal merubah data: " + error.message);
      }
    } else {
      if (!projectFile) {
        alert("Silakan pilih file foto terlebih dahulu untuk projek baru!");
        setSubmitting(false);
        return;
      }
      const { data, error } = await supabase
        .from("projects")
        .insert([payload])
        .select();

      if (!error && data) {
        setProjects([data[0], ...projects]);
        resetProjectForm();
        setActiveTab("dashboard");
      } else if (error) {
        alert("Gagal menambah data: " + error.message);
      }
    }
    setSubmitting(false);
  };

  const resetProjectForm = () => {
    setProjForm({
      title: "",
      category: "",
      desc: "",
      tech: "Laravel + React",
      speed: "98/100",
      status: "Production Ready",
      color: "from-blue-600 to-indigo-700",
      web_url: "",
    });
    setProjectFile(null);
  };

  // Handler Submit Testimoni
  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let finalAvatarPath = editingTestimonial
      ? editingTestimonial.avatar_url
      : "";

    if (testimonialFile) {
      const uploadedUrl = await uploadImage(testimonialFile, "testimonials");
      if (uploadedUrl) finalAvatarPath = uploadedUrl;
    }

    const payload = {
      name: testiForm.name,
      company: testiForm.company,
      quote: testiForm.quote,
      avatar_url: finalAvatarPath,
    };

    if (editingTestimonial) {
      const { data, error } = await supabase
        .from("testimonials")
        .update(payload)
        .eq("id", editingTestimonial.id)
        .select();

      if (!error && data) {
        setTestimonials(
          testimonials.map((t) =>
            t.id === editingTestimonial.id ? data[0] : t,
          ),
        );
        setEditingTestimonial(null);
        resetTestiForm();
        setActiveTab("dashboard");
      } else if (error) {
        alert("Gagal merubah data: " + error.message);
      }
    } else {
      if (!testimonialFile) {
        alert("Silakan pilih file foto terlebih dahulu untuk testimoni baru!");
        setSubmitting(false);
        return;
      }
      const { data, error } = await supabase
        .from("testimonials")
        .insert([payload])
        .select();

      if (!error && data) {
        setTestimonials([data[0], ...testimonials]);
        resetTestiForm();
        setActiveTab("dashboard");
      } else if (error) {
        alert("Gagal menambah data: " + error.message);
      }
    }
    setSubmitting(false);
  };

  const resetTestiForm = () => {
    setTestiForm({ name: "", company: "", quote: "" });
    setTestimonialFile(null);
  };

  const startEditProject = (p) => {
    setEditingProject(p);
    setProjForm({
      title: p.title,
      category: p.category,
      desc: p.description,
      tech: p.tech,
      speed: p.speed,
      status: p.status,
      color: p.color,
      web_url: p.web_url || "",
    });
    setActiveTab("projects");
  };

  const startEditTestimonial = (t) => {
    setEditingTestimonial(t);
    setTestiForm({
      name: t.name,
      company: t.company,
      quote: t.quote,
    });
    setActiveTab("testimonials");
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Hapus projek ini?")) return;
    setDeletingId(id);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) setProjects(projects.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  const handleDeleteTestimonial = async (id) => {
    if (!confirm("Hapus testimoni ini?")) return;
    setDeletingId(id);
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (!error) setTestimonials(testimonials.filter((t) => t.id !== id));
    setDeletingId(null);
  };

  // Fungsi fallback untuk memastikan link gambar selalu aman dibaca komponen img
  const renderStorageImage = (urlPath) => {
    if (!urlPath) return "";
    // Jika link sudah berupa full URL HTTP/HTTPS, langsung return tanpa diubah
    if (urlPath.startsWith("http")) return urlPath;

    // Fallback jika database menyimpan path lama berupa string relatif saja
    const { data } = supabase.storage.from("image").getPublicUrl(urlPath);
    return data?.publicUrl || "";
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${isDarkMode ? "bg-[#0a0c10] text-white" : "bg-slate-100 text-slate-900"}`}
    >
      {/* Sidebar Desktop */}
      <aside
        className={`w-64 fixed inset-y-0 left-0 z-20 hidden md:flex flex-col border-r ${isDarkMode ? "bg-[#13161c] border-slate-800" : "bg-white border-slate-200"}`}
      >
        <div className="p-6 border-b border-inherit">
          <h2 className="text-lg font-black tracking-wider uppercase text-blue-600">
            XAF Admin
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === "dashboard" ? "bg-blue-600 text-white shadow-md" : isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"}`}
          >
            <LayoutDashboard size={16} /> Panel Utama
          </button>
          <button
            onClick={() => {
              setActiveTab("projects");
              setEditingProject(null);
              resetProjectForm();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === "projects" ? "bg-blue-600 text-white shadow-md" : isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"}`}
          >
            <FolderPlus size={16} /> Kelola Projek
          </button>
          <button
            onClick={() => {
              setActiveTab("testimonials");
              setEditingTestimonial(null);
              resetTestiForm();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === "testimonials" ? "bg-blue-600 text-white shadow-md" : isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"}`}
          >
            <MessageSquare size={16} /> Kelola Testimoni
          </button>
        </nav>
        <div className="p-4 border-t border-inherit space-y-2">
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold ${isDarkMode ? "bg-slate-800 text-yellow-400" : "bg-slate-200 text-slate-700"}`}
          >
            {isDarkMode ? (
              <div className="flex items-center gap-2">
                <Sun size={14} /> Mode Terang
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Moon size={14} /> Mode Gelap
              </div>
            )}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} /> Keluar Akun
          </button>
        </div>
      </aside>

      {/* Header Mobile */}
      <header
        className={`p-4 flex items-center justify-between border-b md:hidden sticky top-0 z-30 ${isDarkMode ? "bg-[#13161c] border-slate-800" : "bg-white border-slate-200"}`}
      >
        <h2 className="text-sm font-black tracking-wider uppercase text-blue-600">
          XAF Admin
        </h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl border border-slate-700/30"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Dropdown Menu Mobile */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden border-b p-4 space-y-2 fixed top-[61px] left-0 right-0 z-20 shadow-xl ${isDarkMode ? "bg-[#13161c] border-slate-800" : "bg-white border-slate-200"}`}
        >
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs ${activeTab === "dashboard" ? "bg-blue-600 text-white" : ""}`}
          >
            <LayoutDashboard size={14} /> Panel Utama
          </button>
          <button
            onClick={() => {
              setActiveTab("projects");
              setEditingProject(null);
              resetProjectForm();
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs ${activeTab === "projects" ? "bg-blue-600 text-white" : ""}`}
          >
            <FolderPlus size={14} /> Kelola Projek
          </button>
          <button
            onClick={() => {
              setActiveTab("testimonials");
              setEditingTestimonial(null);
              resetTestiForm();
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs ${activeTab === "testimonials" ? "bg-blue-600 text-white" : ""}`}
          >
            <MessageSquare size={14} /> Kelola Testimoni
          </button>
          <div className="pt-2 border-t border-slate-700/30 flex gap-2">
            <button
              onClick={toggleDarkMode}
              className="flex-1 py-2 bg-slate-800 text-center rounded-xl text-xs text-yellow-400 justify-center flex items-center gap-1"
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />} Tema
            </button>
            <button
              onClick={onLogout}
              className="flex-1 py-2 bg-red-500/10 text-center rounded-xl text-xs font-bold text-red-500"
            >
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* Konten Utama */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`p-6 rounded-2xl border flex items-center gap-4 ${isDarkMode ? "bg-[#13161c] border-slate-800" : "bg-white border-slate-200"}`}
                >
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">
                      Total Projek
                    </span>
                    <span className="text-2xl font-black">
                      {projects.length}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-6 rounded-2xl border flex items-center gap-4 ${isDarkMode ? "bg-[#13161c] border-slate-800" : "bg-white border-slate-200"}`}
                >
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                    <UserCheck size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">
                      Total Testimoni
                    </span>
                    <span className="text-2xl font-black">
                      {testimonials.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                  className={`p-6 rounded-2xl border ${isDarkMode ? "bg-[#13161c] border-slate-800" : "bg-white border-slate-200"}`}
                >
                  <h3 className="text-sm font-black uppercase tracking-wider mb-4 text-blue-500">
                    Daftar Projek
                  </h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {projects.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-700/50"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={renderStorageImage(p.image_url)}
                            alt=""
                            className="w-10 h-10 object-cover rounded-lg bg-slate-800 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold block truncate">
                              {p.title}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate block">
                              {p.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditProject(p)}
                            className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            disabled={deletingId === p.id}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                          >
                            {deletingId === p.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`p-6 rounded-2xl border ${isDarkMode ? "bg-[#13161c] border-slate-800" : "bg-white border-slate-200"}`}
                >
                  <h3 className="text-sm font-black uppercase tracking-wider mb-4 text-emerald-500">
                    Daftar Testimoni
                  </h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {testimonials.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-700/50"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={renderStorageImage(t.avatar_url)}
                            alt=""
                            className="w-10 h-10 object-cover rounded-full bg-slate-800 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold block truncate">
                              {t.name}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate block">
                              {t.company}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditTestimonial(t)}
                            className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(t.id)}
                            disabled={deletingId === t.id}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                          >
                            {deletingId === t.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJEK FORM */}
          {activeTab === "projects" && (
            <div
              className={`max-w-2xl p-6 md:p-8 rounded-2xl border ${isDarkMode ? "bg-[#13161c] border-slate-800" : "bg-white border-slate-200"}`}
            >
              <h3 className="text-base font-black mb-6">
                {editingProject ? "✏️ Edit Projek" : "🚀 Tambah Projek Baru"}
              </h3>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-slate-400">
                      Judul Projek
                    </label>
                    <input
                      type="text"
                      required
                      value={projForm.title}
                      onChange={(e) =>
                        setProjForm({ ...projForm, title: e.target.value })
                      }
                      className={`w-full p-3 rounded-xl border outline-none text-xs ${isDarkMode ? "bg-[#181b22] border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-slate-400">
                      Kategori
                    </label>
                    <input
                      type="text"
                      required
                      value={projForm.category}
                      onChange={(e) =>
                        setProjForm({ ...projForm, category: e.target.value })
                      }
                      placeholder="Web App, Mobile, Backend"
                      className={`w-full p-3 rounded-xl border outline-none text-xs ${isDarkMode ? "bg-[#181b22] border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-400">
                    Deskripsi Projek
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={projForm.desc}
                    onChange={(e) =>
                      setProjForm({ ...projForm, desc: e.target.value })
                    }
                    className={`w-full p-3 rounded-xl border outline-none text-xs ${isDarkMode ? "bg-[#181b22] border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-400">
                    Upload Foto Projek{" "}
                    {editingProject && "(Kosongkan jika tidak diganti)"}
                  </label>
                  <div
                    className={`w-full h-32 border border-dashed rounded-xl relative flex flex-col items-center justify-center gap-2 transition-colors ${isDarkMode ? "bg-[#181b22] border-slate-800 hover:bg-[#20242e]" : "bg-slate-50 border-slate-300 hover:bg-slate-100"}`}
                  >
                    <div className="flex flex-col items-center pointer-events-none z-0 px-4 text-center">
                      <ImageIcon size={24} className="text-slate-500 mb-1" />
                      <span className="text-xs font-semibold text-slate-400 block max-w-full truncate">
                        {projectFile
                          ? `Terpilih: ${projectFile.name}`
                          : "Klik area ini untuk mencari file foto"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProjectFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-slate-400">
                      Teknologi
                    </label>
                    <input
                      type="text"
                      value={projForm.tech}
                      onChange={(e) =>
                        setProjForm({ ...projForm, tech: e.target.value })
                      }
                      className={`w-full p-3 rounded-xl border outline-none text-xs ${isDarkMode ? "bg-[#181b22] border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-slate-400">
                      Skor Kecepatan
                    </label>
                    <input
                      type="text"
                      value={projForm.speed}
                      onChange={(e) =>
                        setProjForm({ ...projForm, speed: e.target.value })
                      }
                      className={`w-full p-3 rounded-xl border outline-none text-xs ${isDarkMode ? "bg-[#181b22] border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-slate-400">
                      Status
                    </label>
                    <input
                      type="text"
                      value={projForm.status}
                      onChange={(e) =>
                        setProjForm({ ...projForm, status: e.target.value })
                      }
                      className={`w-full p-3 rounded-xl border outline-none text-xs ${isDarkMode ? "bg-[#181b22] border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-400">
                    URL Website (Opsional)
                  </label>
                  <input
                    type="url"
                    value={projForm.web_url}
                    onChange={(e) =>
                      setProjForm({ ...projForm, web_url: e.target.value })
                    }
                    placeholder="https://example.com"
                    className={`w-full p-3 rounded-xl border outline-none text-xs ${isDarkMode ? "bg-[#181b22] border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Simpan Projek"
                    )}
                  </button>
                  {editingProject && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        resetProjectForm();
                        setActiveTab("dashboard");
                      }}
                      className="px-5 py-3 bg-slate-700 text-white rounded-xl text-xs font-bold uppercase"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: TESTIMONI FORM */}
          {activeTab === "testimonials" && (
            <div
              className={`max-w-2xl p-6 md:p-8 rounded-2xl border ${isDarkMode ? "bg-[#13161c] border-slate-800" : "bg-white border-slate-200"}`}
            >
              <h3 className="text-base font-black mb-6">
                {editingTestimonial
                  ? "✏️ Edit Testimoni"
                  : "💬 Tambah Testimoni Baru"}
              </h3>
              <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-slate-400">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={testiForm.name}
                      onChange={(e) =>
                        setTestiForm({ ...testiForm, name: e.target.value })
                      }
                      className={`w-full p-3 rounded-xl border outline-none text-xs ${isDarkMode ? "bg-[#181b22] border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-slate-400">
                      Perusahaan / Instansi
                    </label>
                    <input
                      type="text"
                      required
                      value={testiForm.company}
                      onChange={(e) =>
                        setTestiForm({ ...testiForm, company: e.target.value })
                      }
                      placeholder="CEO, Perusahaan"
                      className={`w-full p-3 rounded-xl border outline-none text-xs ${isDarkMode ? "bg-[#181b22] border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-400">
                    Upload Foto Profil{" "}
                    {editingTestimonial && "(Kosongkan jika tidak diganti)"}
                  </label>
                  <div
                    className={`w-full h-32 border border-dashed rounded-xl relative flex flex-col items-center justify-center gap-2 transition-colors ${isDarkMode ? "bg-[#181b22] border-slate-800 hover:bg-[#20242e]" : "bg-slate-50 border-slate-300 hover:bg-slate-100"}`}
                  >
                    <div className="flex flex-col items-center pointer-events-none z-0 px-4 text-center">
                      <ImageIcon size={24} className="text-slate-500 mb-1" />
                      <span className="text-xs font-semibold text-slate-400 block max-w-full truncate">
                        {testimonialFile
                          ? `Terpilih: ${testimonialFile.name}`
                          : "Klik area ini untuk mencari file foto"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setTestimonialFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-400">
                    Isi Testimoni
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={testiForm.quote}
                    onChange={(e) =>
                      setTestiForm({ ...testiForm, quote: e.target.value })
                    }
                    className={`w-full p-3 rounded-xl border outline-none text-xs ${isDarkMode ? "bg-[#181b22] border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                  ></textarea>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Simpan Testimoni"
                    )}
                  </button>
                  {editingTestimonial && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTestimonial(null);
                        resetTestiForm();
                        setActiveTab("dashboard");
                      }}
                      className="px-5 py-3 bg-slate-700 text-white rounded-xl text-xs font-bold uppercase"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
