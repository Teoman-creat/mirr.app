"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Share, Sparkles, Flame, CheckCircle2, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function ResultPage() {
  const [showContent, setShowContent] = useState(false);
  const [resultData, setResultData] = useState<{
    auraScore: number;
    vibe: string;
    strengths: string[];
    improvements: string[];
  } | null>(null);
  
  const t = useTranslations("Result");
  const locale = useLocale();

  useEffect(() => {
    const data = sessionStorage.getItem("mirr_result_data");
    if (data) {
      try {
        setResultData(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse result data", e);
      }
    }
    // Delay content rendering for dramatic reveal effect
    setTimeout(() => setShowContent(true), 500);
  }, []);

  const auraScore = resultData?.auraScore || 0;
  const vibe = resultData?.vibe || "...";
  const strengths = resultData?.strengths || [];
  const improvements = resultData?.improvements || [];

  return (
    <div className={`flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F0E8] relative overflow-x-hidden transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointers-events-none">
         <div className="absolute top-0 right-0 w-full h-[60vh] bg-gradient-to-b from-[#D4AF37]/5 to-transparent mix-blend-screen" />
         <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-[#D4AF37]/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center p-6 z-20 sticky top-0 backdrop-blur-md bg-[#0A0A0A]/30 border-b border-[#ffffff]/5">
         <Link href={`/${locale}/upload`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} className="text-[#C8C8C8]" />
         </Link>
         <h1 className="text-xs font-semibold tracking-widest uppercase text-[#C8C8C8]">{t("title")}</h1>
         <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
            <Share size={16} className="text-[#C8C8C8]" />
         </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col z-10 px-6 pb-24 pt-8 max-w-2xl mx-auto w-full">
        
        {/* The Reveal - Aura Score */}
        <section className="flex flex-col items-center justify-center mb-16 relative">
            
            {/* Spinning decorative ring */}
            <div className="absolute w-64 h-64 border-[1px] border-dashed border-[#D4AF37]/30 rounded-full animate-[spin_30s_linear_infinite]" />
            <div className="absolute w-56 h-56 border-[2px] border-[#D4AF37]/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
            
            <div className="w-48 h-48 rounded-full bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#D4AF37]/40 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.15)] z-10">
                <span className="text-sm font-medium tracking-widest uppercase text-[#D4AF37] mb-1">{t("score_label")}</span>
                <div className="flex items-start">
                    <span className="text-8xl font-serif tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-[#ffffff] to-[#C8C8C8]">
                        {auraScore}
                    </span>
                 </div>
            </div>
            
            <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <p className="text-[#C8C8C8] text-sm uppercase tracking-widest mb-1">{t("vibe_label")}</p>
                <h2 className="text-2xl font-serif text-[#F5F0E8]">{vibe}</h2>
            </div>
        </section>

        {/* Breakdown Cards */}
        <section className="space-y-6">
            
            {/* Strengths Card */}
            <div className="bg-[#ffffff]/5 rounded-3xl p-6 border border-[#ffffff]/10 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Flame size={16} className="text-green-400" />
                    </div>
                    <h3 className="text-lg font-medium tracking-wide">{t("strengths_title")}</h3>
                </div>
                <ul className="space-y-4">
                    {strengths.map((item, i) => (
                        <li key={i} className="flex gap-3 text-[#C8C8C8] text-sm leading-relaxed">
                            <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Improvements Card */}
            <div className="bg-[#ffffff]/5 rounded-3xl p-6 border border-[#ffffff]/10 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Sparkles size={16} className="text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium tracking-wide">{t("improvements_title")}</h3>
                </div>
                <ul className="space-y-4">
                    {improvements.map((item, i) => (
                        <li key={i} className="flex gap-3 text-[#C8C8C8] text-sm leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-2" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Save to Wardrobe Action */}
            <Link href={`/${locale}/profile`} className="w-full mt-4 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-[#ffffff]/10 rounded-2xl p-5 flex items-center justify-between group hover:bg-[#2a2a2a] transition-all animate-fade-in-up block" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] flex items-center justify-center border border-[#ffffff]/5 group-hover:border-[#D4AF37]/30 transition-colors">
                        <User size={20} className="text-[#D4AF37]" />
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-[#F5F0E8]">{t("save_btn")}</p>
                        <p className="text-xs text-[#C8C8C8]/60 mt-0.5">{t("save_desc")}</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-[#C8C8C8]/40 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
            </Link>

        </section>
      </main>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
