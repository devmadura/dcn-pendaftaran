import { IconClockHour4, IconCheck, IconX, IconAlertCircle } from "@tabler/icons-react";
import { cn } from "../../lib/utils";

interface StatusCardProps {
  status: string;
  isProfileComplete: boolean;
}

const statusConfig: Record<string, any> = {
  'Pending': {
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
    icon: <IconClockHour4 size={24} className="text-yellow-400" />,
    title: 'Menunggu Verifikasi',
    desc: 'Berkas kamu sedang dalam antrean verifikasi tim DCN UNIRA. Pastikan data profil sudah lengkap.'
  },
  'active': {
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
    icon: <IconCheck size={24} className="text-green-400" />,
    title: 'Pendaftaran Diterima!',
    desc: 'Selamat! Akun kamu sudah diverifikasi. Kamu resmi terdaftar sebagai kontributor.'
  },
  'rejected': {
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    icon: <IconX size={24} className="text-red-400" />,
    title: 'Perlu Perbaikan Data',
    desc: 'Ada data yang tidak sesuai. Silakan hubungi admin untuk informasi lebih lanjut.'
  }
};

export function StatusCard({ status, isProfileComplete }: StatusCardProps) {
  // Use lowercase fallback for consistency with database
  const normalizedStatus = status.toLowerCase() === 'pending' ? 'Pending' : status;
  const currStatus = statusConfig[normalizedStatus] || statusConfig['Pending'];

  return (
    <>
      {!isProfileComplete && (
        <div className="p-6 rounded-[24px] border border-yellow-400/20 bg-yellow-400/10 flex gap-4 items-start animate-pulse mb-6">
          <IconAlertCircle className="text-yellow-400 shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="text-yellow-400 font-semibold mb-1">Peringatan: Lengkapi Biodata Utama</h3>
            <p className="text-white/70 text-sm">
              Verifikasi tidak bisa diproses sebelum kamu mengisi Nomor Induk Mahasiswa (NIM) dan Tahun Angkatan. Silakan lengkapi pada form di bawah ini.
            </p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-display font-semibold mb-4">Status Pendaftaran</h1>
        <div className={cn("p-8 rounded-[24px] border", currStatus.bg, currStatus.border)}>
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className={cn("p-4 rounded-full border bg-black/20 shrink-0", currStatus.border)}>
              {currStatus.icon}
            </div>
            <div>
              <h3 className={cn("text-xl font-semibold mb-2", currStatus.color)}>
                {currStatus.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {currStatus.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
