import {
  Link,
  Navigate,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { useRef } from "react";
import * as htmlToImage from "html-to-image";
import { requireActiveUser } from "../lib/Requireactiveuser";

interface Mahasiswa {
  nim: string;
  nama: string;
  prodi: string;
  image: string;
}

interface LoaderData {
  mahasiswa: Mahasiswa;
  angkatan: string;
}

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5173";

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const { profile } = await requireActiveUser(request);

  const nim = profile.nim as string;

  if (!nim) {
    throw new Response("NIM tidak ditemukan di akun ini", { status: 400 });
  }

  const mhsResponse = await fetch(`${baseUrl}/api/mahasiswa?nim=${nim}`).then(
    (res) => res.json(),
  );

  if (!mhsResponse.success) {
    throw new Response("Data mahasiswa tidak ditemukan", { status: 404 });
  }

  return {
    mahasiswa: mhsResponse.data,
    angkatan: (profile.angkatan as string) ?? "-",
  };
}

const BARS = [2, 1, 3, 1, 2, 1, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2];

function BarcodeStrips() {
  return (
    <div
      style={{
        display: "flex",
        gap: "1.5px",
        alignItems: "center",
        height: "20px",
      }}
    >
      {BARS.map((w, i) => (
        <div
          key={i}
          style={{
            width: `${w}px`,
            height: i % 3 === 0 ? "100%" : i % 2 === 0 ? "70%" : "55%",
            background: "rgba(255,255,255,0.4)",
          }}
        />
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "10px",
          margin: "0 0 2px",
          letterSpacing: "0.8px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      <p
        style={{
          color: "#fff",
          fontSize: "12px",
          fontWeight: 500,
          margin: 0,
          fontFamily: mono ? "monospace" : "inherit",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default function GenerateIdCard() {
  const { mahasiswa, angkatan } = useLoaderData<typeof loader>();
  const idCardRef = useRef<HTMLDivElement>(null);

  const imageUrl = `${baseUrl}${mahasiswa.image}`;

  const handleDownload = async () => {
    if (!idCardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toJpeg(idCardRef.current, {
        quality: 0.95,
      });
      const link = document.createElement("a");
      link.download = `ID_Card_${mahasiswa.nama}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal menggenerate ID Card:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 gap-8">
      {/* ID CARD */}
      <div
        ref={idCardRef}
        style={{
          width: "560px",
          height: "340px",
          borderRadius: "16px",
          background: "#0f2d55",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
        }}
      >
        {/* Lingkaran dekoratif */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-70px",
            left: "-40px",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 20px",
            background: "rgba(255,255,255,0.07)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 500,
                color: "#fff",
              }}
            >
              KM
            </div>
            <span
              style={{
                color: "#fff",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.4px",
              }}
            >
              Komunitas Mahasiswa
            </span>
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "10px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Kartu Anggota
          </span>
        </div>

        {/*  Body  */}
        <div
          style={{
            display: "flex",
            flex: 1,
            padding: "18px 24px",
            gap: "22px",
            alignItems: "center",
          }}
        >
          {/* Foto */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "108px",
                borderRadius: "8px",
                border: "2px solid rgba(255,255,255,0.2)",
                overflow: "hidden",
                background: "rgba(255,255,255,0.08)",
              }}
            >
              <img
                src={imageUrl}
                alt="Foto profil"
                crossOrigin="anonymous"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                background: "#3b82f6",
                color: "#fff",
                fontSize: "10px",
                fontWeight: 500,
                padding: "2px 12px",
                borderRadius: "20px",
                letterSpacing: "0.5px",
              }}
            >
              AKTIF
            </div>
          </div>

          {/* Info */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "10px",
                  margin: "0 0 3px",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                }}
              >
                Nama Lengkap
              </p>
              <p
                style={{
                  color: "#fff",
                  fontSize: "17px",
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                {mahasiswa.nama}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <Field label="NIM" value={mahasiswa.nim} mono />
              <Field label="Angkatan" value={angkatan} />
              <Field
                label="Program Studi"
                value={mahasiswa.prodi ?? "Teknik Informatika"}
              />
              <Field label="Berlaku" value="s/d Lulus" />
            </div>
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 24px",
            background: "rgba(255,255,255,0.05)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "10px",
              fontFamily: "monospace",
              letterSpacing: "1.5px",
            }}
          >
            {mahasiswa.nim}
          </span>
          <BarcodeStrips />
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
      >
        Download ID Card
      </button>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-blue-200 text-white font-medium rounded-lg hover:bg-blue-400 active:scale-95 transition-all cursor-pointer"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
