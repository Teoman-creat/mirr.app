"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Share, Sparkles, Flame, CheckCircle2, ChevronRight, User, X, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

export default function ResultPage() {
  const [showContent, setShowContent] = useState(false);
  const [resultData, setResultData] = useState<{
    // Outfit Specific
    auraScore?: number;
    strengths?: string[];
    improvements?: string[];
    // Grooming Specific
    faceShape?: string;
    hairRecommendations?: string[];
    beardRecommendations?: string[];
    skincareTips?: string[];
    // Shared
    vibe: string;
  } | null>(null);
  
  const t = useTranslations("Result");
  const locale = useLocale();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [publishingAnalysisId, setPublishingAnalysisId] = useState<string | null>(null);
  const [publishCategory, setPublishCategory] = useState<string>('casual');
  const [isCommunityPublishing, setIsCommunityPublishing] = useState(false);

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

  const handleSave = async (shouldRedirect = true): Promise<string | null> => {
    if (!resultData) return null;
    setIsSaving(true);
    
    try {
      const imageData = sessionStorage.getItem("mirr_image");
      
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          parsedData: resultData,
          type: sessionStorage.getItem("mirr_analysis_type") === "grooming" ? "GROOMING" : "OUTFIT"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (shouldRedirect) router.push(`/${locale}/profile`);
        return data.analysis_id;
      } else {
        const errorData = await response.json();
        console.error('Error saving:', errorData);
        alert('Kombin kaydedilirken bir hata oluştu.');
        return null;
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Kombin kaydedilirken bir hata oluştu.');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenPublishModal = async () => {
    // If not saved yet, save it silently first
    const newId = await handleSave(false);
    if (newId) {
      setPublishingAnalysisId(newId);
    }
  };

  const handlePublishToCommunity = async () => {
    if (!publishingAnalysisId) return;
    setIsCommunityPublishing(true);
    try {
      const res = await fetch('/api/community/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis_id: publishingAnalysisId, category: publishCategory })
      });
      if (res.ok) {
        setPublishingAnalysisId(null);
        alert('Kombininiz topluluk podyumuna başarıyla eklendi! 🎉');
        router.push(`/${locale}/community`);
      } else {
        const err = await res.json();
        alert(err.error || 'Paylaşılırken bir hata oluştu.');
      }
    } catch (e) {
      console.error(e);
      alert('Paylaşılırken bir hata oluştu.');
    } finally {
      setIsCommunityPublishing(false);
    }
  };

  const auraScore = resultData?.auraScore;
  const vibe = resultData?.vibe || "...";
  
  // Outfit
  const strengths = resultData?.strengths || [];
  const improvements = resultData?.improvements || [];
  
  // Grooming
  const isGrooming = sessionStorage.getItem("mirr_analysis_type") === "grooming";
  const faceShape = resultData?.faceShape || "Unknown";
  const hairRecs = resultData?.hairRecommendations || [];
  const beardRecs = resultData?.beardRecommendations || [];
  const skinRecs = resultData?.skincareTips || [];

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
         <div className="flex gap-2">
           <button onClick={handleOpenPublishModal} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
              <Share size={16} className="text-[#C8C8C8]" />
           </button>
           <Link href={`/${locale}`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
              <X size={18} className="text-[#C8C8C8]" />
           </Link>
         </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col z-10 px-6 pb-24 pt-8 max-w-2xl mx-auto w-full">
        
        {/* The Reveal - Aura Score */}
        <section className="flex flex-col items-center justify-center mb-16 relative">
            
            {/* Spinning decorative ring */}
            <div className="absolute w-64 h-64 border-[1px] border-dashed border-[#D4AF37]/30 rounded-full animate-[spin_30s_linear_infinite]" />
            <div className="absolute w-56 h-56 border-[2px] border-[#D4AF37]/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
            
            <div className="w-48 h-48 rounded-full bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#D4AF37]/40 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.15)] z-10 p-4 text-center">
                {isGrooming ? (
                    <>
                        <span className="text-xs font-medium tracking-widest uppercase text-[#D4AF37] mb-2">{t("face_shape")}</span>
                        <span className="text-3xl font-serif tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-[#ffffff] to-[#C8C8C8]">
                            {faceShape}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-sm font-medium tracking-widest uppercase text-[#D4AF37] mb-1">{t("score_label")}</span>
                        <div className="flex items-start">
                            <span className="text-8xl font-serif tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-[#ffffff] to-[#C8C8C8]">
                                {auraScore}
                            </span>
                        </div>
                    </>
                )}
            </div>
            
            <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <p className="text-[#C8C8C8] text-sm uppercase tracking-widest mb-1">{isGrooming ? "Grooming Vibe" : t("vibe_label")}</p>
                <h2 className="text-2xl font-serif text-[#F5F0E8]">{vibe}</h2>
            </div>
        </section>

        {/* Breakdown Cards */}
        <section className="space-y-6">
            
            {/* Strengths Card */}
            {strengths && strengths.length > 0 && (
            <div className="bg-[#ffffff]/5 rounded-3xl p-6 border border-[#ffffff]/10 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                        <Flame size={16} className="text-[#D4AF37]" />
                    </div>
                    <h3 className="text-lg font-medium tracking-wide">
                        {isGrooming ? (t("grooming_strengths") || t("strengths_title")) : t("strengths_title")}
                    </h3>
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
            )}

            {/* Improvements Card */}
            {improvements && improvements.length > 0 && (
            <div className="bg-[#ffffff]/5 rounded-3xl p-6 border border-[#ffffff]/10 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                        <Sparkles size={16} className="text-[#D4AF37]" />
                    </div>
                    <h3 className="text-lg font-medium tracking-wide">
                        {isGrooming ? (t("grooming_improvements") || t("improvements_title")) : t("improvements_title")}
                    </h3>
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
            )}

            {/* Save to Wardrobe Action */}
            <button onClick={() => handleSave(true)} disabled={isSaving} className="w-full mt-4 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-[#ffffff]/10 rounded-2xl p-5 flex items-center justify-between group hover:bg-[#2a2a2a] transition-all animate-fade-in-up block text-left" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] flex items-center justify-center border border-[#ffffff]/5 group-hover:border-[#D4AF37]/30 transition-colors">
                        {isSaving ? <LoaderCircle size={20} className="text-[#D4AF37] animate-spin" /> : <User size={20} className="text-[#D4AF37]" />}
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-[#F5F0E8]">{isSaving ? t("save_btn") + "..." : t("save_btn")}</p>
                        <p className="text-xs text-[#C8C8C8]/60 mt-0.5">{t("save_desc")}</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-[#C8C8C8]/40 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
            </button>

            {/* Publish to Community Action */}
            <button onClick={handleOpenPublishModal} disabled={isSaving} className="w-full mt-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#F3E5AB]/5 border border-[#D4AF37]/30 rounded-2xl p-5 flex items-center justify-between group hover:bg-[#D4AF37]/20 transition-all animate-fade-in-up block text-left" style={{ animationDelay: '1.2s' }}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] flex items-center justify-center border border-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 transition-colors">
                        <Share size={20} className="text-[#D4AF37]" />
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-[#D4AF37]">{t("publish_community")}</p>
                        <p className="text-xs text-[#C8C8C8]/60 mt-0.5">{t("publish_desc")}</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-[#D4AF37]/50 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
            </button>

        </section>
      </main>

      {/* Publish Community Modal */}
      {publishingAnalysisId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-3xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl relative">
            <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-[#D4AF37]/20 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="p-6 border-b border-white/5 relative z-10">
              <h3 className="text-xl font-serif text-[#F5F0E8] flex items-center gap-2">
                <Sparkles className="text-[#D4AF37]" size={20} />
                {t("hit_runway")}
              </h3>
              <p className="text-xs text-[#C8C8C8] mt-2">{t("hit_runway_desc")}</p>
            </div>
            
            <div className="p-6 space-y-4 relative z-10">
              <label className="block text-xs font-bold text-[#D4AF37] mb-3 uppercase tracking-widest text-center">{t("select_category")}</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'streetwear', label: t("cat_streetwear") },
                  { id: 'formal', label: t("cat_formal") },
                  { id: 'casual', label: t("cat_casual") },
                  { id: 'date_night', label: t("cat_date_night") },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setPublishCategory(cat.id)}
                    className={`py-4 px-2 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center ${publishCategory === cat.id ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105' : 'bg-white/5 border-white/10 text-[#C8C8C8] hover:bg-white/10 hover:border-white/20'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-white/5 flex gap-3 relative z-10 bg-black/40">
              <button 
                onClick={() => setPublishingAnalysisId(null)} 
                className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-[#C8C8C8] hover:bg-white/5 transition-colors text-sm font-medium"
                disabled={isCommunityPublishing}
              >
                {t("cancel")}
              </button>
              <button 
                onClick={handlePublishToCommunity}
                disabled={isCommunityPublishing}
                className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black hover:opacity-90 transition-opacity text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
              >
                {isCommunityPublishing ? <LoaderCircle size={16} className="animate-spin" /> : <Flame size={16} />}
                {isCommunityPublishing ? t("publishing") : t("publish_btn")}
              </button>
            </div>
          </div>
        </div>
      )}

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
