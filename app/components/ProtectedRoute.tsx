import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { IconLoader2 } from "@tabler/icons-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        if (mounted) navigate("/");
        return;
      }

      const { data: profile } = await supabase
        .from('accounts')
        .select('status')
        .eq('user_id', session.user.id)
        .single();
      
      if (!profile || profile.status !== 'active') {
        const errorMsg = profile?.status === 'pending'
          ? "Akun kamu belum disetujui admin"
          : profile?.status === 'rejected'
          ? "Pendaftaran kamu ditolak, hubungi admin"
          : "Akun tidak aktif";

        await supabase.auth.signOut();
        sessionStorage.setItem('login_error', errorMsg);
        if (mounted) navigate("/");
        return;
      }

      if (mounted) setLoading(false);
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-primary-light">
        <IconLoader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return <>{children}</>;
}
