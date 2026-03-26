import { useState, useEffect } from 'react';

export interface Prodi {
  id: number;
  nama: string;
}

export function useProdiData() {
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProdi() {
      try {
        const res = await fetch('/api/prodi');
        const json = await res.json();
        
        if (json.success && Array.isArray(json.data)) {
          setProdiList(json.data);
        }
      } catch (e) {
        console.error("Gagal memuat Prodi:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProdi();
  }, []);

  return { prodiList, loading };
}
