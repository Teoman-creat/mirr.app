"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Sparkles, LoaderCircle, Lock } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "react-toastify";
import RunwayCard from "@/components/Community/RunwayCard";

export default function PublicProfilePage({ params }: { params: { userId: string } }) {
  const t = useTranslations("Community");
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/community/user/${params.userId}`);
      const data = await res.json();
      if (data.error) {
          setError(data.error);
          return;
      }
      setProfile(data.profile);
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      setError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId: string, score: number | null, reaction: string | null) => {
    try {
      const res = await fetch('/api/community/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, score, reaction })
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        return;
      }
      
      // Update local state to reflect vote so the user sees their updated aura rating right away
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            user_vote: { reaction, score }
          };
        }
        return p;
      }));
      toast.success("Oy kaydedildi!");
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Oy gönderilemedi.");
    }
  };

  if (loading) {
      return (
          <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F0E8] items-center justify-center">
              <LoaderCircle size={40} className="animate-spin text-[#D4AF37]" />
          </div>
      );
  }

  if (error) {
      return (
          <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F0E8] overflow-hidden pb-12">
              <header className="flex p-6 border-b border-[#ffffff]/5">
                  <Link href={`/${locale}/community`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
                      <ArrowLeft size={18} className="text-[#C8C8C8]" />
                  </Link>
              </header>
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <Lock size={48} className="text-[#D4AF37]/50 mb-4" />
                  <h2 className="text-xl font-serif text-[#F5F0E8] mb-2">{error}</h2>
                  <p className="text-[#C8C8C8] text-sm">Bu kullanıcı profilini gizlemiş veya bulunamıyor.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F0E8] relative overflow-hidden pb-24">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#D4AF37]/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center p-6 z-20 sticky top-0 backdrop-blur-md bg-[#0A0A0A]/60 border-b border-[#ffffff]/5">
         <Link href={`/${locale}/community`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} className="text-[#C8C8C8]" />
         </Link>
         <h1 className="text-sm font-semibold tracking-widest uppercase text-[#F5F0E8]">{profile?.username || 'Profile'}</h1>
         <div className="w-10 h-10" />
      </header>

      <main className="flex-1 flex flex-col z-10 px-6 pt-6 max-w-2xl mx-auto w-full">
         {/* User Stats Card */}
         <section className="bg-gradient-to-br from-[#ffffff]/5 to-transparent border border-[#ffffff]/10 rounded-3xl p-6 mb-8 backdrop-blur-sm relative overflow-hidden">
             <div className="flex items-center gap-5">
                 <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)] shrink-0 overflow-hidden">
                     {profile?.avatar_url ? (
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                         <User size={24} className="text-[#D4AF37]" />
                     )}
                 </div>
                 <div className="flex-1 min-w-0">
                     <h2 className="text-xl font-serif text-[#F5F0E8] truncate mb-1">
                       {profile?.full_name || profile?.username || "Style Icon"}
                     </h2>
                     <p className="text-xs text-[#C8C8C8] mb-1">
                       {profile?.city && profile?.country 
                         ? `${profile.city}, ${profile.country}`
                         : profile?.country || profile?.city || ""}
                     </p>
                     <p className="text-xs text-[#D4AF37] uppercase tracking-widest truncate">Style DNA: {profile?.style_dna?.vibe || "Discovering"}</p>
                 </div>
             </div>
         </section>

         {/* Posts Grid */}
         <div className="space-y-8 pb-12">
             <h3 className="text-sm font-medium tracking-wide text-[#C8C8C8] mb-6">Paylaşılan Kombinler</h3>
             {posts.length === 0 ? (
                 <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10">
                     <Sparkles size={32} className="mx-auto text-[#D4AF37]/30 mb-3" />
                     <p className="text-[#C8C8C8] text-sm">Kullanıcı henüz hiç kombin paylaşmadı.</p>
                 </div>
             ) : (
                 posts.map(post => (
                     <div key={post.id} className="animate-fade-in-up">
                         <RunwayCard post={post} onVote={handleVote} />
                     </div>
                 ))
             )}
         </div>
      </main>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
