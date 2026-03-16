"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ScanFace } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const t = useTranslations("Login");
  const locale = useLocale();
  const supabase = createClient();
  const router = useRouter();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN") {
            router.push(`/${locale}`);
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, [supabase.auth, router, locale]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F0E8] relative overflow-hidden items-center justify-center p-6">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D4AF37] opacity/10 blur-[120px] rounded-full mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#C8C8C8] opacity/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      <Link href={`/${locale}`} className="absolute top-6 left-6 z-20 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
          <ArrowLeft size={18} className="text-[#C8C8C8]" />
      </Link>

      <div className="relative z-10 w-full max-w-md bg-[#ffffff]/5 backdrop-blur-2xl border border-[#ffffff]/10 rounded-3xl p-8 shadow-2xl overflow-hidden group">
        
        <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-[#ffffff]/10 to-transparent skew-x-[-30deg] group-hover:animate-shine pointer-events-none" />

        <div className="flex flex-col items-center mb-8 text-center">
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

        <div className="w-full">
            <Auth
                supabaseClient={supabase}
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            colors: {
                                brand: '#D4AF37',
                                brandAccent: '#B3932F',
                                inputText: '#F5F0E8',
                                inputBackground: 'rgba(255,255,255,0.05)',
                                inputBorder: 'rgba(255,255,255,0.1)',
                                inputBorderHover: '#D4AF37',
                                inputBorderFocus: '#D4AF37',
                            }
                        }
                    },
                    className: {
                        button: 'auth-btn',
                        input: 'auth-input',
                        label: 'auth-label'
                    }
                }}
                providers={['google', 'apple']}
                redirectTo={`${origin}/auth/callback?next=/${locale}`}
                localization={{
                    variables: {
                        sign_up: {
                            email_label: t("auth_signup_email"),
                            password_label: t("auth_signup_password"),
                            button_label: t("auth_signup_btn"),
                            social_provider_text: t("auth_signup_social"),
                            link_text: t("auth_signup_link")
                        },
                        sign_in: {
                            email_label: t("auth_signin_email"),
                            password_label: t("auth_signin_password"),
                            button_label: t("auth_signin_btn"),
                            social_provider_text: t("auth_signin_social"),
                            link_text: t("auth_signin_link")
                        }
                    }
                }}
            />
        </div>
        
        {/* Inject custom styles for the Auth UI since Tailwind overrides default Supabase styles heavily */}
        <style jsx global>{`
            .auth-btn {
                border-radius: 0.75rem !important;
                font-weight: 500 !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
            }
            .auth-input {
                border-radius: 0.75rem !important;
                background: rgba(0,0,0,0.5) !important;
                backdrop-filter: blur(12px) !important;
            }
            .auth-label {
                color: rgba(200,200,200,0.8) !important;
                font-size: 0.75rem !important;
                text-transform: uppercase !important;
                letter-spacing: 0.05em !important;
            }
        `}</style>

      </div>
    </div>
  );
}
