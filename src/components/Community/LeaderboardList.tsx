"use client";

import React, { useState } from 'react';
import { Trophy, Medal, Sparkles, User, Filter, Crown, Lock } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface LeaderboardEntry {
  id: string;
  category: string;
  total_score: number;
  vote_count: number;
  profiles: {
    id?: string;
    username: string;
    avatar_url: string;
    is_public?: boolean;
  };
  analyses: {
    vibe: string;
  };
}

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  currentCategory: string;
  currentTimeframe: string;
  onFilterChange: (category: string, timeframe: string) => void;
  isLoading: boolean;
}

export default function LeaderboardList({ 
  entries, 
  currentCategory, 
  currentTimeframe, 
  onFilterChange,
  isLoading
}: LeaderboardListProps) {
  const t = useTranslations("Community");
  const locale = useLocale();
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', label: t('cat_all') },
    { id: 'streetwear', label: t('cat_streetwear') },
    { id: 'formal', label: t('cat_formal') },
    { id: 'casual', label: t('cat_casual') },
    { id: 'date_night', label: t('cat_date_night') },
  ];

  const timeframes = [
    { id: 'all', label: t('time_all') },
    { id: 'monthly', label: t('time_monthly') },
    { id: 'weekly', label: t('time_weekly') },
  ];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4 animate-fade-in pb-20">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#0A0A0A] rounded-3xl p-6 border border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.1)] relative overflow-hidden">
        <Crown size={120} className="absolute -right-6 -bottom-6 text-[#D4AF37]/10 -rotate-12" />
        <div className="relative z-10 flex items-center justify-between">
           <div>
             <h2 className="text-2xl font-serif text-[#F5F0E8] flex items-center gap-2">
                 <Trophy className="text-[#D4AF37]" size={24} />
                 {t("hall_of_fame")}
             </h2>
             <p className="text-xs text-[#C8C8C8] mt-1">
                {timeframes.find(t => t.id === currentTimeframe)?.label} • {categories.find(c => c.id === currentCategory)?.label}
             </p>
           </div>
           
           <button 
             onClick={() => setShowFilters(!showFilters)}
             className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border ${showFilters ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/5 border-white/10 text-[#C8C8C8] hover:bg-white/10'}`}
           >
              <Filter size={18} />
           </button>
        </div>

        {/* Filters Dropdown */}
        {showFilters && (
          <div className="mt-6 pt-4 border-t border-white/10 space-y-4 animate-fade-in relative z-20">
             <div>
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mb-2">Zaman</p>
                <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  {timeframes.map(tf => (
                    <button 
                      key={tf.id}
                      onClick={() => onFilterChange(currentCategory, tf.id)}
                      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${currentTimeframe === tf.id ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/5 border-white/10 text-[#C8C8C8] hover:border-white/20'}`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
             </div>
             <div>
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mb-2">Kategori</p>
                <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => onFilterChange(cat.id, currentTimeframe)}
                      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${currentCategory === cat.id ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/5 border-white/10 text-[#C8C8C8] hover:border-white/20'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* List */}
      <div className="space-y-3 mt-2">
        {isLoading ? (
            <div className="flex flex-col gap-3">
               {[1,2,3].map(i => (
                 <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
               ))}
            </div>
        ) : entries.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10">
                <Trophy size={32} className="mx-auto text-[#D4AF37]/30 mb-3" />
                <p className="text-[#C8C8C8] text-sm">{t("no_posts")}</p>
                <p className="text-xs text-[#C8C8C8]/60 mt-1">İlk sırayı sen al!</p>
            </div>
        ) : (
            entries.map((entry, index) => {
               const isPublic = entry.profiles?.is_public === true && !!entry.profiles?.id;
               
               const innerContent = (
                 <>
                  {/* Background Rank Glow for top 3 */}
                  {index === 0 && <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent opacity-50 pointer-events-none" />}
                  {index === 1 && <div className="absolute inset-0 bg-gradient-to-r from-[#C0C0C0]/20 to-transparent opacity-50 pointer-events-none" />}
                  {index === 2 && <div className="absolute inset-0 bg-gradient-to-r from-[#CD7F32]/20 to-transparent opacity-50 pointer-events-none" />}
                  
                  {/* Rank Number/Icon */}
                  <div className="w-8 flex justify-center shrink-0 z-10">
                    {index === 0 ? <Crown size={24} className="text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" /> : 
                     index === 1 ? <Medal size={24} className="text-[#C0C0C0]" /> : 
                     index === 2 ? <Medal size={24} className="text-[#CD7F32]" /> : 
                     <span className="text-sm font-bold text-[#C8C8C8]/50">#{index + 1}</span>}
                  </div>

                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full overflow-hidden shrink-0 z-10 bg-[#1a1a1a] border-2 ${index === 0 ? 'border-[#D4AF37]' : index === 1 ? 'border-[#C0C0C0]' : index === 2 ? 'border-[#CD7F32]' : 'border-white/10'}`}>
                    {entry.profiles?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.profiles.avatar_url} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full p-2.5 text-[#C8C8C8]" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 z-10">
                      <h4 className="flex items-center gap-1.5 text-[#F5F0E8] font-bold text-sm truncate">
                          {entry.profiles?.username || 'Anonymous'}
                          {!isPublic && (
                             <span title="Gizli Profil">
                               <Lock size={12} className="text-white/20" />
                             </span>
                          )}
                      </h4>
                      <p className="text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider truncate">{entry.analyses?.vibe || 'Style Icon'}</p>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-end shrink-0 z-10 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                      <span className="text-xl font-serif text-[#F5F0E8] leading-none mb-1">{entry.total_score}</span>
                      <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
                          Aura <Sparkles size={8} />
                      </span>
                  </div>
                 </>
               );

               const classNames = `relative bg-[#ffffff]/5 ${isPublic ? 'hover:bg-[#ffffff]/10 cursor-pointer hover:border-[#D4AF37]/30' : 'cursor-default'} border border-[#ffffff]/10 transition-all rounded-2xl p-4 flex items-center gap-4 group overflow-hidden`;

               if (isPublic && entry.profiles?.id) {
                 return <Link key={entry.id} href={`/${locale}/community/user/${entry.profiles.id}`} className={classNames}>{innerContent}</Link>;
               }

               return (
                 <div 
                   key={entry.id} 
                   className={classNames} 
                   onClick={() => toast.info('Bu kullanıcının profili gizli olduğu için kombinlerini göremezsiniz.', { autoClose: 2000 })}
                 >
                   {innerContent}
                 </div>
               );
            })
        )}
      </div>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
