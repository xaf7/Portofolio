import React, { useState } from "react";
import {
  Plus,
  Trash2,
  LayoutDashboard,
  FolderPlus,
  MessageSquare,
  LogOut,
  Loader2,
  Settings,
  UserCheck,
  Briefcase,
  Search,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { supabase } from "./supabaseClient";

export default function AdminDashboard({
  projects,
  setProjects,
  testimonials,
  setTestimonials,
  onLogout,
  isDarkMode,
}) {
  const [projForm, setProjForm] = useState({
    title: "",
    category: "",
    desc: "",
    tech: "Laravel + React",
    speed: "98/100",
    status: "Production Ready",
    color: "from-blue-600 to-indigo-700",
  });

  const [testiForm, setTestiForm] = useState({
    quote: "",
    name: "",
    company: "",
    tags: "SaaS Enterprise",
    rating: "5.0",
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
      className={`w-full min-h-screen font-sans flex ${isDarkMode ? "bg-[#232333] text-[#cfcfe0]" : "bg-[#f5f5f9] text-[#697a8d]"}`}
    >
      {/* ================= SIDEBAR NAVIGASI ================= */}
      <aside
        className={`w-64 min-h-screen hidden lg:flex flex-col shrink-0 border-r ${isDarkMode ? "bg-[#2b2c40] border-[#363853]" : "bg-white border-slate-200"}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6">
          <div className="w-7 h-7 rounded-lg bg-[#696cff] text-white flex items-center justify-center font-black shadow-md shadow-[#696cff]/30">
            <span className="text-sm font-bold">s</span>
          </div>
          <span
            className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-[#566a7f]"}`}
          >
            sneat
          </span>
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-4 py-4 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main
          </div>
          <button
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isDarkMode ? "bg-[#434460]/40 text-[#696cff]" : "bg-[#f5f5f9] text-[#696cff]"}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <div className="pt-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Manajemen Data
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-500/10 transition-all text-slate-400">
            <Briefcase size={18} />
            <span>Projek Kerja</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-500/10 transition-all text-slate-400">
            <MessageSquare size={18} />
            <span>Testimonial</span>
          </button>
        </div>

        {/* Upgrade Banner Bottom Sidebar */}
        <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-[#696cff] to-[#787bff] text-white space-y-3 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-xs font-bold">Upgrade ke Premium</h4>
            <p className="text-[10px] text-white/80 mt-1">
              Dapatkan kontrol penuh tanpa batasan sistem.
            </p>
            <button className="mt-3 w-full py-1.5 bg-white text-[#696cff] font-bold text-[11px] rounded-lg shadow-sm hover:bg-slate-50 transition-all">
              Upgrade
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        </div>
      </aside>

      {/* ================= KONTEN UTAMA CONTROLLER ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR */}
        <header
          className={`h-16 px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur border-b ${isDarkMode ? "bg-[#2b2c40]/80 border-[#363853]" : "bg-white/80 border-slate-200"}`}
        >
          {/* Mock Search Bar */}
          <div className="flex items-center gap-2 text-slate-400 text-sm max-w-xs w-full bg-transparent">
            <Search size={18} />
            <span className="opacity-60">Search... (Ctrl+K)</span>
          </div>

          {/* Action Icons Panel */}
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-[#696cff] transition-all">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="text-slate-400 hover:text-[#696cff] transition-all relative">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-slate-300 dark:bg-slate-700"></div>

            {/* User Profile Info / Logout Area */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p
                  className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-[#566a7f]"}`}
                >
                  XAF7 ENGINE
                </p>
                <p className="text-[10px] text-slate-400">Admin Control</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
                title="Keluar"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* CONTAINER UTAMA HALAMAN */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* ROW 1: BANNER SAMBUTAN & KARTU STATISTIK */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Welcome Greeting Banner Card */}
            <div
              className={`xl:col-span-2 p-6 rounded-xl relative overflow-hidden shadow-sm flex flex-col justify-between ${isDarkMode ? "bg-[#2b2c40]" : "bg-white"}`}
            >
              <div className="space-y-2 max-w-md">
                <h2
                  className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#696cff]"}`}
                >
                  Selamat Datang Kembali, Administrator! 🎉
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manajemen konten dan arsitektur database terhubung langsung
                  secara real-time. Anda dapat melacak integrasi dan
                  memodifikasi komponen di bawah ini.
                </p>
              </div>
              <div className="mt-4">
                <button className="px-4 py-2 bg-[#696cff]/10 hover:bg-[#696cff]/20 text-[#696cff] text-xs font-bold rounded-lg transition-all border border-[#696cff]/20">
                  Lihat Log Database
                </button>
              </div>
              {/* Illustrative background accent placeholder mimicking the human vector in reference image */}
              <div className="absolute right-6 bottom-0 top-0 w-32 hidden sm:flex items-center justify-center opacity-10 dark:opacity-20">
                <LayoutDashboard size={120} className="text-[#696cff]" />
              </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 gap-6">
              {/* Stat 1: Projects count */}
              <div
                className={`p-5 rounded-xl shadow-sm flex flex-col justify-between ${isDarkMode ? "bg-[#2b2c40]" : "bg-white"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-lg">
                    <Briefcase size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-xs text-slate-400 block font-semibold">
                    Total Projek
                  </span>
                  <h3
                    className={`text-2xl font-bold mt-1 ${isDarkMode ? "text-white" : "text-[#566a7f]"}`}
                  >
                    {projects.length}
                  </h3>
                  <span className="text-[10px] text-emerald-500 font-medium mt-1 inline-block">
                    ✓ Terhubung Supabase
                  </span>
                </div>
              </div>

              {/* Stat 2: Testimonials count */}
              <div
                className={`p-5 rounded-xl shadow-sm flex flex-col justify-between ${isDarkMode ? "bg-[#2b2c40]" : "bg-white"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                    <UserCheck size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-xs text-slate-400 block font-semibold">
                    Testimonial
                  </span>
                  <h3
                    className={`text-2xl font-bold mt-1 ${isDarkMode ? "text-white" : "text-[#566a7f]"}`}
                  >
                    {testimonials.length}
                  </h3>
                  <span className="text-[10px] text-emerald-500 font-medium mt-1 inline-block">
                    ✓ Aktif Ditampilkan
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: FORM INPUT DAN LIST DATA MOCK MANAGEMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PANEL MANAJEMEN PORTFOLIO WEB */}
            <div
              className={`rounded-xl shadow-sm p-6 space-y-5 border ${isDarkMode ? "bg-[#2b2c40] border-transparent" : "bg-white border-slate-100"}`}
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-500/10">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                  <FolderPlus size={18} />
                </div>
                <div>
                  <h3
                    className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-[#566a7f]"}`}
                  >
                    Manajemen Postingan Projek
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Tambah atau hapus data portofolio utama
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
                    className={`w-full border rounded-lg px-3 py-2.5 outline-none transition-all ${isDarkMode ? "bg-[#232333] border-[#434460] text-white focus:border-[#696cff]" : "bg-white border-slate-300 text-slate-900 focus:border-[#696cff]"}`}
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
                      className={`w-full border rounded-lg px-3 py-2.5 outline-none transition-all ${isDarkMode ? "bg-[#232333] border-[#434460] text-white focus:border-[#696cff]" : "bg-white border-slate-300 text-slate-900 focus:border-[#696cff]"}`}
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
                      className={`w-full border rounded-lg px-3 py-2.5 outline-none transition-all ${isDarkMode ? "bg-[#232333] border-[#434460] text-white focus:border-[#696cff]" : "bg-white border-slate-300 text-slate-900 focus:border-[#696cff]"}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={projForm.desc}
                    onChange={(e) =>
                      setProjForm({ ...projForm, desc: e.target.value })
                    }
                    placeholder="Platform manajemen data..."
                    className={`w-full border rounded-lg px-3 py-2.5 outline-none resize-none transition-all ${isDarkMode ? "bg-[#232333] border-[#434460] text-white focus:border-[#696cff]" : "bg-white border-slate-300 text-slate-900 focus:border-[#696cff]"}`}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={savingProj}
                  className="w-full py-2.5 bg-[#696cff] hover:bg-[#5f61e6] disabled:opacity-60 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-sm shadow-[#696cff]/20 flex items-center justify-center gap-2"
                >
                  {savingProj ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />{" "}
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Tambahkan Projek Baru
                    </>
                  )}
                </button>
              </form>

              {/* Data List container */}
              <div className="pt-4 border-t border-slate-500/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  List Projek Aktif ({projects.length})
                </span>
                <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className={`p-3 rounded-lg border flex items-center justify-between text-[12px] transition-all ${isDarkMode ? "bg-[#232333] border-[#363853]" : "bg-[#f5f5f9] border-slate-100"}`}
                    >
                      <span
                        className={`font-bold truncate max-w-[80%] ${isDarkMode ? "text-slate-200" : "text-[#566a7f]"}`}
                      >
                        {p.title}
                      </span>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        disabled={deletingId === p.id}
                        className="text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
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

            {/* PANEL MANAJEMEN KOMENTAR TESTIMONI */}
            <div
              className={`rounded-xl shadow-sm p-6 space-y-5 border ${isDarkMode ? "bg-[#2b2c40] border-transparent" : "bg-white border-slate-100"}`}
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-500/10">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3
                    className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-[#566a7f]"}`}
                  >
                    Manajemen Komentar Testimoni
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Urus respon validasi eksternal dari klien
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleCreateTestimonial}
                className="space-y-4 text-xs font-semibold"
              >
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">
                    Isi Komentar Klien
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={testiForm.quote}
                    onChange={(e) =>
                      setTestiForm({ ...testiForm, quote: e.target.value })
                    }
                    placeholder="Sistem dashboard internal sangat membantu..."
                    className={`w-full border rounded-lg px-3 py-2.5 outline-none resize-none transition-all ${isDarkMode ? "bg-[#232333] border-[#434460] text-white focus:border-[#696cff]" : "bg-white border-slate-300 text-slate-900 focus:border-[#696cff]"}`}
                  ></textarea>
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
                      className={`w-full border rounded-lg px-3 py-2.5 outline-none transition-all ${isDarkMode ? "bg-[#232333] border-[#434460] text-white focus:border-[#696cff]" : "bg-white border-slate-300 text-slate-900 focus:border-[#696cff]"}`}
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
                      className={`w-full border rounded-lg px-3 py-2.5 outline-none transition-all ${isDarkMode ? "bg-[#232333] border-[#434460] text-white focus:border-[#696cff]" : "bg-white border-slate-300 text-slate-900 focus:border-[#696cff]"}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingTesti}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  {savingTesti ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />{" "}
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Publikasikan Testimoni
                    </>
                  )}
                </button>
              </form>

              {/* Testimonials List container */}
              <div className="pt-4 border-t border-slate-500/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  List Testimoni Aktif ({testimonials.length})
                </span>
                <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3 rounded-lg border flex items-center justify-between text-[11px] transition-all ${isDarkMode ? "bg-[#232333] border-[#363853]" : "bg-[#f5f5f9] border-slate-100"}`}
                    >
                      <span className="truncate text-slate-400 italic max-w-[85%]">
                        "{t.quote.substring(0, 32)}..." —{" "}
                        <strong className="text-[#696cff] not-italic">
                          {t.company}
                        </strong>
                      </span>
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        disabled={deletingId === t.id}
                        className="text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
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
          </div>
        </main>
      </div>
    </div>
  );
}
