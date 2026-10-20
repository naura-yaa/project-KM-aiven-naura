"use client";

import { useState } from "react";
import { Lock, Mail, User, MessageCircle } from "lucide-react";
import { User as UserType } from "@/app/types";

interface AuthFormProps {
  onLoginSuccess: (user: UserType) => void;
}

export default function AuthForm({ onLoginSuccess }: AuthFormProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [regNama, setRegNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("Email dan password wajib diisi!");
    onLoginSuccess({
      nama: email.split("@")[0],
      email: email,
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNama || !email || !password) return alert("Semua kolom wajib diisi!");
    onLoginSuccess({
      nama: regNama,
      email: email,
    });
    alert("Registrasi berhasil! Selamat datang di KuyMakan 🍲");
  };

  const handleSocialLogin = (provider: string) => {
    onLoginSuccess({
      nama: `User ${provider}`,
      email: `user@${provider.toLowerCase()}.com`,
    });
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80"
          alt="KuyMakan Banner"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-12 flex flex-col justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-orange-600 to-amber-500 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/30">
              KM
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              KuyMakan
            </span>
          </div>
          <div className="space-y-4 max-w-md">
            <span className="bg-orange-500 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Self-Ordering System
            </span>
            <h2 className="text-4xl font-black text-white leading-tight">
              Pesan Makanan Favoritmu Tanpa Antre!
            </h2>
            <p className="text-gray-300 text-sm">
              Pilih menu lezat pilihanmu, dapatkan Kode QR instan, dan lakukan pembayaran secara cepat di kasir KuyMakan.
            </p>
          </div>
          <p className="text-xs text-gray-400">
            © 2026 KuyMakan Culinary Inc. All rights reserved.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md space-y-6">
          <div>
            <div className="flex items-center space-x-2 lg:hidden mb-4">
              <div className="w-10 h-10 bg-orange-500 text-white rounded-2xl flex items-center justify-center font-black text-sm">
                KM
              </div>
              <span className="text-xl font-black text-gray-900">KuyMakan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {authMode === "login" ? "Selamat Datang!" : "Buat Akun Baru"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {authMode === "login"
                ? "Masuk ke akun kamu untuk mulai memesan makanan"
                : "Daftar sekarang untuk menikmati sajian lezat KuyMakan"}
            </p>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`w-1/2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                authMode === "login"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Masuk 
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`w-1/2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                authMode === "register"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Daftar 
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-2.5 rounded-xl text-xs font-bold text-gray-700 transition cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("WhatsApp")}
              className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              WhatsApp
            </button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {authMode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="Masukkan Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-orange-500 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-orange-500 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-lg shadow-orange-200 cursor-pointer mt-2"
              >
                Masuk Sekarang
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Masukkan Nama Lengkap"
                    value={regNama}
                    onChange={(e) => setRegNama(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-orange-500 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="Masukkan Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-orange-500 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="Masukkan Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-orange-500 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-lg shadow-orange-200 cursor-pointer mt-2"
              >
                Masuk
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}