"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScanFace } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function AnalyzePage() {
  const router = useRouter();
  const t = useTranslations("Analyze");
  const locale = useLocale();

  useEffect(() => {
    const processImage = async () => {
      try {
        const image = sessionStorage.getItem("mirr_image");
        const styleGoal = sessionStorage.getItem("mirr_style_goal");

        const analysisType = sessionStorage.getItem("mirr_analysis_type") || "outfit";
        const endpoint = analysisType === "grooming" ? "/api/analyze-grooming" : "/api/analyze";

        if (!image) {
          router.push(`/${locale}/upload`);
          return;
        }

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image, styleGoal }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("API Error Response:", errorData);
          const errorMsg = errorData.details ? encodeURIComponent(errorData.details) : "api_failed";
          throw new Error(errorMsg);
        }

        const data = await res.json();
        sessionStorage.setItem("mirr_result_data", JSON.stringify(data));
        router.push(`/${locale}/result`);

      } catch (error: any) {
        console.error("Error during analysis:", error);
        const errMsg = error.message && error.message !== "api_failed" ? error.message : "api_failed";
        router.push(`/${locale}/upload?error=${errMsg}`);
      }
    };

    processImage();
  }, [router, locale]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F0E8] relative overflow-hidden items-center justify-center">
      
      {/* Scanning Laser Animation Background */}
      <div className="absolute inset-0 z-0 flex flex-col items-center opacity-30">
          <div className="w-full h-[2px] bg-[#D4AF37] shadow-[0_0_20px_#D4AF37] animate-[scan_3s_ease-in-out_infinite]" />
      </div>
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#D4AF37]/20 blur-[100px] rounded-full mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#C8C8C8]/10 blur-[100px] rounded-full mix-blend-screen animate-pulse pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center p-8">
        
        {/* Pulsing Core Icon */}
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer rings */}
            <div className="absolute inset-0 border-[0.5px] border-[#D4AF37]/30 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="absolute inset-4 border border-[#D4AF37]/50 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]" />
            
            {/* Inner solid circle */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A] border border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                <ScanFace className="w-10 h-10 text-[#D4AF37] animate-pulse" strokeWidth={1} />
            </div>
        </div>

        {/* Dynamic Text */}
        <div className="space-y-3">
            <h2 className="text-3xl font-serif tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#F5F0E8] via-[#D4AF37] to-[#F5F0E8] animate-[gradient_3s_ease_infinite] bg-[length:200%_auto]">
                {t("title")}
            </h2>
            <div className="h-6 overflow-hidden">
                <div className="animate-[slide-up_4s_ease-in-out_infinite] flex flex-col gap-1 items-center text-[#C8C8C8]/80 text-sm font-light tracking-wide">
                    <span>{t("step1")}</span>
                    <span>{t("step2")}</span>
                    <span>{t("step3")}</span>
                    <span>{t("step4")}</span>
                    <span>{t("step1")}</span> {/* Duplicate for seamless loop */}
                </div>
            </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100vh); }
          50% { transform: translateY(100vh); }
          100% { transform: translateY(-100vh); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slide-up {
          0%, 20% { transform: translateY(0); }
          25%, 45% { transform: translateY(-28px); }
          50%, 70% { transform: translateY(-56px); }
          75%, 95% { transform: translateY(-84px); }
          100% { transform: translateY(-112px); }
        }
      `}</style>
    </div>
  );
}
