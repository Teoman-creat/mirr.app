"use client";

import React, { useState } from 'react';
import { Flame, Star, Sparkles, User, BadgeAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PostDetails {
  id: string;
  category: string;
  total_score: number;
  vote_count: number;
  created_at: string;
  analyses: {
    image_url: string;
    vibe: string;
    reasoning: string;
  };
  profiles: {
    username: string;
    avatar_url: string;
    full_name: string;
  };
  user_vote?: {
    reaction: string | null;
    score: number | null;
  } | null;
}

interface RunwayCardProps {
  post: PostDetails;
  onVote: (postId: string, score: number | null, reaction: string | null) => Promise<void>;
}

export default function RunwayCard({ post, onVote }: RunwayCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [showRatingSlider, setShowRatingSlider] = useState(false);
  const [auraScore, setAuraScore] = useState(5);
  const [votedScore, setVotedScore] = useState<number | null>(post.user_vote?.score || null);
  const [votedReaction, setVotedReaction] = useState<string | null>(post.user_vote?.reaction || null);

  const t = useTranslations("Community");

  const imageUrl = post.analyses.image_url?.startsWith('http') 
    ? post.analyses.image_url 
    : `https://guzatcuhupifrhkrnmxe.supabase.co/storage/v1/object/public/analyses/${post.analyses.image_url}`;

  const handleQuickReaction = async (reaction: string) => {
    if (isVoting) return;
    setIsVoting(true);
    await onVote(post.id, null, reaction);
    setVotedReaction(reaction);
    setIsVoting(false);
  };

  const handleAuraSubmit = async () => {
    if (isVoting) return;
    setIsVoting(true);
    await onVote(post.id, auraScore, null);
    setVotedScore(auraScore);
    setShowRatingSlider(false);
    setIsVoting(false);
  };

  return (
    <div className="relative w-full max-w-sm aspect-[4/5] mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-[#0A0A0A]">
      {/* Dynamic Glow Layer */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none" />
      
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={imageUrl} 
        alt="Outfit" 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Top Badges */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold text-[#D4AF37] border border-[#D4AF37]/30">
          {t("cat_" + post.category) || post.category}
        </span>
      </div>

      {/* User Info Overlay */}
      <div className="absolute bottom-24 left-4 right-4 z-20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]/50 bg-[#1a1a1a]">
            {post.profiles.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.profiles.avatar_url} alt={post.profiles.username} className="w-full h-full object-cover" />
            ) : (
              <User size={20} className="w-full h-full p-2 text-[#D4AF37]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[#F5F0E8] font-bold text-sm truncate">{post.profiles.username || 'Anonymous'}</h3>
            <p className="text-[#D4AF37] text-xs font-semibold uppercase">{post.analyses.vibe || 'Unknown Vibe'}</p>
          </div>
        </div>
        <p className="text-[#C8C8C8] text-xs line-clamp-2 leading-relaxed italic">
          "{post.analyses.reasoning || 'No details provided.'}"
        </p>
      </div>

      {/* Action Bar */}
      <div className="absolute bottom-6 left-4 right-4 z-30">
        {showRatingSlider ? (
          <div className="bg-black/80 backdrop-blur-md border border-[#D4AF37]/30 rounded-2xl p-4 flex flex-col gap-4 animate-fade-in shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <div className="flex justify-between items-center text-[#F5F0E8]">
              <span className="text-xs font-semibold">{t("low_aura")}</span>
              <span className="text-xl font-serif text-[#D4AF37]">{auraScore}</span>
              <span className="text-xs font-semibold">{t("max_aura")}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={auraScore}
              onChange={(e) => setAuraScore(Number(e.target.value))}
              className="w-full accent-[#D4AF37]"
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setShowRatingSlider(false)}
                className="flex-1 py-2 rounded-xl border border-white/20 text-xs text-[#C8C8C8] hover:bg-white/10 transition-colors"
              >
                {t("cancel")}
              </button>
              <button 
                onClick={handleAuraSubmit}
                disabled={isVoting}
                className="flex-[2] py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-bold text-xs hover:opacity-90 shadow-lg shadow-[#D4AF37]/20"
              >
                {t("give_aura")}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 h-14">
            <button 
              onClick={() => handleQuickReaction('fire')}
              disabled={isVoting || votedReaction === 'fire'}
              className={`flex-1 rounded-2xl flex items-center justify-center gap-2 transition-all backdrop-blur-md border ${votedReaction === 'fire' ? 'bg-[#ff4b4b]/20 border-[#ff4b4b]/50 text-[#ff4b4b] shadow-[0_0_20px_rgba(255,75,75,0.2)]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
            >
              <Flame size={20} className={votedReaction === 'fire' ? 'fill-current' : ''} />
              <span className="font-bold tracking-wider uppercase text-xs">{t("rate_btn_fire")}</span>
            </button>
            <button 
              onClick={() => handleQuickReaction('meh')}
              disabled={isVoting || votedReaction === 'meh'}
              className={`flex-1 rounded-2xl flex items-center justify-center gap-2 transition-all backdrop-blur-md border ${votedReaction === 'meh' ? 'bg-[#707070]/30 border-[#707070]/50 text-white shadow-[0_0_20px_rgba(112,112,112,0.2)]' : 'bg-white/5 border-white/10 text-[#C8C8C8] hover:bg-white/10'}`}
            >
              <BadgeAlert size={20} />
              <span className="font-bold tracking-wider uppercase text-xs">{t("rate_btn_meh")}</span>
            </button>
            <button 
              onClick={() => setShowRatingSlider(true)}
              className={`flex-1 rounded-2xl flex items-center justify-center gap-2 transition-all backdrop-blur-md border ${votedScore ? 'bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'bg-gradient-to-tr from-[#D4AF37]/10 to-[#F5F0E8]/5 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/20'}`}
            >
              <Sparkles size={20} className={votedScore ? 'fill-current' : ''} />
              <span className="font-bold tracking-wider uppercase text-xs">
                {votedScore ? `${votedScore} Aura` : t("set_aura") || 'Aura'}
              </span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
