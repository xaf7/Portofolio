import React, { useState, useEffect, useRef } from "react";
import {
  Sun,
  Moon,
  ArrowLeft,
  ArrowRight,
  Star,
  Mail,
  MessageCircle,
  Plus,
  X,
  Cat,
  Languages,
} from "lucide-react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import { supabase } from "./supabaseClient";

function useScrollReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);
  return [ref, isVisible];
}

export default function App() {
  const [lang, setLang] = useState("id");

  const t = {
    id: {
      nav: {
        adv: "Advertisers",
        pub: "Publishers",
        gal: "Gallery",
        cs: "Case Studies",
        contact: "Contact us",
      },
      hero: {
        badge: "Siswa SMK & Spesialis Backend",
        title1: "Digital Ads dibangun",
        title2: "untuk",
        desc: "Teknologi Proprietary. Hasil Terbukti. Tanpa Jalan Pintas. Hanya Performa.",
        btn: "Mulai Sekarang ➔",
      },
      showcase: {
        badge: "DARI BLOGPOST & PRODUK SAYA",
        title: "Hasil Web & Penawaran Projek",
        testBtn: "TEST LIVE PREVIEW ➔",
      },
      testimoni: {
        title1: "Testimoni yang Berbicara",
        title2: "Tentang Hasil Saya",
        desc: "Dengarkan tanggapan nyata langsung dari client enterprise maupun instansi pendidikan yang mempercayakan sistem mereka.",
      },
      brief: {
        badge: "Mari Bangun Bersama",
        title1: "Satukan Ide Hebatmu,",
        title2: "Wujudkan Sistem Impian!",
        desc: "Punya konsep aplikasi, dashboard, atau platform digital yang ingin dieksekusi? Jangan biarkan ide itu mengendap begitu saja. Mari kita gabungkan visi bisnismu dengan keahlian teknis modern kami untuk membangun produk digital yang cepat, tangguh, dan tepat sasaran.",
        alert: "Isi form di samping untuk mulai menyelaraskan tujuan kita.",
        formTitle: "BRIEF PROYEK",
        labelDomain: "Nama Domain Pendukung",
        placeholderDomain: "contoh: websitesaya.com atau belum ada",
        labelReq: "Deskripsi Kebutuhan System",
        placeholderReq:
          "Jelaskan alur sistem kustom/fitur yang ingin Anda bangun...",
        labelBudget: "Estimasi Budget",
        btnWA: "Kirim ke WA",
        btnGmail: "Kirim ke Gmail",
        alertValidate:
          "Harap isi Nama Domain dan Deskripsi Kebutuhan Anda terlebih dahulu!",
      },
      faq: {
        badge: "PERTANYAAN & JAWABAN",
        title: "Pertanyaan yang Sering Diajukan",
      },
      footer: {
        desc: "Solusi pengembangan sistem kustom dan web modern. Dibangun untuk kecepatan, skalabilitas, dan performa bisnis Anda.",
        navTitle: "Navigasi",
        srv: "Layanan",
        start: "Mulai Proyek",
        port: "Portfolio",
        contactTitle: "Kontak",
        loc: "Depok, Jawa Barat",
        infoTitle: "Dapatkan info terbaru",
        holderEmail: "Alamat email",
        rights: "XAF7 Studio. Semua Hak Dilindungi.",
      },
      chatbot: {
        bubble: "Halo! Ada yang bisa dibantu?",
        welcome: "Halo! 🐱",
        subWelcome: "Butuh bantuan navigasi halaman? Saya siap membantu.",
        question: "Apa yang kamu cari?",
        btnGo: "Pergi ke Seksi ➔",
        btnBack: "← Kembali",
      },
    },
    en: {
      nav: {
        adv: "Advertisers",
        pub: "Publishers",
        gal: "Gallery",
        cs: "Case Studies",
        contact: "Contact us",
      },
      hero: {
        badge: "Vocational High School Student & Backend Specialist",
        title1: "Digital Ads built",
        title2: "to",
        desc: "Proprietary Technology. Proven Results. No Shortcuts. Just Performance.",
        btn: "Get started ➔",
      },
      showcase: {
        badge: "FROM MY BLOGPOST & PRODUCTS",
        title: "Web Results & Project Proposals",
        testBtn: "TEST LIVE PREVIEW ➔",
      },
      testimoni: {
        title1: "Testimonials that Speak to",
        title2: "My Results",
        desc: "Hear real feedback directly from enterprise clients and educational institutions who trust their systems with us.",
      },
      brief: {
        badge: "Let's Build Together",
        title1: "Unite Your Great Ideas,",
        title2: "Realize Your Dream System!",
        desc: "Have a concept for an app, dashboard, or digital platform you want to execute? Don't let that idea sit idle. Let's combine your business vision with our modern technical expertise to build fast, resilient, and targeted digital products.",
        alert: "Fill out the form on the side to start aligning our goals.",
        formTitle: "PROJECT BRIEF",
        labelDomain: "Supporting Domain Name",
        placeholderDomain: "e.g., mysite.com or not available yet",
        labelReq: "System Requirements Description",
        placeholderReq:
          "Explain the custom system workflow/features you want to build...",
        labelBudget: "Estimated Budget",
        btnWA: "Send to WA",
        btnGmail: "Send to Gmail",
        alertValidate:
          "Please fill in the Domain Name and your System Requirements first!",
      },
      faq: {
        badge: "QUESTIONS & ANSWERS",
        title: "Frequently Asked Questions",
      },
      footer: {
        desc: "Custom system development and modern web solutions. Built for speed, scalability, and your business performance.",
        navTitle: "Navigation",
        srv: "Services",
        start: "Start Project",
        port: "Portfolio",
        contactTitle: "Contact",
        loc: "Depok, West Java",
        infoTitle: "Get the latest info",
        holderEmail: "Email address",
        rights: "XAF7 Studio. All Rights Reserved.",
      },
      chatbot: {
        bubble: "Hi there! Can I help you?",
        welcome: "Hi there! 🐱",
        subWelcome: "Need help navigating the page? I'm here to help.",
        question: "What are you looking for?",
        btnGo: "Go to Section ➔",
        btnBack: "← Back",
      },
    },
  };

  const [activeFaqId, setActiveFaqId] = useState(null);

  const faqData = [
    {
      id: 1,
      question:
        lang === "id"
          ? "Bagaimana cara memesan sistem kustom di XAF7 Studio?"
          : "How do I order a custom system at XAF7 Studio?",
      answer:
        lang === "id"
          ? "Kamu cukup mengisi form Brief Proyek di bagian bawah halaman ini dengan detail kebutuhan sistem dan estimasi budget, lalu klik tombol kirim ke WhatsApp atau Gmail untuk konsultasi langsung."
          : "You just need to fill out the Project Brief form at the bottom of this page with your system details and budget estimation, then click the send to WhatsApp or Gmail button for a direct consultation.",
    },
    {
      id: 2,
      question:
        lang === "id"
          ? "Apakah sistem yang dibangun sudah termasuk hosting dan domain?"
          : "Does the built system include hosting and domain?",
      answer:
        lang === "id"
          ? "Tergantung paket budget yang kamu pilih. Untuk pilihan paket Full Setup atau Custom Enterprise, kami akan bantu mengurus konfigurasi domain hingga sistem siap diakses secara online (Production Ready)."
          : "Depending on the budget package you choose. For Full Setup or Custom Enterprise packages, we will help handle domain configuration until the system is ready to be accessed online (Production Ready).",
    },
    {
      id: 3,
      question:
        lang === "id"
          ? "Berapa lama proses pengerjaan satu buah web/dashboard?"
          : "How long does it take to build a single web/dashboard?",
      answer:
        lang === "id"
          ? "Waktu pengerjaan sangat bergantung pada kompleksitas fitur, berkisar antara 1 hingga 3 minggu. Kami selalu mengutamakan optimasi performa dan kecepatan loading sistem."
          : "The development time highly depends on the complexity of the features, ranging from 1 to 3 weeks. We always prioritize performance optimization and system loading speed.",
    },
    {
      id: 4,
      question:
        lang === "id"
          ? "Tech stack apa saja yang biasa digunakan?"
          : "What tech stack is typically used?",
      answer:
        lang === "id"
          ? "Kami fokus pada ekosistem modern yang super cepat, spesifik menggunakan Laravel sebagai arsitektur backend yang kokoh dan React / Tailwind CSS untuk antarmuka frontend yang responsif."
          : "We focus on a super fast modern ecosystem, specifically using Laravel as a solid backend architecture and React / Tailwind CSS for responsive frontend interfaces.",
    },
  ];

  const [isDarkMode, setIsDarkMode] = useState(false);

  // ADMIN: akses tersembunyi via ?admin=true di URL
  const getInitialView = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true") return "login";
    }
    return "client";
  };
  const [viewMode, setViewMode] = useState(getInitialView);

  // Cek apakah admin sudah punya session Supabase aktif (biar tidak perlu login ulang tiap buka ?admin=true)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") !== "true") return;

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) setViewMode("admin");
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setViewMode("client");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("admin");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const [currentIdx, setCurrentIdx] = useState(0);
  // Lebar card testimoni responsif
  const CARD_WIDTH_MOBILE =
    typeof window !== "undefined" && window.innerWidth < 640
      ? window.innerWidth * 0.85
      : 440;
  const CARD_GAP = 24;

  const chatbotGreeting = {
    welcome: t[lang].chatbot.welcome,
    subWelcome: t[lang].chatbot.subWelcome,
    question: t[lang].chatbot.question,
  };

  const chatbotConfig = [
    {
      id: "advertisers",
      label:
        lang === "id"
          ? "Informasi untuk Pengiklan"
          : "Information for Advertisers",
      responseMessage:
        lang === "id"
          ? "Bagus! 🚀 Mari kita lihat opsi tata letak modern dan tumpukan teknik kustom kami di atas."
          : "Great! 🚀 Let's view our modern layout options and custom engineering stack above.",
      targetSection: "showcase",
    },
    {
      id: "publishers",
      label:
        lang === "id"
          ? "Informasi untuk Penerbit"
          : "Information for Publishers",
      responseMessage:
        lang === "id"
          ? "Pilihan Luar Biasa! 📈 Isi Formulir Singkat Proyek tepat di bawah ini untuk meluncurkan platform Anda secara instan."
          : "Awesome Choice! 📈 Fill out the Project Brief Form right below to launch your platform instantly.",
      targetSection: "brief",
    },
    {
      id: "gallery",
      label:
        lang === "id" ? "Jelajahi Showcase Galeri" : "Explore Gallery Showcase",
      responseMessage:
        lang === "id"
          ? "Berikut adalah studi kasus kami dan tautan demo langsung, jangan ragu untuk memfilter berdasarkan industri."
          : "Here are our case studies and live demo links, feel free to filter by industry.",
      targetSection: "testimoni",
    },
    {
      id: "case_studies",
      label: lang === "id" ? "Studi Kasus & FAQ" : "Case Studies & FAQ",
      responseMessage:
        lang === "id"
          ? "Lihat bagian FAQ akordeon dinamis kami untuk informasi terperinci dan dukungan."
          : "Check out our dynamic accordion FAQ section for detailed information and support.",
      targetSection: "faq",
    },
  ];

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatStep, setChatStep] = useState("welcome");
  const [selectedOption, setSelectedOption] = useState(null);

  // Data testimoni & projek diambil LANGSUNG dari database Supabase
  // sehingga semua pengunjung melihat data yang sama, dan perubahan
  // dari Admin Dashboard langsung tersimpan permanen.
  const [testimonials, setTestimonials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);

      const [
        { data: projData, error: projError },
        { data: testiData, error: testiError },
      ] = await Promise.all([
        supabase.from("projects").select("*").order("id", { ascending: false }),
        supabase
          .from("testimonials")
          .select("*")
          .order("id", { ascending: false }),
      ]);

      if (projError)
        console.error("Gagal mengambil data projects:", projError.message);
      if (testiError)
        console.error("Gagal mengambil data testimonials:", testiError.message);

      setProjects(projData || []);
      setTestimonials(testiData || []);
      setDataLoading(false);
    };

    fetchData();
  }, []);

  const [briefForm, setBriefForm] = useState({
    domainName: "",
    systemRequirement: "",
    estimatedBudget: "Full Setup - Rp 1.200.000+",
    additionalNotes: "",
  });

  const [heroRef, heroVisible] = useScrollReveal();
  const [showcaseRef, showcaseVisible] = useScrollReveal();
  const [testimoniRef, testimoniVisible] = useScrollReveal();
  const [briefRef, briefVisible] = useScrollReveal();
  const [faqRef, faqVisible] = useScrollReveal();

  const words =
    lang === "id"
      ? ["Engage.", "Cepat.", "Cerdas."]
      : ["Engage.", "Fast.", "Smart."];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setCurrentWordIdx(0);
    setCurrentText("");
    setIsDeleting(false);
  }, [lang]);

  useEffect(() => {
    let timer;
    const fullWord = words[currentWordIdx];
    const handleTyping = () => {
      if (!isDeleting) {
        const nextText = fullWord.substring(0, currentText.length + 1);
        setCurrentText(nextText);
        if (nextText === fullWord) {
          timer = setTimeout(() => setIsDeleting(true), 1500);
          return;
        }
      } else {
        const nextText = fullWord.substring(0, currentText.length - 1);
        setCurrentText(nextText);
        if (nextText === "") {
          setIsDeleting(false);
          setCurrentWordIdx((prev) => (prev + 1) % words.length);
          return;
        }
      }
    };
    timer = setTimeout(handleTyping, isDeleting ? 60 : 120);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx, lang]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const generateBriefText = () => {
    const headerText =
      lang === "id"
        ? `Halo XAF7 Studio, saya ingin mengajukan brief proyek baru:`
        : `Hello XAF7 Studio, I would like to submit a new project brief:`;
    return (
      `${headerText}%0A%0A` +
      `• ${lang === "id" ? "Nama Domain" : "Domain Name"}: ${encodeURIComponent(briefForm.domainName || "-")}%0A` +
      `• ${lang === "id" ? "Deskripsi Kebutuhan" : "Requirements Description"}: ${encodeURIComponent(briefForm.systemRequirement || "-")}%0A` +
      `• ${lang === "id" ? "Estimasi Budget" : "Estimated Budget"}: ${encodeURIComponent(briefForm.estimatedBudget)}%0A` +
      `• ${lang === "id" ? "Catatan Tambahan" : "Additional Notes"}: ${encodeURIComponent(briefForm.additionalNotes || "-")}`
    );
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    if (!briefForm.domainName || !briefForm.systemRequirement) {
      alert(t[lang].brief.alertValidate);
      return;
    }
    const nomorWA = "6281234567890";
    window.open(
      `https://api.whatsapp.com/send?phone=${nomorWA}&text=${generateBriefText()}`,
      "_blank",
    );
  };

  const handleSendGmail = (e) => {
    e.preventDefault();
    if (!briefForm.domainName || !briefForm.systemRequirement) {
      alert(t[lang].brief.alertValidate);
      return;
    }
    const emailTujuan = "kontak@xaf7studio.com";
    const subjectTitle =
      lang === "id" ? "Brief Proyek Baru" : "New Project Brief";
    window.location.href = `mailto:${emailTujuan}?subject=${subjectTitle} - ${encodeURIComponent(briefForm.domainName)}&body=${generateBriefText()}`;
  };

  if (viewMode === "login") {
    return (
      <AdminLogin
        isDarkMode={isDarkMode}
        onLoginSuccess={() => setViewMode("admin")}
        onBack={() => {
          setViewMode("client");
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.delete("admin");
            window.history.replaceState({}, "", url.toString());
          }
        }}
      />
    );
  }

  if (viewMode === "admin") {
    return (
      <AdminDashboard
        projects={projects}
        setProjects={setProjects}
        testimonials={testimonials}
        setTestimonials={setTestimonials}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
    );
  }

  return (
    <div
      className={`w-full min-h-screen font-sans antialiased m-0 p-0 transition-colors duration-300 relative ${isDarkMode ? "bg-[#020408] text-slate-100" : "bg-white text-slate-900"}`}
    >
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-4 lg:px-20 py-4 flex items-center justify-between border-b transition-colors duration-300 ${isDarkMode ? "bg-[#020408]/90 border-slate-900 text-white" : "bg-white border-blue-500 text-slate-900"} backdrop-blur-md`}
      >
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <img
            src="./icon.png"
            alt="XAF7 Studio Logo"
            className={`w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 transition-all duration-300 ${isDarkMode ? "brightness-100" : "brightness-0 opacity-85"}`}
          />
          <span className="tracking-tight uppercase font-black text-sm sm:text-base">
            XAF7 STUDIO
          </span>
        </div>

        {/* Nav links — hidden on mobile */}
        <div
          className={`hidden md:flex items-center gap-8 text-[12px] font-semibold tracking-wide transition-colors duration-300 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
        >
          <button
            onClick={() => scrollToSection("showcase")}
            className="hover:text-blue-500 transition-colors"
          >
            {t[lang].nav.adv}
          </button>
          <button
            onClick={() => scrollToSection("brief")}
            className="hover:text-blue-500 transition-colors"
          >
            {t[lang].nav.pub}
          </button>
          <button
            onClick={() => scrollToSection("testimoni")}
            className="hover:text-blue-500 transition-colors"
          >
            {t[lang].nav.gal}
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-blue-500 transition-colors"
          >
            {t[lang].nav.cs}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Tombol bahasa */}
          <button
            onClick={() => setLang(lang === "id" ? "en" : "id")}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-[11px] font-bold ${isDarkMode ? "border-slate-800 hover:bg-slate-900 bg-slate-950 text-blue-400" : "border-slate-200 hover:bg-slate-100 bg-white text-blue-600"}`}
            title="Switch Language"
          >
            <Languages size={13} />
            <span className="uppercase">{lang}</span>
          </button>

          {/* Tombol dark mode */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border transition-all ${isDarkMode ? "border-slate-800 hover:bg-slate-900 bg-slate-950 text-yellow-400" : "border-slate-200 hover:bg-slate-100 bg-white text-slate-700"}`}
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Tombol Contact (selalu tampil, Login disembunyikan) */}
          <button
            onClick={() => scrollToSection("brief")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all shadow-sm"
          >
            {t[lang].nav.contact}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className={`w-full pt-28 sm:pt-36 md:pt-48 pb-16 sm:pb-24 px-4 sm:px-6 text-left transition-all duration-1000 transform ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${isDarkMode ? "bg-transparent" : "bg-white"}`}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold mb-5 tracking-wide border ${isDarkMode ? "bg-blue-950/40 border-blue-900/50 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600"}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              {t[lang].hero.badge}
            </div>
            <h1
              className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {t[lang].hero.title1} <br />
              {t[lang].hero.title2}{" "}
              <span className="text-blue-500 border-r-2 border-blue-500 pr-1 animate-pulse">
                {currentText}
              </span>
            </h1>
            <p
              className={`text-sm max-w-md leading-relaxed mb-7 font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              {t[lang].hero.desc}
            </p>
            <button
              onClick={() => scrollToSection("showcase")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-3 rounded-lg text-xs font-black tracking-wide transition-all shadow-md transform hover:scale-105"
            >
              {t[lang].hero.btn}
            </button>
          </div>

          {/* VISUAL MOCKUP */}
          <div className="relative flex justify-center items-center w-full mt-8 md:mt-0">
            <div className="w-full max-w-md bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl h-72 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                </div>
                <div className="bg-white/10 rounded-md px-4 py-0.5 text-[9px] text-white/40 font-mono">
                  xaf7studio.com/live-preview
                </div>
                <div className="w-4"></div>
              </div>
              <div className="flex flex-col gap-3 my-auto">
                <div className="w-3/4 h-4 bg-gradient-to-r from-blue-500 to-transparent rounded"></div>
                <div className="w-1/2 h-3 bg-white/20 rounded"></div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="h-16 bg-white/5 border border-white/10 rounded-lg p-2">
                    <div className="w-full h-2 bg-blue-400/50 rounded mb-1"></div>
                    <div className="w-2/3 h-1 bg-white/20 rounded"></div>
                  </div>
                  <div className="h-16 bg-white/5 border border-white/10 rounded-lg p-2">
                    <div className="w-full h-2 bg-blue-500/50 rounded mb-1"></div>
                    <div className="w-1/2 h-1 bg-white/20 rounded"></div>
                  </div>
                  <div className="h-16 bg-white/5 border border-white/10 rounded-lg p-2">
                    <div className="w-full h-2 bg-emerald-400/50 rounded mb-1"></div>
                    <div className="w-3/4 h-1 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO SHOWCASE — INFINITE MARQUEE SLIDER */}
      <section
        id="showcase"
        ref={showcaseRef}
        className={`w-full py-16 sm:py-20 border-t border-b overflow-hidden transition-all duration-1000 transform ${showcaseVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${isDarkMode ? "bg-[#222831] border-slate-900" : "bg-[#112E81] border-blue-800"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10">
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "text-blue-400" : "text-blue-200"}`}
          >
            {t[lang].showcase.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-white">
            {t[lang].showcase.title}
          </h2>
        </div>

        {/* Container Utama Slider */}
        <div className="relative w-full overflow-hidden flex">
          {/* Efek Blur Transparan Sinematik di Kiri dan Kanan Slider (Khusus Desktop) */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#112E81] via-[#112E81]/40 to-transparent z-20 pointer-events-none hidden md:block dark:from-[#222831]"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#112E81] via-[#112E81]/40 to-transparent z-20 pointer-events-none hidden md:block dark:from-[#222831]"></div>
          {/* Track Jalannya Animasi */}
          <div className="animate-marquee-portfolio gap-4 sm:gap-6 px-4">
            {/* Hanya memetakan data asli dari database tanpa duplikasi */}
            {projects.map((project, index) => (
              <div
                key={`${project.id}-${index}`}
                className="border border-slate-800/80 rounded-2xl p-4 sm:p-6 flex flex-col justify-between transition-all bg-[#13161c] hover:border-slate-700 shadow-2xl relative overflow-hidden group text-white w-[280px] sm:w-[380px] shrink-0"
              >
                <div>
                  <div
                    className={`w-full rounded-xl bg-gradient-to-br ${project.color} flex flex-col justify-between text-white mb-4 sm:mb-6 shadow-inner relative overflow-hidden h-48 sm:h-60`}
                  >
                    {/* Background Gambar Hasil Upload */}
                    {project.image_url && (
                      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50"></div>
                      </div>
                    )}

                    {/* Header Kartu */}
                    <div className="flex items-start justify-between gap-3 z-10 w-full p-3 sm:p-4">
                      <h3 className="text-xs sm:text-sm font-black tracking-tight leading-tight max-w-[65%] drop-shadow-md truncate-2-lines">
                        {project.title}
                      </h3>
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap shrink-0 border border-white/10 backdrop-blur-sm">
                        {project.category}
                      </span>
                    </div>

                    {/* Bar Navigasi Preview Tiruan */}
                    <div className="w-full opacity-95 transition-transform duration-500 group-hover:translate-y-[-4px] pointer-events-none flex flex-col justify-end z-10 mt-auto">
                      <div className="mx-3 mb-3 sm:mx-4 sm:mb-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-2 sm:p-2.5 shadow-2xl flex items-center justify-between">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        </div>
                        <div className="text-[7px] sm:text-[8px] text-white/50 font-mono tracking-tight truncate w-24 sm:w-32 text-center">
                          xaf7studio.com/preview
                        </div>
                        <div className="text-[7px] sm:text-[8px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {project.speed || "99/100"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi Projek */}
                  <p className="text-[11px] sm:text-[12px] leading-relaxed mb-4 sm:mb-6 text-slate-300 line-clamp-3">
                    {project.description || project.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                  <span className="text-[9px] sm:text-[10px] px-2 py-0.5 sm:py-1 rounded-md font-mono border bg-slate-900 text-slate-300 border-slate-800">
                    {project.tech}
                  </span>
                  {project.web_url ? (
                    <a
                      href={project.web_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center"
                    >
                      {t[lang].showcase.testBtn}
                    </a>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-500 cursor-not-allowed">
                      No Preview
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* SEKSI TESTIMONI SLIDER */}
      <section
        id="testimoni"
        ref={testimoniRef}
        className={`w-full py-16 sm:py-20 overflow-hidden text-center transition-all duration-1000 transform ${testimoniVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${isDarkMode ? "bg-[#020408]" : "bg-[#ebf3fe]"}`}
      >
        <div className="max-w-6xl mx-auto py-10 sm:py-12 rounded-3xl bg-[#13161c] border border-slate-800/80 shadow-2xl mx-3 sm:mx-4 lg:mx-auto text-white overflow-hidden">
          <div className="mb-4 px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              {t[lang].testimoni.title1}{" "}
              <span className="text-blue-500">{t[lang].testimoni.title2}</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-8 sm:mb-10 px-4 sm:px-6">
            {t[lang].testimoni.desc}
          </p>

          {/* Slider wrapper — overflow hidden agar card di luar tidak bocor */}
          <div className="w-full overflow-hidden">
            <div
              className="flex gap-4 sm:gap-6 items-stretch transition-transform duration-500 ease-out py-4 sm:py-6 px-4 sm:px-6"
              style={{
                transform: `translateX(calc(50% - 45vw - (${currentIdx} * (90vw + 16px))))`,
              }}
            >
              {testimonials.map((tItem, idx) => {
                const isActive = idx === currentIdx;
                return (
                  <div
                    key={tItem.id}
                    className={`w-[90vw] sm:w-[440px] shrink-0 border rounded-2xl p-5 sm:p-6 text-left relative transition-all duration-500 flex flex-col justify-between min-h-[200px] sm:min-h-[220px] bg-[#1c1f26] ${
                      isActive
                        ? "border-blue-500 opacity-100 scale-100 z-10 shadow-2xl shadow-blue-500/10"
                        : "border-slate-800/80 opacity-40 scale-95"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1 mb-3 text-orange-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" />
                        ))}
                        <span className="text-[11px] font-bold text-slate-300 ml-1">
                          5.0
                        </span>
                      </div>
                      <p className="text-xs font-semibold leading-relaxed mb-5 sm:mb-6 text-white">
                        "{tItem.quote}"
                      </p>
                    </div>
                    <div className="flex justify-between items-end border-t border-slate-800/60 pt-4">
                      <div className="flex items-center gap-3">
                        {/* Perbaikan: Menampilkan Foto Avatar Client dari Dashboard */}
                        {tItem.avatar_url ? (
                          <img
                            src={tItem.avatar_url}
                            alt={tItem.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-700 shadow-sm"
                            onError={(e) => {
                              // Jika link gambar rusak/error, otomatis switch balik ke tampilan inisial teks
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}

                        <div
                          className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden uppercase shrink-0"
                          style={{
                            display: tItem.avatar_url ? "none" : "flex",
                          }}
                        >
                          {tItem.name.substring(0, 2)}
                        </div>

                        <div>
                          <h4 className="text-xs font-black text-white">
                            {tItem.name}
                          </h4>
                          <p className="text-[10px] text-slate-300 font-medium">
                            {tItem.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tombol navigasi slider */}
          <div className="flex justify-center items-center gap-3 mt-4 sm:mt-6 px-6">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${currentIdx === 0 ? "border-slate-800 text-slate-600 cursor-not-allowed bg-transparent" : "border-slate-700 text-white bg-blue-600 hover:bg-blue-700"}`}
            >
              <ArrowLeft size={16} />
            </button>
            {/* Dot indicator */}
            <div className="flex gap-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`rounded-full transition-all duration-300 ${idx === currentIdx ? "w-5 h-2 bg-blue-500" : "w-2 h-2 bg-slate-600"}`}
                />
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentIdx((prev) =>
                  Math.min(testimonials.length - 1, prev + 1),
                )
              }
              disabled={currentIdx === testimonials.length - 1}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${currentIdx === testimonials.length - 1 ? "border-slate-800 text-slate-600 cursor-not-allowed bg-transparent" : "border-slate-700 text-white bg-blue-600 hover:bg-blue-700"}`}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* SEKSI BRIEF PROYEK */}
      <section
        id="brief"
        ref={briefRef}
        className={`w-full py-16 sm:py-20 px-4 sm:px-6 border-t border-b transition-all duration-1000 transform ${briefVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${isDarkMode ? "bg-[#112E81] border-slate-900" : "bg-[#25343F] border-slate-800"}`}
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-12 items-center">
          <div className="text-left space-y-4">
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "text-blue-400" : "text-blue-300"}`}
            >
              {t[lang].brief.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              {t[lang].brief.title1} <br /> {t[lang].brief.title2}
            </h2>
            <p
              className={`text-xs sm:text-sm leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-slate-300"}`}
            >
              {t[lang].brief.desc}
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0"></span>
              {t[lang].brief.alert}
            </div>
          </div>

          <div
            className={`w-full max-w-md mx-auto border rounded-2xl p-5 sm:p-6 shadow-xl transition-all ${isDarkMode ? "bg-[#0b0e14] border-white/10 text-white" : "bg-white border-blue-200 text-slate-900 shadow-md"}`}
          >
            <span className="text-[10px] font-black text-blue-600 uppercase block mb-3 tracking-wider">
              {t[lang].brief.formTitle}
            </span>
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label
                  className={`block mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-800 font-bold"}`}
                >
                  {t[lang].brief.labelDomain}
                </label>
                <input
                  type="text"
                  value={briefForm.domainName}
                  onChange={(e) =>
                    setBriefForm({ ...briefForm, domainName: e.target.value })
                  }
                  placeholder={t[lang].brief.placeholderDomain}
                  className={`w-full border rounded-xl p-2.5 outline-none transition-all ${isDarkMode ? "bg-[#11141c] border-slate-800 text-white focus:border-blue-500" : "bg-white border-slate-200 text-slate-900 focus:border-blue-500"}`}
                />
              </div>
              <div>
                <label
                  className={`block mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-800 font-bold"}`}
                >
                  {t[lang].brief.labelReq}
                </label>
                <textarea
                  rows="3"
                  value={briefForm.systemRequirement}
                  onChange={(e) =>
                    setBriefForm({
                      ...briefForm,
                      systemRequirement: e.target.value,
                    })
                  }
                  placeholder={t[lang].brief.placeholderReq}
                  className={`w-full border rounded-xl p-2.5 outline-none resize-none transition-all ${isDarkMode ? "bg-[#11141c] border-slate-800 text-white focus:border-blue-500" : "bg-white border-slate-200 text-slate-900 focus:border-blue-500"}`}
                ></textarea>
              </div>
              <div>
                <label
                  className={`block mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-800 font-bold"}`}
                >
                  {t[lang].brief.labelBudget}
                </label>
                <select
                  value={briefForm.estimatedBudget}
                  onChange={(e) =>
                    setBriefForm({
                      ...briefForm,
                      estimatedBudget: e.target.value,
                    })
                  }
                  className={`w-full border rounded-xl p-2.5 outline-none transition-all ${isDarkMode ? "bg-[#11141c] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
                >
                  <option value="Starter - Rp 500.000">
                    Starter - Rp 500.000
                  </option>
                  <option value="Basic Hosting - Rp 1.000.000">
                    Basic Hosting - Rp 1.000.000
                  </option>
                  <option value="Full Setup - Rp 1.200.000+">
                    Full Setup - Rp 1.200.000+
                  </option>
                  <option value="Custom Enterprise - Rp 5.000.000+">
                    Custom Enterprise - Rp 5.000.000+
                  </option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleSendWhatsApp}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all text-[11px]"
                >
                  <MessageCircle size={14} /> {t[lang].brief.btnWA}
                </button>
                <button
                  onClick={handleSendGmail}
                  className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all text-[11px]"
                >
                  <Mail size={14} /> {t[lang].brief.btnGmail}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEKSI FAQ */}
      <section
        id="faq"
        ref={faqRef}
        className={`w-full py-16 sm:py-20 px-4 sm:px-6 border-b transition-all duration-1000 transform ${faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${isDarkMode ? "bg-[#020408] border-slate-900" : "bg-[#112E81] border-blue-800"}`}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "text-blue-400" : "text-blue-200"}`}
            >
              {t[lang].faq.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-white">
              {t[lang].faq.title}
            </h2>
          </div>
          <div className="space-y-4">
            {faqData.map((faq) => {
              const isOpen = activeFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${isDarkMode ? "bg-[#13161c] border-slate-800/80 hover:border-slate-700" : "bg-white border-blue-200/50 hover:border-blue-300"} ${isOpen ? "shadow-md" : ""}`}
                >
                  <button
                    onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left transition-colors outline-none"
                  >
                    <span
                      className={`text-xs sm:text-sm font-bold tracking-tight transition-colors pr-3 ${isOpen ? "text-blue-600" : isDarkMode ? "text-slate-200" : "text-slate-800"}`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`p-1.5 rounded-xl shrink-0 transition-all ${isOpen ? "bg-blue-600/10 text-blue-600 rotate-180" : isDarkMode ? "bg-slate-800 text-slate-400" : "bg-blue-50 text-blue-600"}`}
                    >
                      {isOpen ? <X size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${isOpen ? (isDarkMode ? "max-h-52 border-t border-slate-800/60 bg-[#11141c]" : "max-h-52 border-t border-blue-100 bg-blue-50/40") : "max-h-0"}`}
                  >
                    <p
                      className={`p-5 sm:p-6 text-[11px] sm:text-xs leading-relaxed ${isDarkMode ? "text-slate-200 font-medium" : "text-slate-600"}`}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className={`w-full py-14 sm:py-16 px-4 sm:px-6 lg:px-20 border-t transition-colors duration-300 ${isDarkMode ? "bg-[#112E81] border-slate-900" : "bg-white border-blue-100"}`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div
              className={`font-bold text-sm font-mono flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-black text-xs">
                X
              </span>
              XAF7 Studio
            </div>
            <p
              className={`text-[11px] leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              {t[lang].footer.desc}
            </p>
          </div>

          <div>
            <h4
              className={`text-xs font-black uppercase tracking-wider mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {t[lang].footer.navTitle}
            </h4>
            <ul
              className={`space-y-2 text-[11px] font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              <li>
                <button
                  onClick={() => scrollToSection("showcase")}
                  className="hover:text-blue-500 transition-colors"
                >
                  {t[lang].footer.srv}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("brief")}
                  className="hover:text-blue-500 transition-colors"
                >
                  {t[lang].footer.start}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("testimoni")}
                  className="hover:text-blue-500 transition-colors"
                >
                  {t[lang].footer.port}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4
              className={`text-xs font-black uppercase tracking-wider mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {t[lang].footer.contactTitle}
            </h4>
            <div
              className={`text-[11px] font-semibold space-y-2 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              <p>kontak@xaf7studio.com</p>
              <p>{t[lang].footer.loc}</p>
            </div>
          </div>

          <div>
            <h4
              className={`text-xs font-black uppercase tracking-wider mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {t[lang].footer.infoTitle}
            </h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t[lang].footer.holderEmail}
                className={`w-full text-[11px] p-2 rounded-lg border outline-none ${isDarkMode ? "bg-[#0b0e14] border-slate-800 text-white" : "bg-white border-blue-100 text-slate-900 focus:border-blue-500"}`}
              />
              <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all shrink-0">
                ➔
              </button>
            </div>
          </div>
        </div>

        <div
          className={`max-w-7xl mx-auto mt-10 sm:mt-12 pt-6 sm:pt-8 border-t flex flex-col md:flex-row justify-between items-center text-[10px] font-bold gap-3 sm:gap-4 ${isDarkMode ? "border-slate-900 text-slate-500" : "border-slate-100 text-slate-600"}`}
        >
          <p>
            © {new Date().getFullYear()} {t[lang].footer.rights}
          </p>
          <div className="flex gap-4 underline">
            <a href="#" className="hover:text-blue-500">
              User Terms & Conditions
            </a>
            <a href="#" className="hover:text-blue-500">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>

      {/* CHATBOT */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
        {isChatOpen ? (
          <div className="w-72 sm:w-80 h-[400px] sm:h-[420px] rounded-2xl bg-gradient-to-b from-indigo-900 to-blue-950 border border-blue-500/30 shadow-2xl p-4 flex flex-col justify-between text-white relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <Cat size={16} className="animate-bounce" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black tracking-tight">
                    XAF7 Assistant
                  </h4>
                  <p className="text-[8px] text-emerald-400 font-mono">
                    ● Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 flex flex-col text-left">
              {chatStep === "welcome" ? (
                <>
                  <div className="bg-white/10 text-white/90 px-3 py-2 rounded-xl rounded-tl-none text-[11px] max-w-[85%] self-start border border-white/5">
                    {chatbotGreeting.welcome}
                  </div>
                  <div className="bg-white/10 text-white/90 px-3 py-2 rounded-xl rounded-tl-none text-[11px] max-w-[85%] self-start border border-white/5">
                    {chatbotGreeting.subWelcome}
                  </div>
                  <div className="bg-white/10 text-white/90 px-3 py-2 rounded-xl rounded-tl-none text-[11px] max-w-[85%] self-start border border-white/5 font-bold text-blue-400">
                    {chatbotGreeting.question}
                  </div>
                  <div className="flex flex-col gap-2 pt-2 items-end">
                    {chatbotConfig.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setChatStep("selected");
                          setSelectedOption(item);
                        }}
                        className="bg-white text-slate-900 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-md transition-all border border-slate-200 text-right"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-600 text-white px-3 py-1.5 rounded-xl rounded-tr-none text-[11px] max-w-[80%] self-end font-bold shadow-sm">
                    {selectedOption?.label}
                  </div>
                  <div className="bg-white/10 text-white/90 px-3 py-2 rounded-xl rounded-tl-none text-[11px] max-w-[85%] self-start border border-white/5">
                    {selectedOption?.responseMessage}
                  </div>
                  <div className="flex flex-col gap-2 pt-4 items-end">
                    <button
                      onClick={() => {
                        if (selectedOption?.targetSection)
                          scrollToSection(selectedOption.targetSection);
                        setIsChatOpen(false);
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-[11px] font-black tracking-wide shadow-md transition-all"
                    >
                      {t[lang].chatbot.btnGo}
                    </button>
                    <button
                      onClick={() => setChatStep("welcome")}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-[10px] font-bold transition-all border border-white/10"
                    >
                      {t[lang].chatbot.btnBack}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="text-[9px] text-center text-white/33 border-t border-white/10 pt-2 font-bold tracking-wider uppercase">
              Powered by XAF7 Engine
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-2 group">
            <div className="bg-white text-slate-900 border border-slate-200 px-3 sm:px-4 py-2 rounded-2xl rounded-br-none shadow-xl text-xs font-black tracking-tight relative">
              {t[lang].chatbot.bubble}
              <div className="absolute right-3 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45"></div>
            </div>
            <button
              onClick={() => {
                setIsChatOpen(true);
                setChatStep("welcome");
              }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white relative overflow-hidden"
            >
              <Cat
                size={22}
                className="transform group-hover:rotate-12 transition-transform"
              />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-white animate-ping"></span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
