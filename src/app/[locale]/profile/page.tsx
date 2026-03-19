"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Grid, TrendingUp, Scissors, Sparkles, Plus, LoaderCircle, Edit2, Share2, ArrowRight, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const tResult = useTranslations("Result");
  const locale = useLocale();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("wardrobe");
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [outfitAnalyses, setOutfitAnalyses] = useState<any[]>([]);
  const [groomingAnalyses, setGroomingAnalyses] = useState<any[]>([]);
  const [stats, setStats] = useState({ averageScore: 0, savedLooks: 0 });

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", username: "", vibe: "", country: "", city: "", district: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Publish States
  const [publishingAnalysisId, setPublishingAnalysisId] = useState<string | null>(null);
  const [publishCategory, setPublishCategory] = useState("streetwear");
  const [isPublishing, setIsPublishing] = useState(false);

  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);
  const [ghostMode, setGhostMode] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [fitPref, setFitPref] = useState('regular');
  const [archetype, setArchetype] = useState('versatile');

  const changeLanguage = (newLocale: string) => {
     let newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
     if (newPath === pathname) { // the prefix wasn't there
       newPath = `/${newLocale}${pathname === '/' ? '' : pathname}`;
     }
     router.push(newPath);
  };

  const saveSettings = async () => {
    try {
      const supabase = createClient();
      const newStyleDna = { ...(userProfile?.style_dna || {}), ghost_mode: ghostMode, fit: fitPref, archetype };
      const { error } = await supabase.from('profiles').update({
         style_dna: newStyleDna,
         is_public: isPublic
      }).eq('id', userProfile?.id);
      
      if (!error) {
        setUserProfile({ ...userProfile, style_dna: newStyleDna, is_public: isPublic });
        setShowSettings(false);
      } else {
        alert("Failed to save settings: " + error.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch profile details
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          const meta = user.user_metadata || {};
          const fallbackName = meta.full_name || meta.name || user.email?.split('@')[0] || "";
          const fallbackAvatar = meta.avatar_url || meta.picture || "";

          setUserProfile({
            ...(profileData || {}),
            full_name: profileData?.full_name || fallbackName,
            avatar_url: profileData?.avatar_url || fallbackAvatar,
            username: profileData?.username || meta.preferred_username || "",
            style_dna: profileData?.style_dna || {}
          });

          setIsPublic(profileData?.is_public || false);
          setGhostMode(profileData?.style_dna?.ghost_mode || false);
          setFitPref(profileData?.style_dna?.fit || 'regular');
          setArchetype(profileData?.style_dna?.archetype || 'versatile');

          setEditForm({
            full_name: profileData?.full_name || fallbackName,
            username: profileData?.username || meta.preferred_username || "",
            vibe: profileData?.style_dna?.vibe || "",
            country: profileData?.country || "",
            city: profileData?.city || "",
            district: profileData?.district || ""
          });

          // Fetch user analyses
          const { data: analysesData, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!error && analysesData) {
            const outfits = analysesData.filter(a => a.type === 'OUTFIT' || !a.type); // fallback for existing ones
            const groomings = analysesData.filter(a => a.type === 'GROOMING');
            
            setOutfitAnalyses(outfits);
            setGroomingAnalyses(groomings);
            
            setStats({
              savedLooks: outfits.length,
              averageScore: outfits.length > 0 
                ? Math.round(outfits.reduce((acc, curr) => acc + (curr.aura_score || 0), 0) / outfits.length) 
                : 0
            });
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    const diffInDays = Math.floor(diffInSeconds / 86400);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 30) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.");
        return;
      }

      let newAvatarUrl = userProfile?.avatar_url;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(fileName, avatarFile);
        
        if (!uploadError) {
           const { data: publicUrlData } = supabase.storage.from('profiles').getPublicUrl(fileName);
           newAvatarUrl = publicUrlData.publicUrl;
        } else {
           console.error("Upload error:", uploadError);
           alert("Hesap fotoğrafı yüklenemedi: " + uploadError.message);
           setIsSaving(false);
           return;
        }
      }

      const styleDna = { ...(userProfile?.style_dna || {}), vibe: editForm.vibe };

      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: editForm.full_name,
          username: editForm.username?.trim() || null,
          avatar_url: newAvatarUrl,
          style_dna: styleDna,
          country: editForm.country,
          city: editForm.city,
          district: editForm.district
        }, { onConflict: 'id' });

      if (updateError) {
        console.error("Update error:", updateError);
        if (updateError.message.includes("profiles_username_key")) {
          alert("Bu kullanıcı adı başkası tarafından alınmış. Lütfen başka bir kullanıcı adı seçin.");
        } else {
          alert("Profil kaydedilemedi: " + updateError.message);
        }
      } else {
        setUserProfile((prev: any) => ({
          ...prev,
          full_name: editForm.full_name,
          username: editForm.username,
          avatar_url: newAvatarUrl,
          style_dna: styleDna,
          country: editForm.country,
          city: editForm.city,
          district: editForm.district
        }));
        setGhostMode(styleDna?.ghost_mode || false);
        setFitPref(styleDna?.fit || 'regular');
        setArchetype(styleDna?.archetype || 'versatile');
        setIsEditing(false);
      }
    } catch (error: any) {
        console.error("Error saving profile:", error);
        alert("Bilinmeyen bir hata oluştu: " + (error?.message || String(error)));
    } finally {
        setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!publishingAnalysisId) return;
    setIsPublishing(true);
    try {
      const res = await fetch('/api/community/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis_id: publishingAnalysisId, category: publishCategory })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Topluluğa başarıyla gönderildi!");
        setPublishingAnalysisId(null);
      } else {
        alert("Hata: " + (data.error || "Bilinmeyen hata"));
      }
    } catch (err) {
      console.error(err);
      alert("Gönderilirken bir hata oluştu.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push(`/${locale}/login`);
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F0E8] relative overflow-hidden pb-24">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#D4AF37]/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      {/* Header */}
      <header className="flex justify-between items-center p-6 z-20 sticky top-0 backdrop-blur-md bg-[#0A0A0A]/60 border-b border-[#ffffff]/5">
         <Link href={`/${locale}`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} className="text-[#C8C8C8]" />
         </Link>
         <h1 className="text-sm font-semibold tracking-widest uppercase text-[#F5F0E8]">{t("title")}</h1>
         <div className="flex gap-2">
           <button 
             onClick={() => setShowSettings(true)} 
             className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-colors text-[#C8C8C8]"
           >
              <Settings size={16} />
           </button>
           <button 
             onClick={handleLogout} 
             title={t("logout")} 
             className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-[#ff4b4b]/20 hover:text-[#ff4b4b] hover:border-[#ff4b4b]/50 transition-colors text-[#C8C8C8]"
           >
              <LogOut size={16} />
           </button>
         </div>
      </header>

      <main className="flex-1 flex flex-col z-10 px-6 pt-6 max-w-2xl mx-auto w-full">
        
        {/* User Stats Card */}
        <section className="bg-gradient-to-br from-[#ffffff]/5 to-transparent border border-[#ffffff]/10 rounded-3xl p-6 mb-8 backdrop-blur-sm relative overflow-hidden group">
            {/* Glow effect */}
            <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-[#D4AF37]/20 blur-[50px] rounded-full" />
            
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)] shrink-0 overflow-hidden">
                    {userProfile?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <User size={24} className="text-[#D4AF37]" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-serif text-[#F5F0E8] truncate">
                        {loading ? "..." : (userProfile?.full_name || userProfile?.username || "Style Icon")}
                      </h2>
                      {!loading && (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all shrink-0 text-[#C8C8C8]">
                          <Edit2 size={12} />
                          <span>{t("edit_profile")}</span>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-[#C8C8C8] mb-1">
                      {userProfile?.city && userProfile?.country 
                        ? `${userProfile.city}, ${userProfile.country}`
                        : userProfile?.country || userProfile?.city || ""}
                    </p>
                    <p className="text-xs text-[#D4AF37] uppercase tracking-widest truncate">{t("style_dna")}: {userProfile?.style_dna?.vibe || "Discovering"}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#ffffff]/5">
                <div className="flex flex-col">
                    <span className="text-3xl font-serif text-[#F5F0E8]">{loading ? "-" : stats.averageScore}</span>
                    <span className="text-[10px] text-[#C8C8C8]/60 uppercase tracking-wider">{t("aura_score")}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-serif text-[#F5F0E8]">{loading ? "-" : stats.savedLooks}</span>
                    <span className="text-[10px] text-[#C8C8C8]/60 uppercase tracking-wider">{t("saved_looks")}</span>
                </div>
            </div>
        </section>

        {/* Explore Community Banner */}
        <Link href={`/${locale}/community`} className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-3xl p-5 mb-8 backdrop-blur-sm relative overflow-hidden group flex items-center justify-between transition-all hover:bg-[#D4AF37]/20">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#D4AF37]/10 blur-[40px] rounded-full pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] flex items-center justify-center border border-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 transition-colors shadow-lg shadow-[#D4AF37]/10">
                    <Sparkles size={20} className="text-[#D4AF37]" />
                </div>
                <div className="text-left">
                    <h3 className="text-lg font-serif text-[#F5F0E8] flex items-center gap-2">{t("explore_community")}</h3>
                    <p className="text-xs text-[#C8C8C8]/80 mt-1">{t("explore_community_desc")}</p>
                </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-black/40 border border-white/5 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors relative z-10">
                <ArrowRight size={18} className="text-[#D4AF37] group-hover:text-black" />
            </div>
        </Link>

        {/* Custom Tabs */}
        <nav className="flex gap-2 p-1.5 bg-[#ffffff]/5 rounded-2xl mb-6 backdrop-blur-md border border-[#ffffff]/10">
            <button 
                onClick={() => setActiveTab('wardrobe')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-2 ${activeTab === 'wardrobe' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'text-[#C8C8C8] hover:text-[#F5F0E8]'}`}
            >
                <Grid size={16} /> {t("tabs_wardrobe")}
            </button>
            <button 
                onClick={() => setActiveTab('evolution')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-2 ${activeTab === 'evolution' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'text-[#C8C8C8] hover:text-[#F5F0E8]'}`}
            >
                <TrendingUp size={16} /> {t("tabs_evolution")}
            </button>
            <button 
                onClick={() => setActiveTab('grooming')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-2 ${activeTab === 'grooming' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'text-[#C8C8C8] hover:text-[#F5F0E8]'}`}
            >
                <Scissors size={16} /> {t("tabs_grooming")}
            </button>
        </nav>

        {/* Tab Content */}
        <div className="flex-1">
            {activeTab === 'wardrobe' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium tracking-wide text-[#C8C8C8]">{t("recent_outfits")}</h3>
                    </div>
                    
                    {loading ? (
                        <div className="py-12 flex justify-center items-center">
                            <LoaderCircle className="animate-spin text-[#D4AF37]" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {/* Add New Look Card */}
                            <Link href={`/${locale}/upload`} className="aspect-[3/4] rounded-2xl border border-dashed border-[#ffffff]/20 bg-[#ffffff]/2 hover:bg-[#ffffff]/5 flex flex-col items-center justify-center gap-3 transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-[#ffffff]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus size={20} className="text-[#D4AF37]" />
                                </div>
                                <span className="text-xs text-[#C8C8C8] font-medium">{t("analyze_new")}</span>
                            </Link>

                            {/* Outfit Cards */}
                            {outfitAnalyses.map((analysis) => {
                                // Extract public URL if it's a relative path from storage
                                const imageUrl = analysis.image_url?.startsWith('http') 
                                    ? analysis.image_url 
                                    : `https://guzatcuhupifrhkrnmxe.supabase.co/storage/v1/object/public/analyses/${analysis.image_url}`;

                                return (
                                <div key={analysis.id} className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer border border-[#ffffff]/10 hover:border-[#D4AF37]/50 transition-all duration-300">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={imageUrl} alt="Analysis" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    
                                    {/* Base Gradient for metrics */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                                    
                                    {/* Share Button (Top Right) */}
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setPublishingAnalysisId(analysis.id); }}
                                      className="absolute top-3 right-3 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all shadow-lg"
                                      title="Topluluğa Gönder"
                                    >
                                      <Share2 size={16} />
                                    </button>

                                    {/* Default View: Score & Time */}
                                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end group-hover:opacity-0 transition-opacity duration-300 z-10">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg border border-[#D4AF37]/20">
                                            <Sparkles size={12} className="text-[#D4AF37]" />
                                            <span className="text-xs font-bold text-[#F5F0E8]">{analysis.aura_score || '-'}</span>
                                        </div>
                                        <span className="text-[10px] text-[#C8C8C8]/80">{getRelativeTime(analysis.created_at)}</span>
                                    </div>

                                    {/* Hover Overlay: Vibe & Comments */}
                                    <div className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-center z-10 pointer-events-none">
                                        <h4 className="text-[#D4AF37] font-semibold text-sm mb-2 uppercase tracking-wide">{analysis.vibe || 'Style DNA'}</h4>
                                        <p className="text-[#F5F0E8] text-xs leading-relaxed line-clamp-4 italic mb-4">
                                            "{analysis.reasoning || 'Otantik bir stil yansıması.'}"
                                        </p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'evolution' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-[#ffffff]/5 rounded-3xl p-6 border border-[#ffffff]/10 backdrop-blur-sm relative overflow-hidden group">
                        {/* Glow effect */}
                        <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-[#D4AF37]/10 blur-[50px] rounded-full point-events-none" />
                        
                        <div className="flex justify-between items-center mb-6">
                           <div>
                               <h3 className="text-sm font-medium tracking-wide text-[#F5F0E8] uppercase">{t("evolution_chart_title") || "Aura Progression"}</h3>
                               <p className="text-xs text-[#C8C8C8]/60 mt-1">Your style journey over time</p>
                           </div>
                           <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                              <TrendingUp size={18} className="text-[#D4AF37]" />
                           </div>
                        </div>

                        {outfitAnalyses.length < 2 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center">
                                <Sparkles size={24} className="text-[#D4AF37]/50 mb-3" />
                                <p className="text-sm text-[#C8C8C8]">Not enough data yet.</p>
                                <p className="text-xs text-[#C8C8C8]/60 mt-1">Analyze more outfits to unlock your evolution chart.</p>
                            </div>
                        ) : (
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart 
                                        data={[...outfitAnalyses].reverse().map(a => ({
                                            date: new Date(a.created_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric' }),
                                            fullDate: new Date(a.created_at).toLocaleDateString(),
                                            score: a.aura_score,
                                            vibe: a.vibe
                                        }))} 
                                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="#C8C8C8" 
                                            fontSize={10} 
                                            tickLine={false}
                                            axisLine={false}
                                            opacity={0.5}
                                        />
                                        <YAxis 
                                            stroke="#C8C8C8" 
                                            fontSize={10} 
                                            tickLine={false}
                                            axisLine={false}
                                            opacity={0.5}
                                            domain={['dataMin - 5', 'dataMax + 5']}
                                        />
                                        <Tooltip 
                                            content={({ active, payload }: any) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-[#0A0A0A]/90 border border-[#D4AF37]/30 backdrop-blur-md p-3 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                                            <p className="text-[10px] text-[#C8C8C8] mb-1">{data.fullDate}</p>
                                                            <div className="flex items-center gap-2 mb-1">
                                                              <span className="text-lg font-serif text-[#F5F0E8]">{data.score}</span>
                                                              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">Aura</span>
                                                            </div>
                                                            <p className="text-xs text-[#F5F0E8]/80">{data.vibe}</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="score" 
                                            stroke="#D4AF37" 
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#0A0A0A', stroke: '#D4AF37', strokeWidth: 2 }}
                                            activeDot={{ r: 6, fill: '#D4AF37', stroke: '#fff', strokeWidth: 2 }}
                                            animationDuration={1500}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'grooming' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium tracking-wide text-[#C8C8C8]">{t("recent_grooming")}</h3>
                    </div>
                    
                    {loading ? (
                        <div className="py-12 flex justify-center items-center">
                            <LoaderCircle className="animate-spin text-[#D4AF37]" />
                        </div>
                    ) : groomingAnalyses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center border border-dashed border-[#ffffff]/10 rounded-3xl bg-[#ffffff]/2">
                            <Scissors size={24} className="text-[#D4AF37]/50 mb-3" />
                            <p className="text-sm text-[#C8C8C8]">{t("grooming_empty")}</p>
                            <Link href={`/${locale}/upload?type=grooming`} className="mt-3 text-xs text-[#D4AF37] hover:underline">{t("scan_grooming")}</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {groomingAnalyses.map((analysis) => {
                                const imageUrl = analysis.image_url?.startsWith('http') 
                                    ? analysis.image_url 
                                    : `https://guzatcuhupifrhkrnmxe.supabase.co/storage/v1/object/public/analyses/${analysis.image_url}`;

                                return (
                                <div key={analysis.id} className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-[#ffffff]/10 hover:border-[#D4AF37]/50 transition-all duration-300">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={imageUrl} alt="Grooming" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                                    
                                    {/* Share Button (Top Right) */}
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setPublishingAnalysisId(analysis.id); }}
                                      className="absolute top-3 right-3 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all shadow-lg"
                                      title="Topluluğa Gönder"
                                    >
                                      <Share2 size={16} />
                                    </button>

                                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end group-hover:opacity-0 transition-opacity duration-300 z-10">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-[#D4AF37] uppercase">{analysis.vibe || 'Face Shape'}</span>
                                        </div>
                                        <span className="text-[10px] text-[#C8C8C8]/80">{getRelativeTime(analysis.created_at)}</span>
                                    </div>

                                    <div className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-center z-10 pointer-events-none">
                                        <h4 className="text-[#D4AF37] font-semibold text-xs mb-1 uppercase tracking-wide">{tResult("ai_notes")}</h4>
                                        <p className="text-[#F5F0E8] text-[10px] leading-relaxed line-clamp-4 mb-3">
                                            {analysis.reasoning || 'Looks great!'}
                                        </p>
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setPublishingAnalysisId(analysis.id); }}
                                          className="w-full mt-auto py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#D4AF37] border border-[#D4AF37]/50 rounded-lg text-[10px] font-bold transition-colors shadow-lg shadow-[#D4AF37]/10"
                                        >
                                          {tResult("publish_community")}
                                        </button>
                                    </div>
                                </div>
                            )})}
                        </div>
                    )}
                </div>
            )}
        </div>

      </main>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0A0A] border border-[#ffffff]/10 rounded-3xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
            <div className="p-6 border-b border-[#ffffff]/5">
              <h3 className="text-lg font-serif text-[#F5F0E8]">{t("edit_profile")}</h3>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full bg-[#1a1a1a] border border-[#D4AF37]/30 flex items-center justify-center overflow-hidden relative group shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                  {avatarFile ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full object-cover" />
                  ) : userProfile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-[#D4AF37]" />
                  )}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-xs font-medium text-white backdrop-blur-sm">
                    {t("edit_avatar")}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => { if(e.target.files?.[0]) setAvatarFile(e.target.files[0]) }} />
                  </label>
                </div>
                <span className="text-xs text-[#C8C8C8]">{t("edit_avatar")}</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5 uppercase tracking-wider">{t("edit_name")}</label>
                  <input type="text" value={editForm.full_name} onChange={e => setEditForm(p => ({...p, full_name: e.target.value}))} className="w-full bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-xl px-4 py-3 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all placeholder:text-[#ffffff]/20" placeholder={t("edit_name")} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5 uppercase tracking-wider">{t("edit_username")}</label>
                  <input type="text" value={editForm.username} onChange={e => setEditForm(p => ({...p, username: e.target.value}))} className="w-full bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-xl px-4 py-3 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all placeholder:text-[#ffffff]/20" placeholder={t("edit_username")} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5 uppercase tracking-wider">{t("edit_vibe")}</label>
                  <input type="text" placeholder="e.g. Minimalist, Opium..." value={editForm.vibe} onChange={e => setEditForm(p => ({...p, vibe: e.target.value}))} className="w-full bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-xl px-4 py-3 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all placeholder:text-[#ffffff]/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5 uppercase tracking-wider">{t("edit_country")}</label>
                    <input type="text" value={editForm.country} onChange={e => setEditForm(p => ({...p, country: e.target.value}))} className="w-full bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-xl px-4 py-3 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all placeholder:text-[#ffffff]/20" placeholder="e.g. Turkey" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5 uppercase tracking-wider">{t("edit_city")}</label>
                    <input type="text" value={editForm.city} onChange={e => setEditForm(p => ({...p, city: e.target.value}))} className="w-full bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-xl px-4 py-3 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all placeholder:text-[#ffffff]/20" placeholder="e.g. Istanbul" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5 uppercase tracking-wider">{t("edit_district")}</label>
                  <input type="text" value={editForm.district} onChange={e => setEditForm(p => ({...p, district: e.target.value}))} className="w-full bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-xl px-4 py-3 text-[#F5F0E8] focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all placeholder:text-[#ffffff]/20" placeholder="e.g. Kadıköy" />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-[#ffffff]/5 flex gap-3 bg-[#000000]/20">
              <button disabled={isSaving} onClick={() => setIsEditing(false)} className="flex-1 py-3 px-4 rounded-xl border border-[#ffffff]/10 text-[#C8C8C8] hover:bg-[#ffffff]/5 hover:text-white transition-colors text-sm font-medium disabled:opacity-50">
                {t("cancel")}
              </button>
              <button disabled={isSaving} onClick={handleSaveProfile} className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black hover:opacity-90 transition-opacity text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20">
                {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : null}
                {isSaving ? t("uploading") : t("save_changes")}
              </button>
            </div>
          </div>
        </div>
      )}

      {publishingAnalysisId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-3xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl relative">
            {/* Glow effect */}
            <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-[#D4AF37]/20 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="p-6 border-b border-white/5 relative z-10">
              <h3 className="text-xl font-serif text-[#F5F0E8] flex items-center gap-2">
                <Sparkles className="text-[#D4AF37]" size={20} />
                {tResult("hit_runway")}
              </h3>
              <p className="text-xs text-[#C8C8C8] mt-2">{tResult("hit_runway_desc")}</p>
            </div>
            
            <div className="p-6 space-y-4 relative z-10">
              <label className="block text-xs font-bold text-[#D4AF37] mb-3 uppercase tracking-widest text-center">{tResult("select_category")}</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'streetwear', label: tResult("cat_streetwear") },
                  { id: 'formal', label: tResult("cat_formal") },
                  { id: 'casual', label: tResult("cat_casual") },
                  { id: 'date_night', label: tResult("cat_date_night") },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setPublishCategory(cat.id)}
                    className={`py-4 px-2 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center ${publishCategory === cat.id ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105' : 'bg-white/5 border-white/10 text-[#C8C8C8] hover:bg-white/10 hover:border-white/20'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-white/5 flex gap-3 bg-[#0a0a0a]/90 relative z-10">
              <button disabled={isPublishing} onClick={() => setPublishingAnalysisId(null)} className="flex-1 py-3.5 rounded-xl border border-white/10 text-[#C8C8C8] text-sm hover:bg-white/5 transition-colors font-semibold">
                İptal
              </button>
              <button disabled={isPublishing} onClick={handlePublish} className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-extrabold text-sm hover:opacity-90 flex justify-center items-center shadow-lg shadow-[#D4AF37]/20 transition-all">
                {isPublishing ? <LoaderCircle size={18} className="animate-spin" /> : 'Gönder ve Paylaş'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-3xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl relative max-h-[90vh]">
              <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-[#D4AF37]/20 blur-[50px] rounded-full pointer-events-none" />
              
              <div className="p-6 border-b border-white/5 relative z-10 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md">
                <h3 className="text-xl font-serif text-[#F5F0E8] flex items-center gap-2">
                  <Settings className="text-[#D4AF37]" size={20} />
                  {t("settings_title")}
                </h3>
              </div>
              
              <div className="p-6 space-y-6 relative z-10 flex-1 overflow-y-auto hide-scrollbar">
                 {/* Language */}
                 <div className="space-y-3">
                   <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">{t("settings_language")}</h4>
                   <div className="flex gap-2">
                      <button onClick={() => changeLanguage('tr')} className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${locale === 'tr' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/5 border-white/10 text-[#C8C8C8]'}`}>Türkçe</button>
                      <button onClick={() => changeLanguage('en')} className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${locale === 'en' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/5 border-white/10 text-[#C8C8C8]'}`}>English</button>
                   </div>
                 </div>

                 {/* Privacy */}
                 <div className="space-y-3">
                   <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">{t("settings_privacy")}</h4>
                   <div className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${ghostMode ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50' : 'bg-white/5 border-white/10'}`} onClick={() => setGhostMode(!ghostMode)}>
                      <div className="flex-1">
                          <p className={`font-semibold text-sm ${ghostMode ? 'text-[#D4AF37]' : 'text-[#F5F0E8]'}`}>{t("settings_ghost_mode")}</p>
                          <p className="text-[10px] text-[#C8C8C8]/80 mt-1 pr-4">{t("settings_ghost_desc")}</p>
                      </div>
                      <div className={`flex w-12 h-6 rounded-full p-1 transition-colors relative ${ghostMode ? 'bg-[#D4AF37]' : 'bg-white/10'}`}>
                         <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute ${ghostMode ? 'translate-x-[24px]' : 'translate-x-0'}`} />
                      </div>
                   </div>
                 </div>

                 {/* Public Profile */}
                 <div className="space-y-3">
                   <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">{t("settings_public_profile") || "Public Profile"}</h4>
                   <div className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isPublic ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50' : 'bg-white/5 border-white/10'}`} onClick={() => setIsPublic(!isPublic)}>
                      <div className="flex-1">
                          <p className={`font-semibold text-sm ${isPublic ? 'text-[#D4AF37]' : 'text-[#F5F0E8]'}`}>{t("settings_public") || "Herkese Açık Profil"}</p>
                          <p className="text-[10px] text-[#C8C8C8]/80 mt-1 pr-4">{t("settings_public_desc") || "Kombinlerinizin diğer kullanıcılar tarafından görülmesine ve oylanmasına izin verin."}</p>
                      </div>
                      <div className={`flex w-12 h-6 rounded-full p-1 transition-colors relative ${isPublic ? 'bg-[#D4AF37]' : 'bg-white/10'}`}>
                         <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute ${isPublic ? 'translate-x-[24px]' : 'translate-x-0'}`} />
                      </div>
                   </div>
                 </div>

                 {/* Fit Preference */}
                 <div className="space-y-3">
                   <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">{t("settings_fit")}</h4>
                   <div className="grid grid-cols-1 gap-2">
                       {[
                         { id: 'slim', label: t("fit_slim") },
                         { id: 'regular', label: t("fit_regular") },
                         { id: 'oversized', label: t("fit_oversized") }
                       ].map(fit => (
                          <button key={fit.id} onClick={() => setFitPref(fit.id)} className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left ${fitPref === fit.id ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/5 border-white/10 text-[#C8C8C8]'}`}>
                             {fit.label}
                          </button>
                       ))}
                   </div>
                 </div>
                 
                 {/* Logout */}
                 <div className="pt-4 border-t border-white/5">
                    <button onClick={handleLogout} className="w-full py-4 rounded-xl bg-[#ff4b4b]/10 border border-[#ff4b4b]/30 text-[#ff4b4b] hover:bg-[#ff4b4b]/20 transition-colors flex items-center justify-center gap-2 font-bold text-sm">
                       <LogOut size={18} />
                       {t("logout")}
                    </button>
                 </div>
              </div>
              
              <div className="p-6 border-t border-white/5 flex gap-3 relative z-10 bg-black/40 sticky bottom-0">
                 <button onClick={() => setShowSettings(false)} className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-[#C8C8C8] hover:bg-white/5 transition-colors text-sm font-medium">
                   {t("cancel")}
                 </button>
                 <button onClick={saveSettings} className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black hover:opacity-90 font-bold text-sm shadow-[#D4AF37]/20 shadow-lg">
                   {t("settings_save")}
                 </button>
              </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
