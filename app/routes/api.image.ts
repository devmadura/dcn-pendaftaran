import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path");

  if (!path) {
    return new Response("Path is required", { status: 400 });
  }

  try {
    const baseUrl = import.meta.env.VITE_API_URL as string;

    const targetUrl = `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

    const response = await fetch(targetUrl);

    if (!response.ok) {
      throw new Error("Gagal mengambil gambar dari server asal");
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    return new Response("Error fetching image", { status: 500 });
  }
}
