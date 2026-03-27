import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const nim = url.searchParams.get("nim");

  if (!nim) {
    return Response.json(
      { error: "NIM parameter is required" },
      { status: 400 },
    );
  }

  try {
    const baseUrl = import.meta.env.VITE_API_URL as string;
    const res = await fetch(`${baseUrl}/v1/mahasiswa?filter[nim]=${nim}`);
    const json = await res.json();

    if (json.data && Array.isArray(json.data) && json.data.length > 0) {
      const student = json.data[0];
      const thumbnailPath = student.attributes?.thumbnail;

      const localImageUrl = thumbnailPath
        ? `/api/image?path=${encodeURIComponent(thumbnailPath)}`
        : null;

      return Response.json({
        success: true,
        data: {
          nim: nim,
          nama: student.attributes?.nama || null,
          image: localImageUrl,
        },
      });
    }

    return Response.json(
      { success: false, error: "NIM tidak ditemukan" },
      { status: 404 },
    );
  } catch (error) {
    return Response.json(
      { success: false, error: "Gagal terhubung ke API kampus" },
      { status: 500 },
    );
  }
}
