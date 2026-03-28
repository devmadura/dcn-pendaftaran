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
    <div
      className={cn(
        "lg:col-span-4 transition-all duration-700 transform",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      )}
    >
      <div className="glass-card rounded-[24px] p-6 text-center">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-dark to-primary-light rounded-full p-1 mb-4">
          <div className="w-full h-full bg-[#13131a] rounded-full flex items-center justify-center">
            <IconUserCircle size={48} className="text-primary-light/50" />
          </div>
        </div>

        <h2 className="text-xl font-display font-semibold text-white truncate px-2 mb-1">
          {userData.nama}
        </h2>
        <p className="text-white/50 text-sm truncate px-2 mb-4">
          {userData.email}
        </p>

        <div className="mb-6 flex justify-center w-full">
          {userData.isAdmin ? (
            <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide">
              👑 Super Admin
            </span>
          ) : (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide">
              🌟 Kontributor
            </span>
          )}
        </div>

        {userData.isProfileComplete && (
          <div className="flex flex-wrap justify-center gap-2 mb-6 text-sm text-white/70">
            <span className="bg-white/10 px-3 py-1 rounded-md border border-white/5">
              {userData.nim}
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-md border border-white/5">
              Tahun {userData.angkatan}
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-md border border-white/5">
              {userData.prodi}
            </span>
          </div>
        )}

        {!userData.isProfileComplete && (
          <div className="h-px w-full bg-white/10 mb-6"></div>
        )}

        {userData.isProfileComplete && (
          <div>
            <a
              href="/generate-id"
              className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-lg
      bg-white/8 hover:bg-white/12 
      border border-white/10 hover:border-white/20
      text-white/80 hover:text-white
      text-sm font-medium
      backdrop-blur-sm
      transition-all duration-200 ease-out
      hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:rotate-3"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              Generate ID Card
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}

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
