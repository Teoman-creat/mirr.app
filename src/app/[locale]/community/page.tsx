"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "react-toastify";
import RunwayCard from "@/components/Community/RunwayCard";
import LeaderboardList from "@/components/Community/LeaderboardList";

export default function CommunityPage() {
  const t = useTranslations("Community");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<"feed" | "leaderboard">("feed");
  
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [lbCategory, setLbCategory] = useState("all");
  const [lbTimeframe, setLbTimeframe] = useState("all");

  useEffect(() => {
    fetchFeed();
  }, []);

  useEffect(() => {
    if (activeTab === "leaderboard") {
      fetchLeaderboard(lbCategory, lbTimeframe);
    }
  }, [activeTab, lbCategory, lbTimeframe]);

  const fetchFeed = async () => {
    try {
      setFeedLoading(true);
      const res = await fetch('/api/community/feed');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      // Filter out posts we've already voted on, optionally
      const unvoted = data.posts?.filter((p: any) => !p.user_vote) || [];
      setFeedPosts(unvoted);
    } catch (error) {
      console.error("Error fetching feed:", error);
      toast.error("Bağlantı hatası oluştu.");
    } finally {
      setFeedLoading(false);
    }
  };

  const fetchLeaderboard = async (category: string, timeframe: string) => {
    try {
      setLeaderboardLoading(true);
      const res = await fetch(`/api/community/leaderboard?category=${category}&timeframe=${timeframe}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLeaderboardLoading(false);
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
      
      // Move to next post after a short delay for animation
      setTimeout(() => {
        setCurrentPostIndex(prev => prev + 1);
      }, 500);

    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Oy gönderilemedi.");
    }
  };

  const currentPost = feedPosts[currentPostIndex];

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
             <h1 className="text-sm font-semibold tracking-widest uppercase text-[#F5F0E8]">{t("title") || "Community"}</h1>
             <div className="w-10 h-10" /> {/* Spacer */}
         </div>

         {/* Navigation Tabs */}
         <div className="flex bg-[#ffffff]/5 p-1 rounded-xl">
             <button 
                onClick={() => setActiveTab("feed")}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'feed' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-[#C8C8C8] hover:text-white'}`}
             >
                 {t("the_runway")}
             </button>
             <button 
                onClick={() => setActiveTab("leaderboard")}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'leaderboard' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-[#C8C8C8] hover:text-white'}`}
             >
                 {t("hall_of_fame")}
             </button>
         </div>
      </header>

      <main className="flex-1 flex flex-col z-10 px-6 pt-6 mx-auto w-full max-w-2xl relative">
        
        {activeTab === "feed" && (
            <div className="flex-1 flex flex-col items-center justify-center w-full">
                {feedLoading ? (
                  <div className="flex items-center justify-center p-20">
                    <LoaderCircle size={40} className="animate-spin text-[#D4AF37]" />
                  </div>
                ) : currentPost ? (
                  <div className="w-full relative animate-fade-in-up">
                    <RunwayCard 
                      post={currentPost} 
                      onVote={handleVote} 
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 animate-fade-in w-full max-w-sm mx-auto bg-white/5 p-8 rounded-3xl border border-white/10">
                      <div className="w-20 h-20 rounded-full bg-[#ffffff]/5 flex items-center justify-center border border-[#ffffff]/10 mb-2 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                          <Search size={32} className="text-[#D4AF37]/50" />
                      </div>
                      <h3 className="text-xl font-serif text-[#F5F0E8]">{t("no_more_profiles")}</h3>
                      <p className="text-[#C8C8C8] text-sm font-light leading-relaxed">Oy verilecek yeni kombin kalmadı. Kendi stilinizi paylaşın veya daha sonra tekrar dönün.</p>
                      
                      <button onClick={fetchFeed} className="mt-4 px-6 py-2 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider hover:bg-[#D4AF37]/10 transition-colors">
                        Yenile
                      </button>
                  </div>
                )}
            </div>
        )}

        {activeTab === "leaderboard" && (
           <LeaderboardList 
              entries={leaderboard}
              isLoading={leaderboardLoading}
              currentCategory={lbCategory}
              currentTimeframe={lbTimeframe}
              onFilterChange={(cat, tf) => {
                setLbCategory(cat);
                setLbTimeframe(tf);
              }}
           />
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
