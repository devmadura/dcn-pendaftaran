import { useState, useEffect, type FormEvent } from "react";
import {
  IconChevronDown,
  IconLoader2,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabase/supabase";
import { useNimValidation } from "../../hooks/useNimValidation";

interface BiodataFormProps {
  isProfileComplete: boolean;
  onSuccess: (nim: string, angkatan: string) => void;
}

export function BiodataForm({
  isProfileComplete,
  onSuccess,
}: BiodataFormProps) {
  const [formNim, setFormNim] = useState("");
  const [formAngkatan, setFormAngkatan] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    nim?: string;
    angkatan?: string;
  }>({});

  const { isValidating, nimValidity, studentName } = useNimValidation(formNim);

  useEffect(() => {
    if (nimValidity === "valid") {
      if (formNim.length >= 4) {
        setFormAngkatan(formNim.substring(0, 4));
        setFormErrors((p) => ({ ...p, angkatan: undefined }));
      }
    } else if (nimValidity === "invalid") {
      setFormAngkatan("");
    }
  }, [nimValidity, formNim]);

  const validateNIM = (val: string) => {
    if (!val.trim()) return "NIM wajib diisi";
    if (!/^\d+$/.test(val.trim())) return "NIM hanya boleh berisi angka";
    if (val.trim().length < 5) return "NIM terlalu pendek";
    return null;
  };

  const validateAngkatan = (val: string) => {
    if (!val) return "Angkatan wajib dipilih";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nimErr = validateNIM(formNim);
    const angkatanErr = validateAngkatan(formAngkatan);

    const isNimApiInvalid = nimValidity === "invalid";

    setFormErrors({
      nim:
        nimErr ||
        (isNimApiInvalid ? "NIM tidak terdaftar di sistem UNIRA" : undefined),
      angkatan: angkatanErr || undefined,
    });

    if (nimErr || isNimApiInvalid || angkatanErr) return;

    setFormLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      const { error } = await supabase
        .from("accounts")
        .update({
          nim: formNim.trim(),
          angkatan: formAngkatan,
        })
        .eq("user_id", session.user.id);

      if (!error) {
        onSuccess(formNim.trim(), formAngkatan);
      }
    }

    setFormLoading(false);
  };

  if (isProfileComplete) {
    return (
      <div className="mt-4 p-8 border border-white/5 bg-white/5 rounded-[24px] text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
          <IconCheck className="text-green-400" size={24} />
        </div>
        <h3 className="text-lg font-semibold text-white/90">
          Data Profil Sudah Lengkap
        </h3>
        <p className="text-sm text-white/50 max-w-md mx-auto mt-2">
          NIM dan Tahun Angkatan sudah tersimpan di sistem. Tim kami akan segera
          memproses verifikasi berkas kamu.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-6 sm:p-8 glass-card border border-white/10 rounded-[24px]">
      <h3 className="text-xl font-semibold mb-2 text-white/90">
        Lengkapi Biodata
      </h3>
      <p className="text-sm text-white/50 mb-8">
        Data ini wajib diisi sesuai dengan identitas akademik Universitas
        Madura.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="formNim"
              className="block text-sm font-medium text-white/80"
            >
              NIM (Nomor Induk Mahasiswa)
            </label>
            <div className="relative">
              <input
                type="text"
                id="formNim"
                value={formNim}
                onChange={(e) => setFormNim(e.target.value)}
                onBlur={() =>
                  setFormErrors((p) => ({
                    ...p,
                    nim: validateNIM(formNim) || undefined,
                  }))
                }
                className={cn(
                  "form-input w-full",
                  formErrors.nim && "form-input-error",
                )}
                placeholder="Contoh: 2023010001"
                maxLength={20}
                inputMode="numeric"
              />
              {formNim.length >= 10 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pr-1">
                  {isValidating ? (
                    <IconLoader2
                      className="animate-spin text-white/50"
                      size={18}
                    />
                  ) : nimValidity === "valid" ? (
                    <IconCheck className="text-green-400" size={18} />
                  ) : nimValidity === "invalid" ? (
                    <IconX className="text-red-400" size={18} />
                  ) : null}
                </div>
              )}
            </div>
            {formErrors.nim && (
              <p className="text-xs text-red-400">{formErrors.nim}</p>
            )}
            {nimValidity === "valid" && studentName && (
              <p className="text-xs text-green-400 font-medium">
                ✨ {studentName}
              </p>
            )}
            {nimValidity === "invalid" &&
              !isValidating &&
              formNim.length >= 10 && (
                <p className="text-xs text-red-400">
                  NIM tidak terdaftar di sistem UNIRA
                </p>
              )}
          </div>

          <div className="space-y-2 relative">
            <label
              htmlFor="formAngkatan"
              className="block text-sm font-medium text-white/80"
            >
              Tahun Angkatan{" "}
              <span className="text-white/50 text-xs ml-1">(Otomatis)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="formAngkatan"
                value={formAngkatan}
                readOnly
                className={cn(
                  "form-input w-full bg-black/30 text-white/70 cursor-not-allowed",
                  formErrors.angkatan && "form-input-error",
                )}
                placeholder="Terisi otomatis dari NIM"
              />
            </div>
            {formErrors.angkatan && (
              <p className="text-xs text-red-400">{formErrors.angkatan}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={formLoading}
            className="relative overflow-hidden group py-3 px-8 rounded-xl bg-primary-base hover:bg-primary-dark text-white font-medium hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {formLoading ? (
                <>
                  <IconLoader2 className="animate-spin" size={20} />
                  Menyimpan...
                </>
              ) : (
                <>Simpan Biodata</>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
