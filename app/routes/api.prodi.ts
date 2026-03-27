import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/prodi`);
    const json = await res.json();

    let opsiProdi: any[] = [];
    if (json.data && Array.isArray(json.data)) {
      const rawData = [...json.data];
      if (rawData.length > 0) rawData.pop();

      opsiProdi = rawData.map(item => ({
        id: item.id,
        nama: item.attributes?.nama || 'Unknown',
        jenjang: item.attributes?.jenjang || '',
        akreditasi: item.attributes?.akreditasi || ''
      }));
    }

    return Response.json({
      success: true,
      total: opsiProdi.length,
      data: opsiProdi
    });
  } catch (error) {
    return Response.json({ success: false, error: "Gagal memuat prodi" }, { status: 500 });
  }
}
