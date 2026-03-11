"use client";
import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

// Placeholder questions logic moved inside component to access translations

export default function OnboardingPage() {
  const t = useTranslations("Onboarding");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const router = useRouter();
  const locale = useLocale();

  const questions = [
    {
      id: "style_goal",
      question: t("q1_question"),
      options: [t("q1_opt1"), t("q1_opt2"), t("q1_opt3"), t("q1_opt4")]
    },
    {
      id: "vibe",
      question: t("q2_question"),
      options: [t("q2_opt1"), t("q2_opt2"), t("q2_opt3"), t("q2_opt4")]
    },
    {
      id: "colors",
      question: t("q3_question"),
      options: [t("q3_opt1"), t("q3_opt2"), t("q3_opt3"), t("q3_opt4")]
    }
  ];

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [questions[currentStep].id]: option });
    setTimeout(() => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Finish Questionnaire, move to upload or profile
            router.push(`/${locale}/upload`);
        }
    }, 400); // Small delay to show selection animation
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const q = questions[currentStep];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F0E8] relative overflow-hidden items-center justify-center p-6">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#C8C8C8]/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      {/* Progress Bar */}
      <div className="absolute top-12 w-full max-w-md px-6 flex items-center justify-between z-20">
        <button onClick={handleBack} disabled={currentStep === 0} className={`p-2 rounded-full border border-[#ffffff]/10 backdrop-blur-md transition-all ${currentStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#ffffff]/10'}`}>
            <ArrowLeft className="w-5 h-5 text-[#C8C8C8]" />
        </button>
        <div className="flex gap-2">
            {questions.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentStep ? 'w-8 bg-[#D4AF37]' : 'w-4 bg-[#ffffff]/20'}`} />
            ))}
        </div>
        <div className="p-2 opacity-0"><ArrowLeft className="w-5 h-5" /></div> {/* Spacer */}
      </div>

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center mt-12 transition-all duration-500">
        
        <div className="w-16 h-16 rounded-3xl bg-[#ffffff]/5 border border-[#ffffff]/10 flex items-center justify-center mb-8 backdrop-blur-xl animate-[pulse_4s_ease-in-out_infinite]">
            <Wand2 className="w-8 h-8 text-[#C8C8C8]" strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl font-serif text-center mb-10 font-medium tracking-tight h-16 flex items-center justify-center">
            {q.question}
        </h2>

        <div className="w-full flex flex-col gap-4">
            {q.options.map((option, index) => {
                const isSelected = answers[q.id] === option;
                return (
                    <button 
                        key={index}
                        onClick={() => handleSelect(option)}
                        className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 transform ${
                            isSelected 
                            ? 'bg-[#D4AF37]/10 border-[#D4AF37] scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.15)]' 
                            : 'bg-[#ffffff]/5 border-[#ffffff]/10 hover:bg-[#ffffff]/10 hover:border-[#ffffff]/20 hover:scale-[1.01]'
                        }`}
                    >
                        <span className={`font-medium ${isSelected ? 'text-[#D4AF37]' : 'text-[#F5F0E8]'}`}>{option}</span>
                        {isSelected && <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />}
                    </button>
                );
            })}
        </div>

      </div>

    </div>
  );
}
