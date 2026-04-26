import { useState } from "react";
import { IconCheck, IconX, IconTrophy, IconFileCv } from "@tabler/icons-react";
import { supabase } from "~/lib/supabase/supabase";

interface CoreTeamRegistrationFormProps {
  userId: string;
  isOpen: boolean;
  registration: any;
  onSuccess: (registrationData: any) => void;
}

const QUESTIONS = [
  {
    question: "Apa tujuan utama dari Core Team DCN?",
    options: [
      "Hanya untuk mendapatkan sertifikat",
      "Mengembangkan komunitas dan mengelola program kerja",
      "Mencari keuntungan finansial pribadi",
      "Menambah beban kerja mahasiswa"
    ],
    answer: 1,
  },
  {
    question: "Manakah dari berikut ini yang BUKAN merupakan tanggung jawab Core Team?",
    options: [
      "Mentoring anggota baru",
      "Mengorganisir event teknologi",
      "Mengerjakan tugas kuliah anggota lain",
      "Berkolaborasi dengan stakeholder kampus"
    ],
    answer: 2,
  },
  {
    question: "Sikap apa yang paling diharapkan dari seorang anggota Core Team?",
    options: [
      "Pasif dan menunggu instruksi",
      "Inisiatif, kolaboratif, dan mau belajar",
      "Bekerja sendiri tanpa komunikasi",
      "Sering menunda pekerjaan"
    ],
    answer: 1,
  },
  {
    question: "Bagaimana cara terbaik menangani konflik dalam tim?",
    options: [
      "Mengabaikannya sampai hilang sendiri",
      "Menyalahkan anggota tim lain",
      "Mendiskusikannya secara terbuka dan mencari solusi bersama",
      "Keluar dari tim"
    ],
    answer: 2,
  },
  {
    question: "Tools apa yang umum digunakan untuk kolaborasi kode dalam tim?",
    options: [
      "Microsoft Word",
      "Git dan GitHub/GitLab",
      "Adobe Photoshop",
      "WhatsApp"
    ],
    answer: 1,
  },
];

export function CoreTeamRegistrationForm({
  userId,
  isOpen,
  registration,
  onSuccess,
}: CoreTeamRegistrationFormProps) {
  const [step, setStep] = useState<"intro" | "upload" | "test" | "submitting">("intro");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [errorMsg, setErrorMsg] = useState("");

  if (registration) {
    return (
      <div className="glass-card p-6 md:p-10 rounded-[2rem] border border-white/5 relative overflow-hidden bg-gradient-to-br from-[#0f0f13] to-[#0a0a0f] group">
        {/* Glow Effects */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-all duration-1000 ${registration.status === "accepted" ? "bg-emerald-500/20 group-hover:bg-emerald-500/30" :
          registration.status === "rejected" ? "bg-red-500/20 group-hover:bg-red-500/30" :
            "bg-purple-500/20 group-hover:bg-purple-500/30"
          }`} />

        <div className="flex flex-col items-center justify-center text-center space-y-5 py-8 relative z-10">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-2 border-2 shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-transform duration-500 hover:scale-110 ${registration.status === "accepted" ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400" :
            registration.status === "rejected" ? "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400" :
              "bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400"
            }`}>
            {registration.status === "accepted" ? (
              <IconCheck size={48} className="drop-shadow-lg" />
            ) : registration.status === "rejected" ? (
              <IconX size={48} className="drop-shadow-lg" />
            ) : (
              <IconTrophy size={48} className="drop-shadow-lg" />
            )}
          </div>

          <div>
            <h3 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">Status Pendaftaran</h3>
            <p className="text-white/50 mt-2">Pendaftaran Anda sebagai Core Team sedang diproses tunggu info selanjutnya akan di infokan di email anda</p>
          </div>

          <div className="flex flex-col items-center gap-2 mt-2">
            <span className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest border backdrop-blur-sm shadow-inner ${registration.status === "accepted" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10" :
              registration.status === "rejected" ? "bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/10" :
                "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/10"
              }`}>
              {registration.status}
            </span>
          </div>

          <div className="flex items-center gap-6 mt-8 p-6 bg-black/20 rounded-[1.5rem] border border-white/5 backdrop-blur-md w-full max-w-sm justify-between hover:border-white/10 transition-colors">
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Nilai Tes Anda</span>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-display font-bold text-white leading-none">{registration.test_score}</span>
                <span className="text-sm font-medium text-white/40 mb-1">/100</span>
              </div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Berkas CV</span>
              <a
                href={registration.cv_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 mt-1 rounded-xl bg-purple-500/10 text-sm font-medium text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/10 hover:border-purple-500/30"
              >
                Lihat CV
                <IconFileCv size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return null;
  }

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setErrorMsg("Ukuran file maksimal 5MB");
          return;
        }
        setCvFile(file);
        setErrorMsg("");
      }
    };
    input.click();
  };

  const calculateScore = () => {
    let correct = 0;
    QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.answer) correct++;
    });
    return Math.round((correct / QUESTIONS.length) * 100);
  };

  const handleSubmit = async () => {
    if (!cvFile) return;
    if (Object.keys(answers).length < QUESTIONS.length) {
      setErrorMsg("Mohon jawab semua pertanyaan tes.");
      return;
    }

    setStep("submitting");
    setErrorMsg("");

    try {
      // 1. Upload CV to Supabase Storage
      const fileExt = cvFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("cv_coreteam")
        .upload(fileName, cvFile);

      if (uploadError) {
        throw new Error(`Gagal upload CV: ${uploadError.message}`);
      }

      const cvUrl = supabase.storage.from("cv_coreteam").getPublicUrl(fileName).data.publicUrl;

      // 2. Calculate Score
      const score = calculateScore();

      // 3. Save to database
      const payload = {
        user_id: userId,
        cv_url: cvUrl,
        test_score: score,
        status: "pending"
      };

      const { data: insertData, error: insertError } = await supabase
        .from("core_team_registrations")
        .insert(payload)
        .select()
        .single();

      if (insertError) {
        throw new Error(`Gagal menyimpan pendaftaran: ${insertError.message}`);
      }

      onSuccess(insertData);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat mendaftar");
      setStep("test");
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 relative overflow-hidden bg-gradient-to-b from-[#0f0f13] to-[#0a0a0f]">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-emerald-500/20 border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <IconTrophy size={28} className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400 drop-shadow-md" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Pendaftaran Core Team</h2>
          <p className="text-sm text-white/50 mt-1">Tunjukkan kemampuanmu dan jadilah penggerak DCN.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3 animate-in fade-in relative z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {step === "intro" && (
        <div className="space-y-6 relative z-10">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111116] to-[#1a1a24] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-all duration-700 group-hover:bg-purple-500/20" />
            <h3 className="font-display font-medium text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">1</span>
              Tahapan Seleksi Core Team
            </h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5" />
                <p><strong className="text-white">Unggah Curriculum Vitae (CV)</strong><br />Siapkan CV terbaikmu dalam format PDF atau DOCX (Maksimal 5MB).</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                <p><strong className="text-white">Ujian Seleksi Otomatis</strong><br />Jawab 5 pertanyaan pilihan ganda terkait manajemen tim dan pengetahuan dasar.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                <p><strong className="text-white">Peninjauan Admin</strong><br />Tunggu hasil seleksi dan pengumuman status pendaftaran langsung dari dashboard.</p>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setStep("upload")}
            className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-display font-medium rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:-translate-y-1"
          >
            Mulai Pendaftaran Sekarang
          </button>
        </div>
      )}

      {step === "upload" && (
        <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div
            onClick={handleUploadClick}
            className="w-full h-56 border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-2xl bg-gradient-to-b from-white/5 to-transparent flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors duration-300" />
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
              <IconFileCv className="text-white/40 group-hover:text-purple-400 transition-colors" size={32} />
            </div>
            <p className="text-white/90 font-medium text-lg">
              {cvFile ? cvFile.name : "Klik untuk unggah CV"}
            </p>
            <p className="text-sm text-white/40 mt-2">Format PDF/DOCX maksimal 5MB</p>
            {cvFile && (
              <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 p-1 rounded-full">
                <IconCheck size={16} />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep("intro")}
              className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors duration-300"
            >
              Kembali
            </button>
            <button
              onClick={() => cvFile && setStep("test")}
              disabled={!cvFile}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-white/5 disabled:to-white/5 disabled:text-white/30 text-white font-medium rounded-xl transition-all duration-300 disabled:shadow-none shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              Lanjut ke Tes Ujian
            </button>
          </div>
        </div>
      )}

      {step === "test" && (
        <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {QUESTIONS.map((q, qIdx) => (
              <div key={qIdx} className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-base font-medium text-white leading-relaxed">
                  <span className="text-purple-400 font-bold mr-2">{qIdx + 1}.</span>
                  {q.question}
                </p>
                <div className="space-y-2.5">
                  {q.options.map((opt, oIdx) => (
                    <label
                      key={oIdx}
                      className={`flex items-center gap-4 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${answers[qIdx] === oIdx
                        ? "bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                        : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10"
                        }`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIdx}`}
                        value={oIdx}
                        checked={answers[qIdx] === oIdx}
                        onChange={() => setAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${answers[qIdx] === oIdx ? "border-purple-400" : "border-white/20"
                        }`}>
                        {answers[qIdx] === oIdx && <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-in zoom-in duration-200" />}
                      </div>
                      <span className={`text-sm transition-colors ${answers[qIdx] === oIdx ? "text-white font-medium" : "text-white/70"}`}>
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button
              onClick={() => setStep("upload")}
              className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors duration-300"
            >
              Kembali
            </button>
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < QUESTIONS.length}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-white/5 disabled:to-white/5 disabled:text-white/30 text-white font-medium rounded-xl transition-all duration-300 disabled:shadow-none shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Kirim Pendaftaran
            </button>
          </div>
        </div>
      )}

      {step === "submitting" && (
        <div className="py-16 flex flex-col items-center justify-center space-y-6 relative z-10 animate-in fade-in duration-500">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-500/20 border-b-emerald-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-white/80 font-medium text-lg animate-pulse">Menyimpan berkas & hasil tes...</p>
        </div>
      )}
    </div>
  );
}
