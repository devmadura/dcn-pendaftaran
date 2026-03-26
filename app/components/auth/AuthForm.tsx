import { useState, useEffect, type FormEvent } from "react";
import { IconLoader2, IconCheck, IconX, IconChevronDown } from "@tabler/icons-react";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabase";
import { useNimValidation } from "../../hooks/useNimValidation";
import { useProdiData } from "../../hooks/useProdiData";
interface AuthFormProps {
  mounted: boolean;
}

export function AuthForm({ mounted }: AuthFormProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nim, setNim] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [prodi, setProdi] = useState("");

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { isValidating, nimValidity, studentName } = useNimValidation(nim);
  const { prodiList, loading: loadingProdi } = useProdiData();

  useEffect(() => {
    if (!isLoginMode && nimValidity === 'valid') {
      if (studentName) setNama(studentName);
      if (nim.length >= 4) setAngkatan(nim.substring(0, 4));

      setErrors(p => ({ ...p, nama: undefined, angkatan: undefined }));
    } else if (!isLoginMode && nimValidity === 'invalid') {
      setNama("");
      setAngkatan("");
    }
  }, [nimValidity, studentName, nim, isLoginMode]);

  const [errors, setErrors] = useState<{
    nama?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    nim?: string;
    angkatan?: string;
    prodi?: string;
  }>({});

  useEffect(() => {
    setErrors({});
    setServerError("");
    setSuccessMsg("");
  }, [isLoginMode]);

  useEffect(() => {
    const loginError = sessionStorage.getItem('login_error');
    if (loginError) {
      setServerError(loginError);
      sessionStorage.removeItem('login_error');
    }
  }, []);

  const validateNama = (val: string) => {
    if (isLoginMode) return null;
    if (!val.trim()) return 'Nama lengkap wajib diisi';
    if (val.trim().length < 2) return 'Nama terlalu pendek';
    return null;
  };

  const validateNim = (val: string) => {
    if (isLoginMode) return null;
    if (!val.trim()) return 'NIM wajib diisi';
    return null;
  };

  const validateAngkatan = (val: string) => {
    if (isLoginMode) return null;
    if (!val.trim()) return 'Angkatan wajib diisi';
    return null;
  };

  const validateProdi = (val: string) => {
    if (isLoginMode) return null;
    if (!val.trim()) return 'Program Studi wajib diisi';
    return null;
  };

  const validateEmail = (val: string) => {
    if (!val.trim()) return 'Email wajib diisi';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) return 'Format email tidak valid';
    return null;
  };

  const validatePassword = (val: string) => {
    if (!val) return 'Kata sandi wajib diisi';
    if (!isLoginMode && val.length < 6) return 'Minimal 6 karakter';
    return null;
  };

  const validateConfirmPassword = (val: string) => {
    if (isLoginMode) return null;
    if (!val) return 'Konfirmasi wajib diisi';
    if (val !== password) return 'Kata sandi tidak cocok';
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");

    const namaErr = validateNama(nama);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword);
    const nimErr = validateNim(nim);
    const angkatanErr = validateAngkatan(angkatan);
    const prodiErr = validateProdi(prodi);

    const isNimApiInvalid = !isLoginMode && nimValidity === 'invalid';

    setErrors({
      nama: namaErr || undefined,
      email: emailErr || undefined,
      password: passErr || undefined,
      confirmPassword: confirmErr || undefined,
      nim: nimErr || (isNimApiInvalid ? 'NIM tidak terdaftar di sistem UNIRA' : undefined),
      angkatan: angkatanErr || undefined,
      prodi: prodiErr || undefined,
    });

    if (namaErr || emailErr || passErr || confirmErr || nimErr || isNimApiInvalid || angkatanErr || prodiErr) {
      return;
    }

    setLoading(true);

    if (!isLoginMode) {
      const { data: existingNim } = await supabase.from('accounts').select('id').eq('nim', nim).maybeSingle();
      if (existingNim) {
        setServerError("NIM sudah terdaftar, hubungi admin jika ini kesalahan");
        setLoading(false);
        return;
      }

      const { data: existingEmail } = await supabase.from('accounts').select('id').eq('email', email).maybeSingle();
      if (existingEmail) {
        setServerError("Email sudah digunakan");
        setLoading(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setServerError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        const { error: insertError } = await supabase.from('accounts').insert({
          user_id: authData.user.id,
          nim,
          email,
          nama,
          angkatan,
          prodi,
          status: 'pending'
        });

        if (insertError) {
          setServerError("Gagal menyimpan data profil.");
        } else {
          setSuccessMsg("Pendaftaran berhasil! Tunggu persetujuan admin sebelum bisa login.");
          setNama("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setNim("");
          setAngkatan("");
          setProdi("");
        }
      }
      setLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Email not confirmed") || error.message.toLowerCase().includes("verify")) {
          setServerError("Verifikasi email kamu terlebih dahulu");
        } else {
          setServerError("Email atau password salah");
        }
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 order-1 lg:order-2">
      <div className={cn("glass-card border border-white/10 rounded-[32px] p-6 sm:p-8 md:p-10 w-full max-w-[540px] shadow-2xl mx-auto transition-all duration-1000 delay-300 transform relative overflow-hidden", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12")}>
        <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-primary-light to-transparent opacity-50"></div>

        {/* Mode Toggle Tabs */}
        <div className="flex p-1 bg-black/40 rounded-2xl mb-8">
          <button
            onClick={() => setIsLoginMode(true)}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-all duration-300 cursor-pointer",
              isLoginMode
                ? "bg-white/10 text-white shadow-sm border border-white/5"
                : "text-white/40 hover:text-white/80"
            )}
          >
            Masuk Akun
          </button>
          <button
            onClick={() => setIsLoginMode(false)}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-all duration-300 cursor-pointer",
              !isLoginMode
                ? "bg-white/10 text-white shadow-sm border border-white/5"
                : "text-white/40 hover:text-white/80"
            )}
          >
            Daftar Baru
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-semibold mb-2">
            {isLoginMode ? "Selamat Datang Kembali" : "Buat Akun"}
          </h2>
          <p className="text-white/60 text-sm">
            {isLoginMode
              ? "Masukkan email dan kata sandi untuk melanjutkan."
              : "Lengkapi data di bawah untuk membuat akun baru khusus mahasiswa UNIRA."}
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-pulse">
            {serverError}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm animate-pulse">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {/* Field Khusus mode Daftar */}
          {!isLoginMode && (
            <>
              {/* NIM Di Atas */}
              <div className="space-y-2 animate-[fadeIn_0.5s_ease-out]">
                <label htmlFor="nim" className="block text-sm font-medium text-white/90">
                  NIM <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="nim"
                    value={nim}
                    onChange={e => setNim(e.target.value)}
                    onBlur={() => setErrors(p => ({ ...p, nim: validateNim(nim) || undefined }))}
                    className={cn("form-input w-full", errors.nim && "form-input-error")}
                    placeholder="Contoh: 2023010001"
                  />
                  {nim.length >= 10 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pr-1">
                      {isValidating ? <IconLoader2 className="animate-spin text-white/50" size={18} /> :
                        nimValidity === 'valid' ? <IconCheck className="text-green-400" size={18} /> :
                          nimValidity === 'invalid' ? <IconX className="text-red-400" size={18} /> : null}
                    </div>
                  )}
                </div>
                {errors.nim && <p className="text-xs text-red-400">{errors.nim}</p>}
                {nimValidity === 'invalid' && !isValidating && nim.length >= 10 && (
                  <p className="text-xs text-red-400">NIM tidak terdaftar sebagai mahasiswa UNIRA</p>
                )}
              </div>

              {/* Nama (Auto-fill) */}
              <div className="space-y-2 animate-[fadeIn_0.5s_ease-out]">
                <label htmlFor="nama" className="block text-sm font-medium text-white/90">
                  Nama Lengkap <span className="text-white/50 text-xs ml-1">(Otomatis)</span>
                </label>
                <input
                  type="text"
                  id="nama"
                  value={nama}
                  readOnly
                  className={cn("form-input w-full bg-black/30 text-white/70 cursor-not-allowed", errors.nama && "form-input-error")}
                  placeholder="Terisi otomatis dari NIM"
                />
                {errors.nama && <p className="text-xs text-red-400">{errors.nama}</p>}
              </div>

              {/* Angkatan (Auto-fill) */}
              <div className="space-y-2 animate-[fadeIn_0.5s_ease-out]">
                <label htmlFor="angkatan" className="block text-sm font-medium text-white/90">
                  Tahun Angkatan <span className="text-white/50 text-xs ml-1">(Otomatis)</span>
                </label>
                <input
                  type="text"
                  id="angkatan"
                  value={angkatan}
                  readOnly
                  className={cn("form-input w-full bg-black/30 text-white/70 cursor-not-allowed", errors.angkatan && "form-input-error")}
                  placeholder="Terisi otomatis dari NIM"
                />
                {errors.angkatan && <p className="text-xs text-red-400">{errors.angkatan}</p>}
              </div>

              {/* Prodi (Dropdown API) */}
              <div className="space-y-2 animate-[fadeIn_0.5s_ease-out]">
                <label htmlFor="prodi" className="block text-sm font-medium text-white/90">
                  Program Studi <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="prodi"
                    value={prodi}
                    onChange={e => setProdi(e.target.value)}
                    onBlur={() => setErrors(p => ({ ...p, prodi: validateProdi(prodi) || undefined }))}
                    className={cn("form-input w-full appearance-none", errors.prodi && "form-input-error", !prodi && "text-white/40")}
                    disabled={loadingProdi}
                  >
                    <option value="" disabled>{loadingProdi ? "Memuat prodi dari sistem..." : "Pilih Program Studi"}</option>
                    {prodiList.map(p => (
                      <option key={p.id} value={p.nama} className="bg-[#1a1a2e] text-white py-2">
                        {p.nama}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={20} />
                </div>
                {errors.prodi && <p className="text-xs text-red-400">{errors.prodi}</p>}
              </div>
            </>
          )}

          {/* Email (Kedua Mode) */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white/90">
              Alamat Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setErrors(p => ({ ...p, email: validateEmail(email) || undefined }))}
              className={cn("form-input", errors.email && "form-input-error")}
              placeholder="nama@gmail.com"
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
          </div>

          {/* Password (Kedua Mode) */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-white/90">
              Kata Sandi <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onBlur={() => setErrors(p => ({ ...p, password: validatePassword(password) || undefined }))}
              className={cn("form-input", errors.password && "form-input-error")}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
          </div>

          {/* Confirm Password (Hanya Mode Daftar) */}
          {!isLoginMode && (
            <div className="space-y-2 animate-[fadeIn_0.5s_ease-out]">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90">
                Konfirmasi Kata Sandi <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onBlur={() => setErrors(p => ({ ...p, confirmPassword: validateConfirmPassword(confirmPassword) || undefined }))}
                className={cn("form-input", errors.confirmPassword && "form-input-error")}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 relative overflow-hidden group w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary-base to-[#ec4899] text-white font-medium hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <IconLoader2 className="animate-spin" size={20} />
                  Memproses...
                </>
              ) : (
                <>{isLoginMode ? "Masuk ke Portal" : "Daftar Akun Baru"}</>
              )}
            </span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            {isLoginMode
              ? "Belum punya akun? Buat pendaftaran simulasi di sini."
              : "Sudah punya akun? Masuk menggunakan email sekarang."}
          </button>
        </div>
      </div>
    </div>
  );
}
