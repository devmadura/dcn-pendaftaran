import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { useRef } from "react";
import * as htmlToImage from "html-to-image";
import { requireActiveUser } from "../lib/Requireactiveuser";

interface Mahasiswa {
  nim: string;
  nama: string;
  image: string;
}

type Angkatan = {
  angkatan: string;
  prodi: string;
  status: string;
};

interface LoaderData {
  mahasiswa: Mahasiswa;
  angkatan: Angkatan;
  isAdmin: Boolean;
}

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5173";

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const { profile } = await requireActiveUser(request);
  const nim = profile.nim as string;
  if (!nim) throw new Response("NIM tidak ditemukan di akun ini", { status: 400 });

  const mhsResponse = await fetch(`${baseUrl}/api/mahasiswa?nim=${nim}`).then(
    (res) => res.json()
  );
  if (!mhsResponse.success)
    throw new Response("Data mahasiswa tidak ditemukan", { status: 404 });

  return { mahasiswa: mhsResponse.data, angkatan: profile, isAdmin: true };
}

/* ─── Barcode strips ─── */
const BARS = [2, 1, 3, 1, 2, 1, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2];

function BarcodeStrips() {
  return (
    <div style={{ display: "flex", gap: "1.5px", alignItems: "center", height: "20px" }}>
      {BARS.map((w, i) => (
        <div
          key={i}
          style={{
            width: `${w}px`,
            height: i % 3 === 0 ? "100%" : i % 2 === 0 ? "70%" : "55%",
            background: "rgba(255,255,255,0.35)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Field helper (depan) ─── */
function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", margin: "0 0 2px", letterSpacing: "0.8px", textTransform: "uppercase" }}>
        {label}
      </p>
      <p style={{ color: "#fff", fontSize: "12px", fontWeight: 500, margin: 0, fontFamily: mono ? "monospace" : "inherit" }}>
        {value}
      </p>
    </div>
  );
}

/* ─── Logo DCN (inline SVG / img path — ganti src sesuai lokasi asset kamu) ─── */
const DCN_LOGO_SRC = "/dcn-unira.png";

/* ─── QR placeholder cells ─── */
const QR_PAT = [
  1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1,
  1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1,
  1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1,
];

function QRPlaceholder() {
  return (
    <div
      style={{
        width: "56px", height: "56px", borderRadius: "8px",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.15)",
        padding: "5px",
        display: "grid",
        gridTemplateColumns: "repeat(6,1fr)",
        gap: "2px",
      }}
    >
      {Array.from({ length: 36 }).map((_, i) => (
        <div
          key={i}
          style={{
            borderRadius: "1px",
            background: QR_PAT[i % QR_PAT.length] ? "rgba(255,255,255,0.65)" : "transparent",
          }}
        />
      ))}
    </div>
  );
}

function CardFront({ mahasiswa, angkatan }: { mahasiswa: Mahasiswa; angkatan: Angkatan }) {
  const imageUrl = `${baseUrl}${mahasiswa.image}`;

  return (
    <div
      style={{
        width: "560px", height: "340px", borderRadius: "16px",
        background: "linear-gradient(145deg,#0d2a52 0%,#112f5c 60%,#0a1f3d 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      {/* accent line top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: "linear-gradient(90deg,transparent,#3b82f6,#facc15,transparent)"
      }} />

      {/* deco circles */}
      <div style={{
        position: "absolute", top: "-50px", right: "-50px",
        width: "200px", height: "200px", borderRadius: "50%",
        background: "rgba(59,130,246,0.07)", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: "-70px", left: "-40px",
        width: "240px", height: "240px", borderRadius: "50%",
        background: "rgba(250,204,21,0.04)", pointerEvents: "none"
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 20px",
        background: "rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.09)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Logo DCN */}
          <img
            src={DCN_LOGO_SRC}
            alt="DCN Logo"
            crossOrigin="anonymous"
            style={{ width: "42px", height: "42px", objectFit: "contain" }}
          />
          <div>
            <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: 0, letterSpacing: "0.3px" }}>
              Dicoding Community Network
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", margin: 0 }}>
              UNIRA Pamekasan
            </p>
          </div>
        </div>
        <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px", letterSpacing: "1.2px", textTransform: "uppercase" }}>
          Kartu Kontributor
        </span>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, padding: "18px 24px", gap: "22px", alignItems: "center" }}>
        {/* Foto */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "90px", height: "108px", borderRadius: "10px",
            border: "2px solid rgba(255,255,255,0.18)",
            overflow: "hidden", background: "rgba(255,255,255,0.08)",
          }}>
            <img
              src={imageUrl}
              alt="Foto profil"
              crossOrigin="anonymous"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{
            background: "linear-gradient(90deg,#2563eb,#3b82f6)",
            color: "#fff", fontSize: "10px", fontWeight: 600,
            padding: "2px 14px", borderRadius: "20px", letterSpacing: "0.8px",
          }}>
            {angkatan.status}
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", margin: "0 0 3px", letterSpacing: "0.8px", textTransform: "uppercase" }}>
              Nama Lengkap
            </p>
            <p style={{ color: "#fff", fontSize: "18px", fontWeight: 600, margin: 0 }}>
              {mahasiswa.nama}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Field label="NIM" value={mahasiswa.nim} mono />
            <Field label="Angkatan" value={angkatan.angkatan} />
            <Field label="Program Studi" value={angkatan.prodi ?? "Teknik Informatika"} />
            <Field label="Berlaku" value="Selama menjadi kontributor" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 24px",
        background: "rgba(255,255,255,0.04)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", fontFamily: "monospace", letterSpacing: "1.5px" }}>
          {mahasiswa.nim}
        </span>
        <BarcodeStrips />
      </div>
    </div>
  );
}


function CardBack({ mahasiswa }: { mahasiswa: Mahasiswa }) {
  return (
    <div
      style={{
        width: "560px", height: "340px", borderRadius: "16px",
        background: "linear-gradient(145deg,#0a1f3d 0%,#0f2d55 60%,#0d2a52 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      {/* accent line top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: "linear-gradient(90deg,transparent,#facc15,#3b82f6,transparent)"
      }} />

      {/* deco circles */}
      <div style={{
        position: "absolute", top: "-40px", right: "-40px",
        width: "180px", height: "180px", borderRadius: "50%",
        background: "rgba(250,204,21,0.04)", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: "-60px", left: "-30px",
        width: "200px", height: "200px", borderRadius: "50%",
        background: "rgba(59,130,246,0.06)", pointerEvents: "none"
      }} />

      {/* Magnetic stripe */}
      <div style={{
        height: "46px", background: "#111", marginTop: "20px",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)"
      }} />

      {/* Tanda tangan area */}
      <div style={{
        margin: "12px 24px 0",
        background: "rgba(255,255,255,0.92)", borderRadius: "8px",
        padding: "8px 14px", display: "flex", alignItems: "center",
        gap: "10px", height: "50px",
      }}>
        <span style={{ color: "#666", fontSize: "9px", letterSpacing: "0.8px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Tanda Tangan
        </span>
        <div style={{ flex: 1, borderBottom: "1px solid #ccc", alignSelf: "flex-end", marginBottom: "4px" }} />
        {/* mini foto slot */}
        <div style={{
          width: "36px", height: "36px", borderRadius: "5px",
          background: "#ddd", display: "flex", alignItems: "center",
          justifyContent: "center", overflow: "hidden",
        }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="8" r="4.5" fill="#bbb" />
            <path d="M2 21c0-5 4-9 9-9s9 4 9 9" fill="#bbb" />
          </svg>
        </div>
      </div>

      {/* Info poin */}
      <div style={{ padding: "10px 24px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          "Kartu ini adalah milik resmi kontributor DCN UNIRA dan wajib dibawa saat kegiatan.",
          "Jika kartu hilang atau ditemukan, harap hubungi pengurus DCN UNIRA segera.",
          "Kartu ini tidak dapat dipindah tangankan kepada pihak lain.",
        ].map((text, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <div style={{
              width: "4px", height: "4px", borderRadius: "50%",
              background: "#3b82f6", flexShrink: 0, marginTop: "5px",
            }} />
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "9.5px", lineHeight: 1.5 }}>
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: "auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 24px",
        background: "rgba(255,255,255,0.04)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={DCN_LOGO_SRC}
            alt="DCN Logo"
            crossOrigin="anonymous"
            style={{ width: "38px", height: "38px", objectFit: "contain" }}
          />
          <div>
            <p style={{ color: "#fff", fontSize: "11px", fontWeight: 600, margin: 0 }}>
              DCN UNIRA Pamekasan
            </p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "9px", margin: "1px 0 0" }}>
              dcnunira.dev
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* NIM text */}
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "9px", fontFamily: "monospace", letterSpacing: "1.2px" }}>
            {mahasiswa.nim}
          </span>
          {/* QR placeholder */}
          <QRPlaceholder />
        </div>
      </div>
    </div>
  );
}

export default function GenerateIdCard() {
  const { mahasiswa, angkatan } = useLoaderData<typeof loader>();

  // Ref wrapper yang membungkus KEDUA kartu sekaligus
  const bothCardsRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!bothCardsRef.current) return;
    try {
      const dataUrl = await htmlToImage.toJpeg(bothCardsRef.current, {
        quality: 0.95,
        backgroundColor: "#0a1628",
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0a1628 0%,#0f2448 50%,#091830 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "48px 24px",
        gap: "32px",
      }}
    >

      {/* ── Wrapper yang di-screenshot ── */}
      <div
        ref={bothCardsRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "28px 32px",
          background: "#0a1628",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Label depan */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" }}>
            Depan
          </span>
          <CardFront mahasiswa={mahasiswa} angkatan={angkatan} />
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

        {/* Label belakang */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" }}>
            Belakang
          </span>
          <CardBack mahasiswa={mahasiswa} />
        </div>
      </div>

      {/* Tombol */}
      <button
        onClick={handleDownload}
        style={{
          padding: "12px 32px",
          borderRadius: "10px",
          background: "linear-gradient(90deg,#2563eb,#3b82f6)",
          color: "#fff",
          fontWeight: 600,
          fontSize: "14px",
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.3px",
          boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
        }}
      >
        Download ID Card
      </button>

      <Link
        to="/dashboard"
        style={{
          padding: "10px 28px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.07)",
          color: "rgba(255,255,255,0.6)",
          fontWeight: 500,
          fontSize: "13px",
          border: "1px solid rgba(255,255,255,0.12)",
          textDecoration: "none",
        }}
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}