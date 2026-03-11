import React from "react";
import { ArrowRight, ScanFace } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Login");
  const locale = useLocale();

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F0E8] relative overflow-hidden items-center justify-center p-6">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D4AF37] opacity/10 blur-[120px] rounded-full mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#C8C8C8] opacity/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md bg-[#ffffff]/5 backdrop-blur-2xl border border-[#ffffff]/10 rounded-3xl p-8 shadow-2xl overflow-hidden group">
        
        {/* Shine effect */}
        <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-[#ffffff]/10 to-transparent skew-x-[-30deg] group-hover:animate-shine pointer-events-none" />

        <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A] border border-[#ffffff]/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                <ScanFace className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 font-serif text-transparent bg-clip-text bg-gradient-to-br from-[#F5F0E8] to-[#C8C8C8]">
              {t("title")}
            </h1>
            <p className="text-[#C8C8C8]/70 text-sm">
                {t("subtitle")}
            </p>
        </div>

        <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-[#C8C8C8]/60 uppercase ml-1">{t("email_label")}</label>
                <input 
                  type="email" 
                  placeholder={t("email_placeholder")} 
                  className="w-full bg-[#0A0A0A]/50 border border-[#ffffff]/10 rounded-xl px-4 py-3.5 text-sm text-[#F5F0E8] placeholder-[#C8C8C8]/30 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all"
                />
            </div>
            
            <Link href={`/${locale}/onboarding`} className="w-full">
                <button 
                  type="button"
                  className="w-full mt-4 bg-gradient-to-r from-[#D4AF37] to-[#B3932F] text-[#0A0A0A] font-bold rounded-xl px-4 py-3.5 flex items-center justify-center gap-2 hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                >
                    {t("continue_btn")} <ArrowRight className="w-4 h-4" />
                </button>
            </Link>
        </form>

        <div className="mt-8 flex items-center justify-center">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#ffffff]/10 to-transparent" />
            <span className="px-3 text-xs text-[#C8C8C8]/40 uppercase tracking-widest whitespace-nowrap">{t("or")}</span>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#ffffff]/10 to-transparent" />
        </div>

        <div className="mt-6 flex gap-3">
             <button className="flex-1 bg-[#ffffff]/5 hover:bg-[#ffffff]/10 border border-[#ffffff]/5 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-medium transition-all">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                Google
             </button>
             <button className="flex-1 bg-[#ffffff]/5 hover:bg-[#ffffff]/10 border border-[#ffffff]/5 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-medium transition-all">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.19-.88 3.57-.8 1.5.09 2.58.62 3.42 1.49-2.9 1.76-2.42 5.56.44 6.78-1.02 2.45-2.01 4.58-2.51 4.72z" fill="currentColor"/><path d="M12.03 7.25c-.15-3.32 2.76-5.88 5.76-5.46.25 3.4-3.03 6-5.76 5.46z" fill="currentColor"/></svg>
                Apple
             </button>
        </div>
      </div>
    </div>
  );
}
