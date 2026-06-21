import React, { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "./supabaseClient";

export default function AdminLogin({ onLoginSuccess, isDarkMode, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError("Kredensial salah! Akses ditolak.");
      return;
    }

    if (data?.session) {
      onLoginSuccess();
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 ${isDarkMode ? "bg-[#0a0c10]" : "bg-slate-50"}`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl border ${isDarkMode ? "bg-[#13161c] border-slate-800" : "bg-white border-slate-200"} shadow-xl relative`}
      >
        {/* Tombol Kembali di pojok kiri atas */}
        <button
          onClick={onBack}
          className={`absolute top-6 left-6 p-2 rounded-xl transition-all ${
            isDarkMode
              ? "hover:bg-slate-800 text-slate-400"
              : "hover:bg-slate-100 text-slate-600"
          }`}
          title="Kembali ke Beranda"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center mb-8 mt-4">
          <h2
            className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}
          >
            Admin Panel
          </h2>
          <p
            className={`text-xs mt-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
          >
            Masuk untuk mengelola projek & testimoni Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className={`block mb-1 text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              Alamat Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              className={`w-full border rounded-xl px-3.5 py-3 outline-none focus:border-blue-500 transition-all ${isDarkMode ? "bg-[#181b22] border-slate-800 text-white" : "bg-slate-100 border-slate-300 text-slate-900"}`}
            />
          </div>
          <div>
            <label
              className={`block mb-1 text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              Kata Sandi
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className={`w-full border rounded-xl px-3.5 py-3 outline-none focus:border-blue-500 transition-all ${isDarkMode ? "bg-[#181b22] border-slate-800 text-white" : "bg-slate-100 border-slate-300 text-slate-900"}`}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-900/50 text-red-400 rounded-xl font-bold text-xs">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-xs"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk Sekarang"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
