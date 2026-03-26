import { IconUserCircle, IconAlertCircle } from "@tabler/icons-react";
import { cn } from "../../lib/utils";

interface ProfileCardProps {
  mounted: boolean;
  userData: {
    nama: string;
    email: string;
    nim: string;
    angkatan: string;
    prodi: string;
    isAdmin: boolean;
    isProfileComplete: boolean;
  };
}

export function ProfileCard({ mounted, userData }: ProfileCardProps) {
  return (
    <div className={cn("lg:col-span-4 transition-all duration-700 transform", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
      <div className="glass-card rounded-[24px] p-6 text-center">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-dark to-primary-light rounded-full p-1 mb-4">
          <div className="w-full h-full bg-[#13131a] rounded-full flex items-center justify-center">
            <IconUserCircle size={48} className="text-primary-light/50" />
          </div>
        </div>

        <h2 className="text-xl font-display font-semibold text-white truncate px-2 mb-1">{userData.nama}</h2>
        <p className="text-white/50 text-sm truncate px-2 mb-4">{userData.email}</p>

        <div className="mb-6 flex justify-center w-full">
          {userData.isAdmin ? (
            <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide">👑 Super Admin</span>
          ) : (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide">🌟 Kontributor</span>
          )}
        </div>

        {userData.isProfileComplete && (
          <div className="flex flex-wrap justify-center gap-2 mb-6 text-sm text-white/70">
            <span className="bg-white/10 px-3 py-1 rounded-md border border-white/5">{userData.nim}</span>
            <span className="bg-white/10 px-3 py-1 rounded-md border border-white/5">Tahun {userData.angkatan}</span>
            <span className="bg-white/10 px-3 py-1 rounded-md border border-white/5">{userData.prodi}</span>
          </div>
        )}

        {!userData.isProfileComplete && <div className="h-px w-full bg-white/10 mb-6"></div>}

        <div className="space-y-4 text-left">
          {!userData.isProfileComplete && (
            <div className="w-full py-3 px-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center justify-between">
              <span>Biodata Belum Lengkap</span>
              <IconAlertCircle size={16} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
