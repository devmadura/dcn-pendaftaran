import { IconSparkles } from "@tabler/icons-react";
import { cn } from "../../lib/utils";

interface HeroProps {
  mounted: boolean;
}

export function Hero({ mounted }: HeroProps) {
  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-8 order-2 lg:order-1 pt-8 lg:pt-0 pb-10 lg:pb-0">
      <div
        className={cn(
          "transition-all duration-1000 transform",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        )}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium tracking-widest text-[#f472b6] uppercase mb-6">
          <IconSparkles size={14} />
          <span>Portal DCN UNIRA</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-[4rem] font-display font-bold leading-[1.1] mb-6">
          Portal Kontributor <br />
          <em className="bg-linear-to-r from-blue-400 to-white bg-clip-text text-transparent text-shadow-2xs not-italic">
            DCN UNIRA
          </em>
        </h1>

        <p className="text-lg text-white/70 max-w-lg mb-12 font-light leading-relaxed">
          Platform pendaftaran dan seleksi kontributor resmi dan portal
          kontributor. Silakan masuk atau buat akun baru untuk memulai
          perjalananmu.
        </p>

        <div className="flex flex-col gap-6">
          {[
            {
              title: "Sistem Seleksi Modern",
              sub: "Memantau status aplikasi dan kelengkapan data.",
            },
            {
              title: "Privasi dan Keamanan Data",
              sub: "Simulasi portal ini tidak menyimpan data publik apapun.",
            },
            {
              title: "portal kontributor",
              sub: "Portal kontributor DCN UNIRA",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="mt-1 shrink-0 w-6 h-6 rounded-full bg-primary-base/20 border border-primary-base/40 text-primary-light flex items-center justify-center text-xs">
                ✦
              </div>
              <div>
                <strong className="block text-white font-medium mb-1">
                  {item.title}
                </strong>
                <span className="block text-white/50 text-sm font-light">
                  {item.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
