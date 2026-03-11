"use client";
import React, { useState } from "react";
import { ArrowLeft, Flame, Frown, MessageSquare, TrendingUp, Search } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function CommunityPage() {
  const t = useTranslations("Community");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<"feed" | "leaderboard">("feed");
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  // Mock Feed Data
  const profiles = [
    { id: 1, image: "https://images.unsplash.com/photo-1544265727-bb0364e52504?w=600&q=80", score: 94 },
    { id: 2, image: "https://images.unsplash.com/photo-1550614000-4b95d4660eb9?w=600&q=80", score: 88 },
    { id: 3, image: "https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=600&q=80", score: 76 },
  ];

  const handleRate = () => {
     // Animate out and move to next profile
     if (currentProfileIndex < profiles.length) {
         setCurrentProfileIndex(prev => prev + 1);
     }
  };

  const currentProfile = profiles[currentProfileIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F0E8] relative overflow-hidden pb-24">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#D4AF37]/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      {/* Header */}
      <header className="flex flex-col gap-4 p-6 z-20 sticky top-0 backdrop-blur-md bg-[#0A0A0A]/60 border-b border-[#ffffff]/5">
         <div className="flex justify-between items-center">
             <Link href={`/${locale}`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
                <ArrowLeft size={18} className="text-[#C8C8C8]" />
             </Link>
             <h1 className="text-sm font-semibold tracking-widest uppercase text-[#F5F0E8]">{t("title")}</h1>
             <div className="w-10 h-10" /> {/* Spacer */}
         </div>

         {/* Navigation Tabs */}
         <div className="flex bg-[#ffffff]/5 p-1 rounded-xl">
             <button 
                onClick={() => setActiveTab("feed")}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'feed' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-[#C8C8C8] hover:text-white'}`}
             >
                 {t("toggle_feed")}
             </button>
             <button 
                onClick={() => setActiveTab("leaderboard")}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'leaderboard' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-[#C8C8C8] hover:text-white'}`}
             >
                 {t("toggle_leaderboard")}
             </button>
         </div>
      </header>

      <main className="flex-1 flex flex-col z-10 px-6 pt-6 max-w-md mx-auto w-full relative">
        
        {activeTab === "feed" && (
            <div className="flex-1 flex flex-col items-center justify-center">
                {currentProfile ? (
                    <div className="w-full relative animate-fade-in-up">
                        {/* Feed Card */}
                        <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-[#ffffff]/10 bg-[#1a1a1a]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={currentProfile.image} alt="Anonymous look" className="w-full h-full object-cover" />
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                            
                            {/* Card Content & Actions */}
                            <div className="absolute bottom-0 w-full p-6 flex flex-col gap-6">
                                {/* Score Badge */}
                                <div className="self-start px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 flex items-center gap-1.5">
                                    <TrendingUp size={14} className="text-[#D4AF37]" />
                                    <span className="text-xs font-bold text-[#F5F0E8]">{currentProfile.score} Aura</span>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-3 justify-between">
                                    <button onClick={handleRate} className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 bg-[#ffffff]/10 hover:bg-[#ffffff]/15 backdrop-blur-md rounded-2xl border border-[#ffffff]/20 transition-all transform hover:scale-105 active:scale-95 group">
                                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                                           <Flame size={20} className="text-orange-400 group-hover:fill-orange-400" />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold tracking-wider">{t("rate_btn_fire")}</span>
                                    </button>

                                    <button onClick={handleRate} className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 bg-[#ffffff]/10 hover:bg-[#ffffff]/15 backdrop-blur-md rounded-2xl border border-[#ffffff]/20 transition-all transform hover:scale-105 active:scale-95 group">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                           <Frown size={20} className="text-blue-400" />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold tracking-wider">{t("rate_btn_meh")}</span>
                                    </button>

                                    <button onClick={handleRate} className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 bg-[#ffffff]/10 hover:bg-[#ffffff]/15 backdrop-blur-md rounded-2xl border border-[#ffffff]/20 transition-all transform hover:scale-105 active:scale-95 group">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                                           <MessageSquare size={20} className="text-purple-400 group-hover:fill-purple-400" />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold tracking-wider">{t("rate_btn_notes")}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-[#ffffff]/5 flex items-center justify-center border border-[#ffffff]/10 mb-4 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                            <Search size={32} className="text-[#D4AF37]/50" />
                        </div>
                        <h3 className="text-xl font-serif text-[#F5F0E8]">{t("no_more_profiles")}</h3>
                        <p className="text-[#C8C8C8] text-sm font-light">Check back later for new looks.</p>
                    </div>
                )}
            </div>
        )}

        {activeTab === "leaderboard" && (
            <div className="w-full flex flex-col gap-4 animate-fade-in">
                {profiles.map((profile, i) => (
                    <div key={i} className="flex items-center gap-4 bg-[#ffffff]/5 p-3 rounded-2xl border border-[#ffffff]/10">
                        <span className={`text-lg font-serif font-bold ${i === 0 ? 'text-[#D4AF37]' : i === 1 ? 'text-[#C8C8C8]' : 'text-orange-900'}`}>#{i + 1}</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={profile.image} alt="Leaderboard" className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1">
                            <span className="text-sm font-bold block">Anonymous {profile.id}</span>
                            <span className="text-xs text-[#C8C8C8]">{profile.score} Aura</span>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </main>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
