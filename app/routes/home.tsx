import type { Route } from "./+types/home";
import { useState, useEffect } from "react";
import { Hero } from "../components/home/Hero";
import { AuthForm } from "../components/auth/AuthForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portal Kontributor - DCN UNIRA" },
    {
      name: "description",
      content:
        "Daftar atau masuk ke portal komunitas Dicoding Community Network Universitas Madura.",
    },
  ];
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <img
              src="/dcn-unira.png"
              alt="DCN"
              className="w-10.5 h-10.5 object-contain transition-transform group-hover:scale-110"
            />
            <span className="font-display font-semibold text-lg tracking-wide hidden sm:block">
              DCN UNIRA
            </span>
          </a>
          <a
            href="https://dcnunira.dev"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            dcnunira.dev ↗
          </a>
        </div>
      </nav>

      <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-center min-h-[calc(100vh-140px)]">
          <Hero mounted={mounted} />
          <AuthForm mounted={mounted} />
        </div>
      </main>
    </>
  );
}
