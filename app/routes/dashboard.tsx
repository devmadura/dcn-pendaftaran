import type { Route } from "./+types/dashboard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { IconLogout } from "@tabler/icons-react";
import { ProfileCard } from "../components/dashboard/ProfileCard";
import { StatusCard } from "../components/dashboard/StatusCard";
import { BiodataForm } from "../components/dashboard/BiodataForm";
import { CoreTeamRegistrationForm } from "../components/dashboard/CoreTeamRegistrationForm";
import { getSupabaseMainAdmin, supabase } from "../lib/supabase/supabase";
import { requireActiveUser } from "~/lib/Requireactiveuser";

export async function loader({ request }: Route.LoaderArgs) {
  await requireActiveUser(request);
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "sync") {
    let synced = 0;
    let skipped = 0;

    const { data: activeAccounts, error: fetchError } = await supabase
      .from("accounts")
      .select("*")
      .eq("status", "active");

    if (fetchError || !activeAccounts) {
      return {
        syncResult: {
          synced: 0,
          skipped: 0,
          message: "Gagal mengambil data akun aktif dari portal",
        },
      };
    }

    for (const account of activeAccounts) {
      if (!account.nim) continue;

      const { data: existing, error: checkError } = await getSupabaseMainAdmin()
        .from("kontributor")
        .select("id")
        .eq("nim", account.nim)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking main DB:", checkError);
        continue;
      }

      if (existing) {
        skipped++;
      } else {
        const { error: insertError } = await getSupabaseMainAdmin()
          .from("kontributor")
          .insert({
            nim: account.nim,
            email: account.email,
            nama: account.nama,
            angkatan: account.angkatan,
            prodi: account.prodi,
            total_poin: 0,
          } as any);

        if (insertError) {
          console.error("Error inserting to main DB:", insertError);
        } else {
          synced++;
        }
      }
    }

    return {
      syncResult: {
        synced,
        skipped,
        message: `Sinkronisasi selesai: ${synced} ditambahkan, ${skipped} dilewati.`,
      },
    };
  }

  return null;
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Dashboard Kontributor DCN Universitas Madura" },
    {
      name: "description",
      content: "portal kontributor DCN Universitas Madura",
    },
  ];
}

import { AdminDashboard } from "../components/dashboard/admin/AdminDashboard";

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
    isAdmin: false,
    user_id: "",
  });

  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [isCoreTeamRegistrationOpen, setIsCoreTeamRegistrationOpen] = useState(false);
  const [coreTeamRegistration, setCoreTeamRegistration] = useState<any>(null);

  useEffect(() => {
    async function fetchUserData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        const { data: adminCheck } = await supabase
          .from("admin")
          .select("id")
          .eq("user_id", session.user.id)
          .maybeSingle();

        const isAdmin = !!adminCheck;

        setUserData({
          nama: profile.nama,
          email: profile.email,
          status: profile.status,
          nim: profile.nim,
          angkatan: profile.angkatan,
          prodi: profile.prodi,
          isProfileComplete: !!(
            profile.nim &&
            profile.angkatan &&
            profile.prodi
          ),
          isAdmin,
          user_id: session.user.id,
        });

        if (isAdmin) {
          const { data: pendingData } = await supabase
            .from("accounts")
            .select("*")
            .eq("status", "pending")
            .order("created_at", { ascending: false });

          if (pendingData) setPendingUsers(pendingData);
        } else {
          // Fetch core team settings
          const { data: settings } = await supabase
            .from("core_team_settings")
            .select("is_open")
            .eq("id", 1)
            .maybeSingle();
          if (settings) setIsCoreTeamRegistrationOpen(settings.is_open);

          // Fetch core team registration
          const { data: registration } = await supabase
            .from("core_team_registrations")
            .select("*")
            .eq("user_id", session.user.id)
            .maybeSingle();
          if (registration) setCoreTeamRegistration(registration);
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

  const handleReviewUser = async (
    accountId: number,
    newStatus: "active" | "rejected",
  ) => {
    const { data, error } = await supabase
      .from("accounts")
      .update({ status: newStatus })
      .eq("id", accountId)
      .select("id")
      .single();
    if (!error && data) {
      setPendingUsers((prev) => prev.filter((u) => u.id !== accountId));
    } else {
      alert(
        `Gagal update (Kemungkinan ditolak pengaturan RLS): ${error?.message || "Data tidak ditemukan"}`,
      );
      console.error("Supabase update error:", error);
    }
  };

  const handleBiodataSuccess = (nim: string, angkatan: string) => {
    setUserData((p) => ({
      ...p,
      nim,
      angkatan,
      isProfileComplete: !!(nim && angkatan && p.prodi),
    }));
  };

  if (!mounted) return null;

  if (userData.isAdmin) {
    return (
      <AdminDashboard
        mounted={mounted}
        userData={userData}
        pendingUsers={pendingUsers}
        onReviewUser={handleReviewUser}
        onBiodataSuccess={handleBiodataSuccess}
      />
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/dcn-unira.png"
              alt="DCN"
              className="w-8 h-8 object-contain"
            />
            <span className="font-display font-semibold hidden sm:block">
              Dashboard Portal Kontributor DCN
            </span>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <ProfileCard mounted={mounted} userData={userData} />

          <div
            className={`lg:col-span-8 flex flex-col gap-6 transition-all duration-700 delay-200 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <StatusCard
              status={userData.status}
              isProfileComplete={userData.isProfileComplete}
            />
            <BiodataForm
              isProfileComplete={userData.isProfileComplete}
              onSuccess={handleBiodataSuccess}
            />
            {userData.isProfileComplete && (isCoreTeamRegistrationOpen || coreTeamRegistration) && (
              <CoreTeamRegistrationForm
                userId={userData.user_id}
                isOpen={isCoreTeamRegistrationOpen}
                registration={coreTeamRegistration}
                onSuccess={(data) => setCoreTeamRegistration(data)}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
