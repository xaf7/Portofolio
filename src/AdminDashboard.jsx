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
  Image,
} from "lucide-react";
import { supabase } from "./supabaseClient";

export default function AdminDashboard({
  projects,
  setProjects,
  testimonials,
  setTestimonials,
  onLogout,
  isDarkMode: externalDarkMode,
}) {
  // State manajemen navigasi tab & responsive mobile menu
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State lokal untuk memastikan Dark Mode bertransisi jika parent belum mengikat fungsi state global
  const [localDarkMode, setLocalDarkMode] = useState(false);
  const isDark =
    externalDarkMode !== undefined ? externalDarkMode : localDarkMode;

  const [projForm, setProjForm] = useState({
    title: "",
    category: "",
    desc: "",
    tech: "Laravel + React",
    speed: "98/100",
    status: "Production Ready",
    color: "from-blue-600 to-indigo-700",
  });

  // Menambahkan field avatar / foto web ke dalam testimoni
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
  const [deletingId, setDeletingId] = useState(null);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSavingProj(true);

    const newProjData = {
      title: projForm.title,
      category: projForm.category,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      desc: projForm.desc,
      tech: projForm.tech,
      speed: projForm.speed,
      status: projForm.status,
      color: projForm.color,
    };

    const { data, error } = await supabase
      .from("projects")
      .insert([newProjData])
      .select();

    setSavingProj(false);

    if (error) {
      alert("Gagal menyimpan ke database: " + error.message);
      return;
    }

    setProjects([data[0], ...projects]);
    setProjForm({
      title: "",
      category: "",
      desc: "",
      tech: "Laravel + React",
      speed: "98/100",
      status: "Production Ready",
      color: "from-blue-600 to-indigo-700",
    });
    alert("Projek berhasil dipublikasikan!");
  };

  const handleDeleteProject = async (id) => {
    setDeletingId(id);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    setDeletingId(null);

    if (error) {
      alert("Gagal menghapus: " + error.message);
      return;
    }
    setProjects(projects.filter((item) => item.id !== id));
  };

  const handleCreateTestimonial = async (e) => {
    e.preventDefault();
    setSavingTesti(true);

    const newTestiData = {
      quote: testiForm.quote,
      name: testiForm.name,
      company: testiForm.company,
      tags: testiForm.tags,
      rating: testiForm.rating,
      avatar_url: testiForm.avatar_url, // Menyimpan link foto web / klien ke database
    };

    const { data, error } = await supabase
      .from("testimonials")
      .insert([newTestiData])
      .select();

    setSavingTesti(false);

    if (error) {
      alert("Gagal menyimpan ke database: " + error.message);
      return;
    }

    setTestimonials([data[0], ...testimonials]);
    setTestiForm({
      quote: "",
      name: "",
      company: "",
      tags: "SaaS Enterprise",
      rating: "5.0",
      avatar_url: "",
    });
    alert("Testimoni berhasil ditambahkan!");
  };

  const handleDeleteTestimonial = async (id) => {
    setDeletingId(id);
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    setDeletingId(null);

    if (error) {
      alert("Gagal menghapus: " + error.message);
      return;
    }
    setTestimonials(testimonials.filter((item) => item.id !== id));
  };

  return (
    <div
      className={`w-full min-h-screen font-sans flex flex-col lg:flex-row transition-colors duration-300 ${isDark ? "bg-[#232333] text-[#cfcfe0]" : "bg-[#f5f5f9] text-[#697a8d]"}`}
    >
      {/* ================= SIDEBAR NAVIGASI (DESKTOP) ================= */}
      <aside className="w-64 min-h-screen hidden lg:flex flex-col shrink-0 bg-blue-600 text-white shadow-xl">
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
          <img
            src="/icon.png"
            alt="Logo Xaf"
            className="w-7 h-7 object-contain bg-white/20 p-0.5 rounded-lg shadow-sm"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span className="text-xl font-bold tracking-tight text-white">
            Xaf
          </span>
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-4 py-6 space-y-1.5">
          <div className="text-[11px] font-bold text-blue-200 uppercase tracking-wider px-3 mb-2 opacity-80">
            Main
          </div>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "dashboard" ? "bg-white text-blue-600 font-bold shadow-md" : "text-white/80 hover:bg-white/10"}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <div className="pt-5 text-[11px] font-bold text-blue-200 uppercase tracking-wider px-3 mb-2 opacity-80">
            Manajemen Data
          </div>
          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "projects" ? "bg-white text-blue-600 font-bold shadow-md" : "text-white/80 hover:bg-white/10"}`}
          >
            <Briefcase size={18} />
            <span>Projek Kerja</span>
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "testimonials" ? "bg-white text-blue-600 font-bold shadow-md" : "text-white/80 hover:bg-white/10"}`}
          >
            <MessageSquare size={18} />
            <span>Testimonial</span>
          </button>
        </div>
      </aside>

      {/* ================= TOP NAV BAR & HEADER CONTROLLER ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        <header
          className={`h-16 px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur border-b transition-colors duration-300 ${isDark ? "bg-[#2b2c40]/90 border-[#363853]" : "bg-white/90 border-slate-200"}`}
        >
          {/* Sisi Kiri: Tombol Menu Hamburger untuk Mobile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg lg:hidden transition-all ${isDark ? "hover:bg-slate-700 text-white" : "hover:bg-slate-100 text-slate-700"}`}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <img
                src="/icon.png"
                alt="Logo"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span
                className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-800"}`}
              >
                Xaf
              </span>
            </div>
          </div>

          {/* Sisi Kanan: Toggle Dark Mode & Profil Pengguna */}
          <div className="flex items-center gap-4">
            {/* Tombol Switch Tema Malam / Siang (Sekarang Berfungsi) */}
            <button
              onClick={() => setLocalDarkMode(!localDarkMode)}
              className={`p-2 rounded-lg border transition-all ${isDark ? "border-[#434460] text-amber-400 bg-slate-800" : "border-slate-200 text-slate-600 bg-slate-50"}`}
              title={isDark ? "Aktifkan Mode Terang" : "Aktifkan Mode Malam"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="h-8 w-px bg-slate-300 dark:bg-slate-700"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p
                  className={`text-xs font-bold ${isDark ? "text-white" : "text-[#566a7f]"}`}
                >
                  XAF7 ENGINE
                </p>
                <p className="text-[10px] text-slate-400">Admin Control</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
                title="Keluar Aplikasi"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* ================= DROPDOWN MENU UNTUK VERSI MOBILE ================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden w-full bg-blue-600 text-white animate-fadeIn border-b border-blue-700 shadow-lg">
            <div className="px-4 py-3 space-y-1 text-sm font-medium">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left ${activeTab === "dashboard" ? "bg-white text-blue-600 font-bold" : "text-white/90"}`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab("projects");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left ${activeTab === "projects" ? "bg-white text-blue-600 font-bold" : "text-white/90"}`}
              >
                <Briefcase size={16} /> Projek Kerja
              </button>
              <button
                onClick={() => {
                  setActiveTab("testimonials");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left ${activeTab === "testimonials" ? "bg-white text-blue-600 font-bold" : "text-white/90"}`}
              >
                <MessageSquare size={16} /> Testimonial
              </button>
            </div>
          </div>
        )}

        {/* CONTAINER UTAMA HALAMAN */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* TAB 1: DASHBOARD UTAMA */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Banner Selamat Datang */}
                <div
                  className={`xl:col-span-2 p-6 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden transition-colors ${isDark ? "bg-[#2b2c40]" : "bg-white"}`}
                >
                  <div className="space-y-2 max-w-md">
                    <h2
                      className={`text-lg font-bold ${isDark ? "text-white" : "text-blue-600"}`}
                    >
                      Selamat Datang Kembali, Administrator! 🎉
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Manajemen sistem basis data terintegrasi real-time.
                      Silakan pilih menu spesifik di bilah samping atau atas
                      untuk memodifikasi komponen portofolio Anda.
                    </p>
                  </div>
                  <div className="mt-4">
                    <button className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 text-xs font-bold rounded-lg transition-all border border-blue-600/20">
                      Lihat Log Database
                    </button>
                  </div>
                </div>

                {/* Kartu Statistik */}
                <div className="grid grid-cols-2 gap-6">
                  <div
                    className={`p-5 rounded-xl shadow-sm flex flex-col justify-between cursor-pointer border hover:border-blue-500/40 transition-all ${isDark ? "bg-[#2b2c40] border-transparent" : "bg-white border-transparent"}`}
                    onClick={() => setActiveTab("projects")}
                  >
                    <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-lg w-10">
                      <Briefcase size={20} />
                    </div>
                    <div className="mt-4">
                      <span className="text-xs text-slate-400 block font-semibold">
                        Total Projek
                      </span>
                      <h3
                        className={`text-2xl font-bold mt-1 ${isDark ? "text-white" : "text-slate-700"}`}
                      >
                        {projects.length}
                      </h3>
                      <span className="text-[10px] text-blue-500 font-medium mt-1 inline-block">
                        Buka Projek →
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-5 rounded-xl shadow-sm flex flex-col justify-between cursor-pointer border hover:border-blue-500/40 transition-all ${isDark ? "bg-[#2b2c40] border-transparent" : "bg-white border-transparent"}`}
                    onClick={() => setActiveTab("testimonials")}
                  >
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg w-10">
                      <UserCheck size={20} />
                    </div>
                    <div className="mt-4">
                      <span className="text-xs text-slate-400 block font-semibold">
                        Testimonial
                      </span>
                      <h3
                        className={`text-2xl font-bold mt-1 ${isDark ? "text-white" : "text-slate-700"}`}
                      >
                        {testimonials.length}
                      </h3>
                      <span className="text-[10px] text-emerald-500 font-medium mt-1 inline-block">
                        Buka Ulasan →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HALAMAN FORM PROJEK KERJA */}
          {activeTab === "projects" && (
            <div
              className={`rounded-xl shadow-sm p-6 space-y-5 border transition-colors ${isDark ? "bg-[#2b2c40] border-transparent" : "bg-white border-slate-100"}`}
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-500/10">
                <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                  <FolderPlus size={18} />
                </div>
                <div>
                  <h3
                    className={`text-sm font-bold ${isDark ? "text-white" : "text-[#566a7f]"}`}
                  >
                    Manajemen Postingan Projek
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Unggah portofolio arsitektur software Anda terbaru
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleCreateProject}
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
                    placeholder="EduSmart - Dashboard Portal"
                    className={`w-full border rounded-lg px-3 py-2.5 outline-none transition-all ${isDark ? "bg-[#232333] border-[#434460] text-white focus:border-blue-500" : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"}`}
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
                      placeholder="Sistem Academic"
                      className={`w-full border rounded-lg px-3 py-2.5 outline-none transition-all ${isDark ? "bg-[#232333] border-[#434460] text-white focus:border-blue-500" : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"}`}
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
                      className={`w-full border rounded-lg px-3 py-2.5 outline-none transition-all ${isDark ? "bg-[#232333] border-[#434460] text-white focus:border-blue-500" : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"}`}
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
                    placeholder="Platform manajemen data..."
                    className={`w-full border rounded-lg px-3 py-2.5 outline-none resize-none transition-all ${isDark ? "bg-[#232333] border-[#434460] text-white focus:border-blue-500" : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"}`}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={savingProj}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  {savingProj ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                  TAMBAHKAN PROJEK BARU
                </button>
              </form>

              {/* List Projek Aktif */}
              <div className="pt-4 border-t border-slate-500/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  List Projek Aktif ({projects.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className={`p-3 rounded-lg border flex items-center justify-between text-[12px] ${isDark ? "bg-[#232333] border-[#363853]" : "bg-[#f5f5f9] border-slate-100"}`}
                    >
                      <div>
                        <span
                          className={`font-bold block ${isDark ? "text-slate-200" : "text-[#566a7f]"}`}
                        >
                          {p.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {p.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        disabled={deletingId === p.id}
                        className="text-red-500 p-1.5 hover:bg-red-500/10 rounded-lg"
                      >
                        {deletingId === p.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HALAMAN FORM TESTIMONIAL & FOTO WEB */}
          {activeTab === "testimonials" && (
            <div
              className={`rounded-xl shadow-sm p-6 space-y-5 border transition-colors ${isDark ? "bg-[#2b2c40] border-transparent" : "bg-white border-slate-100"}`}
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-500/10">
                <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3
                    className={`text-sm font-bold ${isDark ? "text-white" : "text-[#566a7f]"}`}
                  >
                    Manajemen Komentar Testimoni
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Urus respon validasi eksternal beserta gambar lampiran web
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleCreateTestimonial}
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
                    placeholder="Sistem dashboard internal sangat membantu..."
                    className={`w-full border rounded-lg px-3 py-2.5 outline-none resize-none transition-all ${isDark ? "bg-[#232333] border-[#434460] text-white focus:border-blue-500" : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"}`}
                  ></textarea>
                </div>

                {/* Penambahan Fitur Input Link Foto Web/Klien */}
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
                    placeholder="https://example.com/foto-web.png"
                    className={`w-full border rounded-lg px-3 py-2.5 outline-none transition-all ${isDark ? "bg-[#232333] border-[#434460] text-white focus:border-blue-500" : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"}`}
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
                      placeholder="Contoh: GT atau Nama Lengkap"
                      className={`w-full border rounded-lg px-3 py-2.5 outline-none transition-all ${isDark ? "bg-[#232333] border-[#434460] text-white focus:border-blue-500" : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"}`}
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
                      placeholder="Global Tech Corp"
                      className={`w-full border rounded-lg px-3 py-2.5 outline-none transition-all ${isDark ? "bg-[#232333] border-[#434460] text-white focus:border-blue-500" : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingTesti}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  {savingTesti ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                  PUBLIKASIKAN TESTIMONI
                </button>
              </form>

              {/* List Testimoni Aktif */}
              <div className="pt-4 border-t border-slate-500/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  List Testimoni Aktif ({testimonials.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3 rounded-lg border flex items-center justify-between text-[11px] ${isDark ? "bg-[#232333] border-[#363853]" : "bg-[#f5f5f9] border-slate-100"}`}
                    >
                      <div className="flex items-center gap-3 truncate max-w-[85%]">
                        {t.avatar_url && (
                          <img
                            src={t.avatar_url}
                            alt="Web"
                            className="w-8 h-8 rounded object-cover border border-slate-300 shrink-0"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        <div className="truncate">
                          <span className="text-slate-400 italic block truncate">
                            "{t.quote}"
                          </span>
                          <span className="text-[10px] font-semibold text-blue-500 mt-0.5 block">
                            {t.name} — {t.company}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        disabled={deletingId === t.id}
                        className="text-red-500 p-1.5 hover:bg-red-500/10 rounded-lg"
                      >
                        {deletingId === t.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
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
