import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { AdminPanel } from "../AdminPanel";
import { ProfileCard } from "../ProfileCard";
import { BiodataForm } from "../BiodataForm";
import { IconDeviceDesktopAnalytics, IconActivityHeartbeat } from "@tabler/icons-react";

interface AdminDashboardProps {
  mounted: boolean;
  userData: {
    nama: string;
    email: string;
    status: string;
    nim: string;
    angkatan: string;
    prodi: string;
    isProfileComplete: boolean;
    isAdmin: boolean;
  };
  pendingUsers: any[];
  onReviewUser: (id: number, status: "active" | "rejected") => Promise<void>;
  onBiodataSuccess: (nim: string, angkatan: string) => void;
}

export function AdminDashboard({
  mounted,
  userData,
  pendingUsers,
  onReviewUser,
  onBiodataSuccess,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className={`transition-all duration-700 delay-100 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {activeTab === "Dashboard" && (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center">
                   <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                      <IconDeviceDesktopAnalytics className="text-purple-400" size={24} />
                   </div>
                   <h3 className="text-3xl font-display font-medium text-white">{pendingUsers.length}</h3>
                   <p className="text-sm text-white/50 bg-white/5 px-3 py-1 mt-2 rounded-full border border-white/5">Pendaftar Pending</p>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center">
                   <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                      <IconActivityHeartbeat className="text-emerald-400" size={24} />
                   </div>
                   <h3 className="text-3xl font-display font-medium text-white">Sistem Aktif</h3>
                   <p className="text-sm text-white/50 bg-white/5 px-3 py-1 mt-2 rounded-full border border-white/5">Status Node</p>
                </div>
             </div>
             <div className="p-6 sm:p-8 glass-card border border-white/5 rounded-2xl bg-[#111116]/80 text-white/60">
                 <p>Ringkasan dashboard akan diperbarui di rilis selanjutnya. Anda dapat menggunakan menu lain untuk mengatur kontributor dan profil Anda.</p>
             </div>
          </div>
        )}

        {activeTab === "Verifikasi Pengguna" && (
          <div className="space-y-6">
            <AdminPanel
               pendingUsers={pendingUsers}
               onReviewUser={onReviewUser}
            />
          </div>
        )}

        {activeTab === "Profil Core Team" && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <ProfileCard mounted={mounted} userData={userData} />
             <div className="lg:col-span-8 flex flex-col gap-6">
                <BiodataForm
                  isProfileComplete={userData.isProfileComplete}
                  onSuccess={onBiodataSuccess}
                />
             </div>
           </div>
        )}
      </div>
    </AdminLayout>
  );
}
