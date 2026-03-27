import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi')
});

export const createRegisterSchema = (nimValidity: string, studentName: string) => {
  return z.object({
    nim: z.string().min(1, 'NIM wajib diisi').refine(() => nimValidity !== 'invalid', {
      message: 'NIM tidak terdaftar sebagai mahasiswa UNIRA'
    }),
    nama: z.string().min(1, 'Nama wajib diisi').refine(val => {
      if (nimValidity !== 'valid') return true;
      return val.trim().toLowerCase() === studentName.toLowerCase();
    }, {
      message: "Nama tidak cocok dengan pangkalan data universitas. Harap sesuaikan dengan ejaan aslinya."
    }),
    angkatan: z.string().min(1, 'Angkatan wajib diisi'),
    prodi: z.string().min(1, 'Program Studi wajib diisi'),
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
    password: z.string().min(6, 'Minimal 6 karakter'),
    confirmPassword: z.string().min(1, 'Konfirmasi wajib diisi')
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"]
  });
};
