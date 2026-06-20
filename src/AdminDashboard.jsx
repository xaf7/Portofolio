import React, { useState, useEffect } from "react";
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
  Image,
  Edit3,
  Check,
} from "lucide-react";
import { supabase } from "./supabaseClient";

export default function AdminDashboard({
  projects,
  setProjects,
  testimonials,
  setTestimonials,
  onLogout,
}) {
  // State manajemen navigasi tab & responsive mobile menu
  const [activeTab, setActiveTab] = useState("projects");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State Dark Mode yang tersinkronisasi langsung ke element HTML root global
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  // Efek untuk memaksa seluruh halaman berubah warna saat dark mode aktif
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // State Mode Edit
  const [editingId, setEditingId] = useState(null);

  // Form State Projek
  const [projForm, setProjForm] = useState({
    title: "",
    category: "",
    desc: "",
    tech: "Laravel + React",
    image_url: "", // Menambahkan input URL foto web pada projek sesuai request
    speed: "98/100",
    status: "Production Ready",
    color: "from-blue-600 to-indigo-700",
  });

  // Form State Testimonial
  const [testiForm, setTestiForm] = useState({
    quote: "",
    name: "",
    company: "",
    tags: "SaaS Enterprise",
    rating: "5.0",
    avatar_url: "",
  });

  const [savingProj, setSavingProj] = useState(false);
  const [savingTesti, setSavingTesti] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // ================= CRUD PROJEK =================
  const handleCreateOrUpdateProject = async (e) => {
    e.preventDefault();
    setSavingProj(true);

    const projData = {
      title: projForm.title,
      category: projForm.category,
      desc: projForm.desc,
      tech: projForm.tech,
      image_url: projForm.image_url,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      speed: projForm.speed,
      status: projForm.status,
      color: projForm.color,
    };

    if (editingId) {
      // PROSES EDIT DATA
      const { data, error } = await supabase
        .from("projects")
        .update(projData)
        .eq("id", editingId)
        .select();

      setSavingProj(false);
      if (error) return alert("Gagal mengupdate projek: " + error.message);

      setProjects(projects.map((p) => (p.id === editingId ? data[0] : p)));
      setEditingId(null);
      alert("Projek berhasil diperbarui!");
    } else {
      // PROSES BUAT BARU
      const { data, error } = await supabase
        .from("projects")
        .insert([projData])
        .select();

      setSavingProj(false);
      if (error) return alert("Gagal menyimpan ke database: " + error.message);

      setProjects([data[0], ...projects]);
      alert("Projek baru berhasil ditambahkan!");
    }

    setProjForm({
      title: "",
      category: "",
      desc: "",
      tech: "Laravel + React",
      image_url: "",
      speed: "98/100",
      status: "Production Ready",
      color: "from-blue-600 to-indigo-700",
    });
  };

  const handleStartEditProject = (p) => {
    setEditingId(p.id);
    setProjForm({
      title: p.title || "",
      category: p.category || "",
      desc: p.desc || "",
      tech: p.tech || "Laravel + React",
      image_url: p.image_url || "",
      speed: p.speed || "98/100",
      status: p.status || "Production Ready",
      color: p.color || "from-blue-600 to-indigo-700",
    });
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Yakin ingin menghapus projek ini?")) return;
    setActionLoadingId(id);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    setActionLoadingId(null);

    if (error) return alert("Gagal menghapus: " + error.message);
    setProjects(projects.filter((item) => item.id !== id));
  };

  // ================= CRUD TESTIMONIAL =================
  const handleCreateOrUpdateTestimonial = async (e) => {
    e.preventDefault();
    setSavingTesti(true);

    const testiData = {
      quote: testiForm.quote,
      name: testiForm.name,
      company: testiForm.company,
      tags: testiForm.tags,
      rating: testiForm.rating,
      avatar_url: testiForm.avatar_url,
    };

    if (editingId) {
      // PROSES EDIT TESTI
      const { data, error } = await supabase
        .from("testimonials")
        .update(testiData)
        .eq("id", editingId)
        .select();

      setSavingTesti(false);
      if (error) return alert("Gagal mengupdate testimonial: " + error.message);

      setTestimonials(
        testimonials.map((t) => (t.id === editingId ? data[0] : t)),
      );
      setEditingId(null);
      alert("Testimonial berhasil diperbarui!");
    } else {
      // PROSES BUAT TESTI BARU
      const { data, error } = await supabase
        .from("testimonials")
        .insert([testiData])
        .select();

      setSavingTesti(false);
      if (error) return alert("Gagal menyimpan testimonial: " + error.message);

      setTestimonials([data[0], ...testimonials]);
      alert("Testimoni berhasil dipublikasikan!");
    }

    setTestiForm({
      quote: "",
      name: "",
      company: "",
      tags: "SaaS Enterprise",
      rating: "5.0",
      avatar_url: "",
    });
  };

  const handleStartEditTesti = (t) => {
    setEditingId(t.id);
    setTestiForm({
      quote: t.quote || "",
      name: t.name || "",
      company: t.company || "",
      tags: t.tags || "SaaS Enterprise",
      rating: t.rating || "5.0",
      avatar_url: t.avatar_url || "",
    });
  };

  const handleDeleteTestimonial = async (id) => {
    if (!confirm("Yakin ingin menghapus testimoni ini?")) return;
    setActionLoadingId(id);
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    setActionLoadingId(null);

    if (error) return alert("Gagal menghapus: " + error.message);
    setTestimonials(testimonials.filter((item) => item.id !== id));
  };

  return (
    <div
      className={`w-full min-h-screen font-sans flex flex-col lg:flex-row transition-colors duration-300 bg-[#f5f5f9] dark:bg-[#232333] text-[#697a8d] dark:text-[#cfcfe0]`}
    >
      {/* ================= SIDEBAR NAVIGASI ================= */}
      <aside className="w-64 min-h-screen hidden lg:flex flex-col shrink-0 bg-blue-600 text-white shadow-xl">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
          <span className="text-xl font-bold tracking-tight text-white">
            Xaf Dashboard
          </span>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1.5">
          <div className="text-[11px] font-bold text-blue-200 uppercase tracking-wider px-3 mb-2 opacity-80">
            Main
          </div>
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setEditingId(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "dashboard" ? "bg-white text-blue-600 font-bold shadow-md" : "text-white/80 hover:bg-white/10"}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <div className="pt-5 text-[11px] font-bold text-blue-200 uppercase tracking-wider px-3 mb-2 opacity-80">
            Manajemen Data
          </div>
          <button
            onClick={() => {
              setActiveTab("projects");
              setEditingId(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "projects" ? "bg-white text-blue-600 font-bold shadow-md" : "text-white/80 hover:bg-white/10"}`}
          >
            <Briefcase size={18} />
            <span>Projek Kerja</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("testimonials");
              setEditingId(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "testimonials" ? "bg-white text-blue-600 font-bold shadow-md" : "text-white/80 hover:bg-white/10"}`}
          >
            <MessageSquare size={18} />
            <span>Testimonial</span>
          </button>
        </div>
      </aside>

      {/* ================= TOP NAV BAR ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur border-b transition-colors duration-300 bg-white/90 dark:bg-[#2b2c40]/90 border-slate-200 dark:border-[#363853]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg lg:hidden hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-white"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Tombol Switch Tema Malam / Siang GLOBAL */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg border transition-all border-slate-200 dark:border-[#434460] text-slate-600 dark:text-amber-400 bg-slate-50 dark:bg-slate-800"
              title="Ganti Mode Tampilan"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="h-8 w-px bg-slate-300 dark:bg-slate-700"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[#566a7f] dark:text-white">
                  XAF7 ENGINE
                </p>
                <p className="text-[10px] text-slate-400">Admin Control</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="lg:hidden w-full bg-blue-600 text-white border-b border-blue-700 shadow-lg">
            <div className="px-4 py-3 space-y-1 text-sm font-medium">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setIsMobileMenuOpen(false);
                  setEditingId(null);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab("projects");
                  setIsMobileMenuOpen(false);
                  setEditingId(null);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
              >
                Projek Kerja
              </button>
              <button
                onClick={() => {
                  setActiveTab("testimonials");
                  setIsMobileMenuOpen(false);
                  setEditingId(null);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
              >
                Testimonial
              </button>
            </div>
          </div>
        )}

        {/* CONTAINER MAIN APPLICATION */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* ================= TAB 2: MANAGEMENT PROJEK ================= */}
          {activeTab === "projects" && (
            <div className="bg-white dark:bg-[#2b2c40] border border-slate-100 dark:border-transparent rounded-xl shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                    <FolderPlus size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#566a7f] dark:text-white">
                      {editingId
                        ? "Mode Edit: Update Projek Kerja"
                        : "Manajemen Postingan Projek"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Unggah & ubah portofolio arsitektur software Anda terbaru
                    </p>
                  </div>
                </div>
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setProjForm({
                        title: "",
                        category: "",
                        desc: "",
                        tech: "Laravel + React",
                        image_url: "",
                        speed: "98/100",
                        status: "Production Ready",
                        color: "from-blue-600 to-indigo-700",
                      });
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-[10px]"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <form
                onSubmit={handleCreateOrUpdateProject}
                className="space-y-4 text-xs font-semibold"
              >
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">
                    Judul Projek / Blog
                  </label>
                  <input
                    type="text"
                    required
                    value={projForm.title}
                    onChange={(e) =>
                      setProjForm({ ...projForm, title: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2.5 outline-none bg-white dark:bg-[#232333] border-slate-300 dark:border-[#434460] text-slate-900 dark:text-white"
                  />
                </div>

                {/* INPUT BARU: FOTO WEB UNTUK PROJEK */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium flex items-center gap-1">
                    <Image size={12} /> URL Gambaran Web / Cover Gambar Projek
                  </label>
                  <input
                    type="url"
                    value={projForm.image_url}
                    onChange={(e) =>
                      setProjForm({ ...projForm, image_url: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/photo-example.jpg"
                    className="w-full border rounded-lg px-3 py-2.5 outline-none bg-white dark:bg-[#232333] border-slate-300 dark:border-[#434460] text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-medium">
                      Kategori Sistem
                    </label>
                    <input
                      type="text"
                      required
                      value={projForm.category}
                      onChange={(e) =>
                        setProjForm({ ...projForm, category: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2.5 outline-none bg-white dark:bg-[#232333] border-slate-300 dark:border-[#434460] text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-medium">
                      Tech Stack
                    </label>
                    <input
                      type="text"
                      required
                      value={projForm.tech}
                      onChange={(e) =>
                        setProjForm({ ...projForm, tech: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2.5 outline-none bg-white dark:bg-[#232333] border-slate-300 dark:border-[#434460] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={projForm.desc}
                    onChange={(e) =>
                      setProjForm({ ...projForm, desc: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2.5 outline-none bg-white dark:bg-[#232333] border-slate-300 dark:border-[#434460] text-slate-900 dark:text-white resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={savingProj}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  {savingProj ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : editingId ? (
                    <Check size={14} />
                  ) : (
                    <Plus size={14} />
                  )}
                  {editingId
                    ? "SIMPAN PERUBAHAN PROJEK"
                    : "TAMBAHKAN PROJEK BARU"}
                </button>
              </form>

              {/* LIST PROJEK AKTIF DENGAN TOMBOL EDIT & HAPUS */}
              <div className="pt-4 border-t border-slate-500/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  List Projek Aktif ({projects.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-lg border flex items-center justify-between text-[12px] bg-[#f5f5f9] dark:bg-[#232333] border-slate-100 dark:border-[#363853]"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {p.image_url && (
                          <img
                            src={p.image_url}
                            alt="Cover"
                            className="w-10 h-10 rounded object-cover border shrink-0 bg-slate-200"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        <div className="truncate">
                          <span className="font-bold block text-[#566a7f] dark:text-slate-200 truncate">
                            {p.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {p.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditProject(p)}
                          className="text-amber-500 p-1.5 hover:bg-amber-500/10 rounded-lg"
                          title="Edit Data"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          disabled={actionLoadingId === p.id}
                          className="text-red-500 p-1.5 hover:bg-red-500/10 rounded-lg"
                          title="Hapus Data"
                        >
                          {actionLoadingId === p.id ? (
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
          )}

          {/* ================= TAB 3: MANAGEMENT TESTIMONIAL ================= */}
          {activeTab === "testimonials" && (
            <div className="bg-white dark:bg-[#2b2c40] border border-slate-100 dark:border-transparent rounded-xl shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#566a7f] dark:text-white">
                      {editingId
                        ? "Mode Edit: Update Testimonial"
                        : "Manajemen Komentar Testimoni"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Urus dan edit ulasan validasi beserta gambar web lampiran
                    </p>
                  </div>
                </div>
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setTestiForm({
                        quote: "",
                        name: "",
                        company: "",
                        tags: "SaaS Enterprise",
                        rating: "5.0",
                        avatar_url: "",
                      });
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-[10px]"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <form
                onSubmit={handleCreateOrUpdateTestimonial}
                className="space-y-4 text-xs font-semibold"
              >
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">
                    Isi Komentar Klien / Ulasan
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={testiForm.quote}
                    onChange={(e) =>
                      setTestiForm({ ...testiForm, quote: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2.5 outline-none bg-white dark:bg-[#232333] border-slate-300 dark:border-[#434460] text-slate-900 dark:text-white resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium flex items-center gap-1">
                    <Image size={12} /> URL Foto Web / Avatar Klien
                  </label>
                  <input
                    type="url"
                    value={testiForm.avatar_url}
                    onChange={(e) =>
                      setTestiForm({ ...testiForm, avatar_url: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2.5 outline-none bg-white dark:bg-[#232333] border-slate-300 dark:border-[#434460] text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-medium">
                      Nama Inisial / Klien
                    </label>
                    <input
                      type="text"
                      required
                      value={testiForm.name}
                      onChange={(e) =>
                        setTestiForm({ ...testiForm, name: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2.5 outline-none bg-white dark:bg-[#232333] border-slate-300 dark:border-[#434460] text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-medium">
                      Nama Institusi / Perusahaan
                    </label>
                    <input
                      type="text"
                      required
                      value={testiForm.company}
                      onChange={(e) =>
                        setTestiForm({ ...testiForm, company: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2.5 outline-none bg-white dark:bg-[#232333] border-slate-300 dark:border-[#434460] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingTesti}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  {savingTesti ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : editingId ? (
                    <Check size={14} />
                  ) : (
                    <Plus size={14} />
                  )}
                  {editingId
                    ? "SIMPAN PERUBAHAN TESTIMONI"
                    : "PUBLIKASIKAN TESTIMONI"}
                </button>
              </form>

              {/* LIST TESTIMONI AKTIF DENGAN TOMBOL EDIT & HAPUS */}
              <div className="pt-4 border-t border-slate-500/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  List Testimoni Aktif ({testimonials.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-lg border flex items-center justify-between text-[11px] bg-[#f5f5f9] dark:bg-[#232333] border-slate-100 dark:border-[#363853]"
                    >
                      <div className="flex items-center gap-3 overflow-hidden max-w-[80%]">
                        {t.avatar_url && (
                          <img
                            src={t.avatar_url}
                            alt="Web"
                            className="w-8 h-8 rounded object-cover border shrink-0 bg-slate-200"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        <div className="truncate">
                          <span className="text-slate-400 italic block truncate">
                            "{t.quote}"
                          </span>
                          <span className="text-[10px] font-semibold text-blue-500 mt-0.5 block truncate">
                            {t.name} — {t.company}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditTesti(t)}
                          className="text-amber-500 p-1.5 hover:bg-amber-500/10 rounded-lg"
                          title="Edit Data"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          disabled={actionLoadingId === t.id}
                          className="text-red-500 p-1.5 hover:bg-red-500/10 rounded-lg"
                          title="Hapus Data"
                        >
                          {actionLoadingId === t.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
