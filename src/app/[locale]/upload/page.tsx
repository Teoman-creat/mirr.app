"use client";
import React, { useRef, useState, useEffect } from "react";
import { Camera, Image as ImageIcon, X, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "react-toastify";

type AnalysisType = 'outfit' | 'grooming';

export default function UploadPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [styleGoal, setStyleGoal] = useState<string>("");
  const [analysisType, setAnalysisType] = useState<AnalysisType>('outfit');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Upload");
  const locale = useLocale();

  useEffect(() => {
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      const errMsg = errorParam === "api_failed" 
        ? "Yapay Zeka analizi başarısız oldu. Lütfen tekrar deneyin." 
        : `API Hatası: ${decodeURIComponent(errorParam)}`;
      toast.error(errMsg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      // Clear the error parameter from the URL to prevent showing the toast again on refresh
      router.replace(`/${locale}/upload`);
    }
  }, [searchParams, router, locale]);

  useEffect(() => {
    const typeParam = searchParams?.get("type");
    if (typeParam === 'grooming' || typeParam === 'outfit') {
      setAnalysisType(typeParam);
    }
  }, [searchParams]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Compress image to avoid Vercel's 4.5MB serverless payload limit
      const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              let { width, height } = img;
              const maxSize = 800; // Optimal size for Gemini Vision

              if (width > height && width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
              } else if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.8)); // 80% quality JPEG
            };
            img.src = event.target?.result as string;
          };
          reader.readAsDataURL(file);
        });
      };

      const compressedDataUrl = await compressImage(file);
      setSelectedImage(compressedDataUrl);
    }
  };

  const handleAnalyze = () => {
    if (selectedImage) {
        sessionStorage.setItem("mirr_image", selectedImage);
        sessionStorage.setItem("mirr_style_goal", styleGoal);
        sessionStorage.setItem("mirr_analysis_type", analysisType);
        router.push(`/${locale}/analyze`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F0E8] relative overflow-hidden">
      
      {/* Header */}
      <header className="flex justify-between items-center p-6 z-20">
         <Link href={`/${locale}`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
            <X size={20} className="text-[#C8C8C8]" />
         </Link>
         <h1 className="text-xl font-serif">{t("title")}</h1>
         <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        
        {!selectedImage ? (
            <div className="w-full max-w-sm flex flex-col gap-6">

                {/* Type Selection Toggle */}
                <div className="flex bg-[#ffffff]/5 rounded-2xl p-1.5 border border-[#ffffff]/10">
                    <button 
                        onClick={() => setAnalysisType('outfit')}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${analysisType === 'outfit' ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'text-[#C8C8C8] hover:text-white'}`}
                    >
                        {t("type_outfit") || "Outfit"}
                    </button>
                    <button 
                        onClick={() => setAnalysisType('grooming')}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${analysisType === 'grooming' ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'text-[#C8C8C8] hover:text-white'}`}
                    >
                        {t("type_grooming") || "Grooming"}
                    </button>
                </div>

                <div className="w-full aspect-[3/4] rounded-3xl border-2 border-dashed border-[#ffffff]/20 bg-[#ffffff]/5 flex flex-col items-center justify-center gap-6 relative group overflow-hidden">
                    
                    {/* Decorative background glow inside the box */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#D4AF37]/5 pointer-events-none" />

                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F5F0E8] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] text-black mb-4">
                        <Camera size={32} />
                    </div>
                    
                    <div className="text-center space-y-2 z-10 px-6">
                        <h3 className="text-2xl font-serif">{analysisType === 'outfit' ? t("take_photo") : (t("take_face_photo") || "Face Photo")}</h3>
                        <p className="text-[#C8C8C8] text-sm">
                            {analysisType === 'outfit' ? t("instruction") : (t("instruction_face") || "Upload a clear, front-facing photo of your face.")}
                        </p>
                    </div>

                    <div className="absolute bottom-6 flex gap-3 w-full px-6 z-10">
                        {/* Camera Button (Mobile Native) */}
                        <button 
                            onClick={() => cameraInputRef.current?.click()}
                            className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black hover:opacity-90 rounded-xl py-3.5 flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#D4AF37]/20"
                        >
                            <Camera size={22} className="text-black" />
                            <span className="text-[10px] uppercase tracking-wider font-bold">{t("camera_btn") || "Camera"}</span>
                        </button>
                        <input 
                            type="file" 
                            accept="image/*" 
                            capture="user"
                            className="hidden" 
                            ref={cameraInputRef}
                            onChange={handleImageUpload}
                        />

                        {/* Gallery Button */}
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 bg-[#ffffff]/10 hover:bg-[#ffffff]/15 border border-[#ffffff]/10 rounded-xl py-3.5 flex flex-col items-center justify-center gap-1.5 transition-colors backdrop-blur-md"
                        >
                            <ImageIcon size={22} className="text-[#D4AF37]" />
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#F5F0E8]">{t("gallery")}</span>
                        </button>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>
            </div>
        ) : (
            <div className="w-full max-w-sm flex flex-col items-center animate-fade-in relative">
                {/* Image Preview Container */}
                <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-[#ffffff]/10 mb-8">
                    {/* Image overlay gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={selectedImage} 
                        alt="Selected outfit" 
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Retake Button */}
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Style Goal Input */}
                <div className="w-full mb-8">
                    <label className="text-xs font-semibold tracking-wider text-[#C8C8C8]/60 uppercase ml-1 mb-2 block animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        {t("style_goal_label")}
                    </label>
                    <input 
                        type="text" 
                        value={styleGoal}
                        onChange={(e) => setStyleGoal(e.target.value)}
                        placeholder={t("style_goal_placeholder")} 
                        className="w-full bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-xl px-4 py-4 text-sm text-[#F5F0E8] placeholder-[#C8C8C8]/30 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all backdrop-blur-md shadow-inner animate-fade-in"
                        style={{ animationDelay: '0.3s' }}
                    />
                </div>

                {/* AI Analyze Button */}
                <button 
                    onClick={handleAnalyze}
                    className="w-full group relative px-8 py-5 bg-gradient-to-r from-[#D4AF37] to-[#B3932F] text-[#0A0A0A] rounded-2xl font-bold tracking-wide transition-all shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2 text-lg">
                        <Zap size={22} className="fill-current animate-pulse" />
                        {t("analyze_btn")}
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                </button>
            </div>
        )}

      </main>
    </div>
  );
}
