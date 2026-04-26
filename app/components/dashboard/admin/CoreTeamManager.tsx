import { useState, useEffect } from "react";
import { IconUsers, IconCheck, IconX, IconPower, IconFileCv, IconDownload } from "@tabler/icons-react";
import { supabase } from "~/lib/supabase/supabase";

export function CoreTeamManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Fetch setting
    const { data: settingData } = await supabase
      .from("core_team_settings")
      .select("is_open")
      .eq("id", 1)
      .maybeSingle();

    if (settingData) {
      setIsOpen(settingData.is_open);
    } else {
      // If setting row doesn't exist, try creating it
      await supabase.from("core_team_settings").insert({ id: 1, is_open: false });
    }

    // Fetch registrations
    const { data: regData } = await supabase
      .from("core_team_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (regData && regData.length > 0) {
      // Fetch accounts for these user_ids
      const userIds = regData.map(r => r.user_id);
      const { data: accountData } = await supabase
        .from("accounts")
        .select("user_id, nama, email, nim, prodi")
        .in("user_id", userIds);

      const accountsMap = new Map();
      if (accountData) {
        accountData.forEach(acc => accountsMap.set(acc.user_id, acc));
      }

      const mergedData = regData.map(r => ({
        ...r,
        account: accountsMap.get(r.user_id) || { nama: "Unknown", email: "-", nim: "-", prodi: "-" }
      }));

      setRegistrations(mergedData);
    } else {
      setRegistrations([]);
    }

    setLoading(false);
  };

  const toggleStatus = async () => {
    const newStatus = !isOpen;
    const { error } = await supabase
      .from("core_team_settings")
      .update({ is_open: newStatus })
      .eq("id", 1);

    if (!error) {
      setIsOpen(newStatus);
    } else {
      alert("Gagal mengubah status pendaftaran.");
    }
  };

  const updateRegistrationStatus = async (id: number, status: "accepted" | "rejected") => {
    const { error } = await supabase
      .from("core_team_registrations")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } else {
      alert("Gagal mengupdate status pendaftar.");
    }
  };

  const handleExport = () => {
    if (registrations.length === 0) return;

    const headers = ["Nama Kontributor", "Email", "NIM", "Prodi", "Nilai Tes", "Status Pendaftaran", "Tautan CV", "Waktu Daftar"];
    const rows = registrations.map(reg => [
      `"${reg.account.nama}"`,
      `"${reg.account.email}"`,
      `"${reg.account.nim}"`,
      `"${reg.account.prodi}"`,
      reg.test_score,
      `"${reg.status}"`,
      `"${reg.cv_url}"`,
      `"${new Date(reg.created_at).toLocaleString('id-ID')}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Pendaftar_Core_Team_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between glass-card p-6 rounded-2xl border border-white/5">
        <div>
          <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
            <IconUsers className="text-purple-400" />
            Manajemen Pendaftaran Core Team
          </h3>
          <p className="text-sm text-white/50 mt-1">Atur status pendaftaran dan tinjau calon anggota Core Team.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs text-white/50 mb-1">Status Pendaftaran</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${isOpen ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              {isOpen ? 'DIBUKA' : 'DITUTUP'}
            </span>
          </div>
          <button
            onClick={toggleStatus}
            className={`p-3 rounded-xl transition-all cursor-pointer ${isOpen
                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
              }`}
            title={isOpen ? "Tutup Pendaftaran" : "Buka Pendaftaran"}
          >
            <IconPower size={24} />
          </button>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/5 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-medium text-white">Daftar Pelamar</h4>
          <button
            onClick={handleExport}
            disabled={registrations.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-sm font-medium rounded-xl border border-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <IconDownload size={18} />
            Export Data
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : registrations.length === 0 ? (
          <div className="py-12 text-center text-white/50 bg-[#111116]/80 rounded-xl border border-white/5">
            Belum ada pendaftar Core Team.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                  <th className="pb-3 font-medium px-4">Kontributor</th>
                  <th className="pb-3 font-medium px-4">Prodi/NIM</th>
                  <th className="pb-3 font-medium px-4 text-center">Berkas</th>
                  <th className="pb-3 font-medium px-4 text-center">Nilai Tes</th>
                  <th className="pb-3 font-medium px-4">Status</th>
                  <th className="pb-3 font-medium px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="text-sm hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-4">
                      <p className="font-medium text-white">{reg.account.nama}</p>
                      <p className="text-xs text-white/50">{reg.account.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-white/80">{reg.account.prodi}</p>
                      <p className="text-xs text-white/50">{reg.account.nim}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <a
                        href={reg.cv_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                        title="Lihat CV"
                      >
                        <IconFileCv size={20} />
                      </a>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                        {reg.test_score}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${reg.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          reg.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {reg.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'accepted')}
                            className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            title="Terima"
                          >
                            <IconCheck size={18} />
                          </button>
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'rejected')}
                            className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Tolak"
                          >
                            <IconX size={18} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-white/30">Diproses</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
