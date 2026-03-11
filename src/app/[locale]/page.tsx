import React from "react";
import { Camera, Search, User } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
  const t = useTranslations("Home");
  const locale = useLocale();

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F0E8] relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C8C8C8] opacity-5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center p-6 z-10 glass-dark sticky top-0">
         <h1 className="text-3xl tracking-widest font-serif font-medium" style={{ fontFamily: 'Canela, serif' }}>MIRR</h1>
         <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <User size={20} className="text-[#F5F0E8]" />
            </div>
         </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 z-10 text-center space-y-8 mt-12 mb-24">
        <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-serif leading-tight">
               {t("subtitle").split('. ').map((part, i, arr) => (
                 <React.Fragment key={i}>
                   {part}{i !== arr.length - 1 ? '.' : ''}
                   <br className="hidden md:block" />
                 </React.Fragment>
               ))}
            </h2>
            <p className="text-[#C8C8C8] text-lg md:text-xl font-light max-w-md mx-auto">
               {t("description")}
            </p>
        </div>

        {/* Primary Action Button */}
        <Link href={`/${locale}/login`} className="group relative px-8 py-4 bg-[#F5F0E8] text-[#0A0A0A] rounded-full font-medium text-lg tracking-wide transition-all hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.15)]">
            <span className="relative z-10 flex items-center gap-2">
                <Camera size={22} />
                {t("analyze_btn")}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
        </Link>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full glass-dark border-t border-white/10 px-8 py-4 flex justify-between items-center z-50 rounded-t-3xl">
          <Link href={`/${locale}/community`} className="flex flex-col items-center gap-1 text-[#D4AF37] transition-colors">
              <Search size={24} />
              <span className="text-[10px] uppercase font-medium tracking-wider">{t("nav_inspo")}</span>
          </Link>
          
          <Link href={`/${locale}/upload`} className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F5F0E8] flex items-center justify-center -mt-8 shadow-lg shadow-[#D4AF37]/20 text-black transform hover:scale-105 transition-transform">
                <Camera size={28} />
              </div>
          </Link>
          
          <Link href={`/${locale}/profile`} className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors">
              <User size={24} />
              <span className="text-[10px] uppercase font-medium tracking-wider">{t("nav_profile")}</span>
          </Link>
      </nav>
    </div>
  );
}
