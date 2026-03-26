import { IconCheck, IconX } from "@tabler/icons-react";

interface AdminPanelProps {
  pendingUsers: any[];
  onReviewUser: (id: number, status: 'active' | 'rejected') => Promise<void>;
}

export function AdminPanel({ pendingUsers, onReviewUser }: AdminPanelProps) {
  return (
    <div className="w-full">
      <div className="p-6 sm:p-10 glass-card border border-purple-500/30 rounded-[24px]">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-semibold text-white/90">Dashboard Admin</h1>
            <p className="text-white/50 text-sm md:text-base mt-1">Kelola verifikasi pendaftar baru Dicoding Community Network</p>
          </div>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="text-center py-12 border border-white/5 bg-white/5 rounded-2xl">
            <p className="text-white/50">Tidak ada pendaftar baru yang menunggu verifikasi saat ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map(u => (
              <div key={u.id} className="p-5 rounded-xl bg-black/20 border border-white/5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-all hover:bg-black/30">
                <div>
                  <strong className="block text-white text-lg mb-1">{u.nama}</strong>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/50">
                    <span>NIM: {u.nim}</span>
                    <span>Angkatan: {u.angkatan}</span>
                    <span>Prodi: {u.prodi}</span>
                    <span>Email: {u.email}</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                  <button onClick={() => onReviewUser(u.id, 'active')} className="flex-1 md:flex-none px-6 py-2.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm font-medium transition-colors">
                    Terima
                  </button>
                  <button onClick={() => onReviewUser(u.id, 'rejected')} className="flex-1 md:flex-none px-6 py-2.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-colors">
                    Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
