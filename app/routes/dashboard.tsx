import type { Route } from "./+types/dashboard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { IconLogout } from "@tabler/icons-react";
import { supabase } from "../lib/supabase";
import { ProtectedRoute } from "../components/ProtectedRoute";

import { ProfileCard } from "../components/dashboard/ProfileCard";
import { StatusCard } from "../components/dashboard/StatusCard";
import { BiodataForm } from "../components/dashboard/BiodataForm";
import { AdminPanel } from "../components/dashboard/AdminPanel";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Dashboard Kontributor DCN Universitas Madura" },
    { name: "description", content: "portal kontributor DCN Universitas Madura" },
  ];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  const [userData, setUserData] = useState({
    nama: "Peserta",
    email: "-",
    status: "Pending",
    nim: "",
    angkatan: "",
    prodi: "",
    isProfileComplete: false,
    isAdmin: false
  });

  const [pendingUsers, setPendingUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profile) {
        const { data: adminCheck } = await supabase
          .from('admin')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        const isAdmin = !!adminCheck;

        setUserData({
          nama: profile.nama,
          email: profile.email,
          status: profile.status,
          nim: profile.nim,
          angkatan: profile.angkatan,
          prodi: profile.prodi,
          isProfileComplete: !!(profile.nim && profile.angkatan && profile.prodi),
          isAdmin
        });

        if (isAdmin) {
          const { data: pendingData } = await supabase
            .from('accounts')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

          if (pendingData) setPendingUsers(pendingData);
        }
      }
      setMounted(true);
    }

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleReviewUser = async (accountId: number, newStatus: 'active' | 'rejected') => {
    const { data, error } = await supabase.from('accounts').update({ status: newStatus }).eq('id', accountId).select('id').single();
    if (!error && data) {
      setPendingUsers(prev => prev.filter(u => u.id !== accountId));
    } else {
      alert(`Gagal update (Kemungkinan ditolak pengaturan RLS): ${error?.message || "Data tidak ditemukan"}`);
      console.error("Supabase update error:", error);
    }
  };

  const handleBiodataSuccess = (nim: string, angkatan: string) => {
    setUserData(p => ({
      ...p,
      nim,
      angkatan,
      isProfileComplete: !!(nim && angkatan && p.prodi)
    }));
  };

  if (!mounted) return null;

  return (
    <ProtectedRoute>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/dcn-unira.png" alt="DCN" className="w-[32px] h-[32px] object-contain" />
            <span className="font-display font-semibold hidden sm:block">Dashboard Calon Kontributor</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            <IconLogout size={18} />
            <span className="hidden sm:inline">Keluar Pendaftaran</span>
          </button>
        </div>
      </nav>

      <main className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
        {userData.isAdmin ? (
          <AdminPanel pendingUsers={pendingUsers} onReviewUser={handleReviewUser} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <ProfileCard mounted={mounted} userData={userData} />

            <div className={`lg:col-span-8 flex flex-col gap-6 transition-all duration-700 delay-200 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <StatusCard status={userData.status} isProfileComplete={userData.isProfileComplete} />
              <BiodataForm isProfileComplete={userData.isProfileComplete} onSuccess={handleBiodataSuccess} />
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
