"use client";
import React, { useState } from "react";
import { ArrowLeft, User, Grid, TrendingUp, Scissors, Sparkles, Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("wardrobe");

  // Mock Data
  const mockOutfits = [
    { id: 1, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", score: 87, date: "Today" },
    { id: 2, img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80", score: 92, date: "2 days ago" },
    { id: 3, img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80", score: 78, date: "1 week ago" },
    { id: 4, img: "https://images.unsplash.com/photo-1434389671024-53c7416347bed?w=400&q=80", score: 85, date: "2 weeks ago" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F0E8] relative overflow-hidden pb-24">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#D4AF37]/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      {/* Header */}
      <header className="flex justify-between items-center p-6 z-20 sticky top-0 backdrop-blur-md bg-[#0A0A0A]/60 border-b border-[#ffffff]/5">
         <Link href={`/${locale}`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} className="text-[#C8C8C8]" />
         </Link>
         <h1 className="text-sm font-semibold tracking-widest uppercase text-[#F5F0E8]">{t("title")}</h1>
         <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      <main className="flex-1 flex flex-col z-10 px-6 pt-6 max-w-2xl mx-auto w-full">
        
        {/* User Stats Card */}
        <section className="bg-gradient-to-br from-[#ffffff]/5 to-transparent border border-[#ffffff]/10 rounded-3xl p-6 mb-8 backdrop-blur-sm relative overflow-hidden group">
            {/* Glow effect */}
            <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-[#D4AF37]/20 blur-[50px] rounded-full" />
            
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)] shrink-0">
                    <User size={24} className="text-[#D4AF37]" />
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-serif text-[#F5F0E8] mb-1">Alex Doe</h2>
                    <p className="text-xs text-[#D4AF37] uppercase tracking-widest">{t("style_dna")}: Minimalist</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#ffffff]/5">
                <div className="flex flex-col">
                    <span className="text-3xl font-serif text-[#F5F0E8]">85</span>
                    <span className="text-[10px] text-[#C8C8C8]/60 uppercase tracking-wider">{t("aura_score")}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-serif text-[#F5F0E8]">12</span>
                    <span className="text-[10px] text-[#C8C8C8]/60 uppercase tracking-wider">{t("saved_looks")}</span>
                </div>
            </div>
        </section>

        {/* Custom Tabs */}
        <nav className="flex gap-2 p-1.5 bg-[#ffffff]/5 rounded-2xl mb-6 backdrop-blur-md border border-[#ffffff]/10">
            <button 
                onClick={() => setActiveTab('wardrobe')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-2 ${activeTab === 'wardrobe' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'text-[#C8C8C8] hover:text-[#F5F0E8]'}`}
            >
                <Grid size={16} /> {t("tabs_wardrobe")}
            </button>
            <button 
                onClick={() => setActiveTab('evolution')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-2 ${activeTab === 'evolution' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'text-[#C8C8C8] hover:text-[#F5F0E8]'}`}
            >
                <TrendingUp size={16} /> {t("tabs_evolution")}
            </button>
            <button 
                onClick={() => setActiveTab('grooming')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-2 ${activeTab === 'grooming' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'text-[#C8C8C8] hover:text-[#F5F0E8]'}`}
            >
                <Scissors size={16} /> {t("tabs_grooming")}
            </button>
        </nav>

        {/* Tab Content */}
        <div className="flex-1">
            {activeTab === 'wardrobe' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium tracking-wide text-[#C8C8C8]">{t("recent_outfits")}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Add New Look Card */}
                        <Link href={`/${locale}/upload`} className="aspect-[3/4] rounded-2xl border border-dashed border-[#ffffff]/20 bg-[#ffffff]/2 hover:bg-[#ffffff]/5 flex flex-col items-center justify-center gap-3 transition-colors group">
                            <div className="w-12 h-12 rounded-full bg-[#ffffff]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus size={20} className="text-[#D4AF37]" />
                            </div>
                            <span className="text-xs text-[#C8C8C8] font-medium">{t("analyze_new")}</span>
                        </Link>

                        {/* Outfit Cards */}
                        {mockOutfits.map((outfit) => (
                            <div key={outfit.id} className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer border border-[#ffffff]/10 hover:border-[#D4AF37]/50 transition-colors">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={outfit.img} alt="Outfit" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                
                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                    <Sparkles size={12} className="text-[#D4AF37]" />
                                    <span className="text-xs font-bold text-[#F5F0E8]">{outfit.score}</span>
                                </div>
                                <span className="absolute bottom-3 right-3 text-[10px] text-[#C8C8C8]/80">{outfit.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'evolution' && (
                <div className="flex flex-col items-center justify-center h-48 animate-fade-in text-center border border-dashed border-[#ffffff]/10 rounded-3xl bg-[#ffffff]/2">
                    <TrendingUp size={32} className="text-[#D4AF37]/50 mb-4" />
                    <p className="text-sm text-[#C8C8C8]">Style Evolution chart coming soon.</p>
                </div>
            )}

            {activeTab === 'grooming' && (
                <div className="flex flex-col items-center justify-center h-48 animate-fade-in text-center border border-dashed border-[#ffffff]/10 rounded-3xl bg-[#ffffff]/2">
                    <Scissors size={32} className="text-[#D4AF37]/50 mb-4" />
                    <p className="text-sm text-[#C8C8C8]">Hair & Grooming analysis coming soon.</p>
                </div>
            )}
        </div>

      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
