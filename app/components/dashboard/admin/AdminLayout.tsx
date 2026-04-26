import { useState } from "react";
import { IconLayoutDashboard, IconUsers, IconUser, IconSettings, IconMenu2, IconX, IconLogout } from "@tabler/icons-react";
import { cn } from "../../../lib/utils";
import { supabase } from "../../../lib/supabase/supabase";
import { useNavigate } from "react-router";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminLayout({ children, activeTab, setActiveTab }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", icon: <IconLayoutDashboard size={20} /> },
    { name: "Verifikasi Pengguna", icon: <IconUsers size={20} /> },
    { name: "Profil Core Team", icon: <IconUser size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#0d0d12] border-r border-white/5 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <img src="/dcn-unira.png" alt="DCN" className="w-10 h-10 object-contain" />
            <div>
               <h2 className="font-display font-medium text-white shadow-sm">DCN UNIRA</h2>
               <p className="text-xs bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-emerald-400 font-semibold tracking-wide uppercase mt-0.5">Core Team Panel</p>
            </div>
          </div>
          <button className="md:hidden text-white/50 hover:bg-white/10 p-2 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <IconX size={20} />
          </button>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-white/30 tracking-wider uppercase mb-4">Menu Utama</p>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group cursor-pointer",
                  activeTab === item.name 
                    ? "bg-gradient-to-r from-purple-500/20 to-transparent text-purple-300 border border-purple-500/20 shadow-[inset_4px_0_0_0_rgba(168,85,247,0.5)]" 
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <div className={cn("transition-colors duration-200", activeTab === item.name ? "text-purple-400" : "text-white/40 group-hover:text-white/80")}>
                  {item.icon}
                </div>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-white/5">
           <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <IconLogout size={20} className="text-red-400/70" />
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[url('/grid.svg')] bg-center bg-fixed">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <img src="/dcn-unira.png" alt="DCN" className="w-8 h-8 object-contain" />
            <span className="font-display font-semibold text-sm">Core Team</span>
          </div>
          <button className="p-2 text-white/70 bg-white/5 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
            <IconMenu2 size={24} />
          </button>
        </header>

        {/* Dynamic Content Wrapper */}
        <div className="flex-1 p-4 md:p-10">
           <div className="max-w-5xl mx-auto">
             <div className="mb-8">
               <h1 className="text-3xl font-display font-semibold text-white/90">{activeTab}</h1>
               <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full mt-3"></div>
             </div>
             {children}
           </div>
        </div>
      </main>
    </div>
  );
}
