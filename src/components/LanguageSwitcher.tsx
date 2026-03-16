"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Safely replace the locale prefix only at the beginning of the pathname
    const regex = new RegExp(`^/${locale}(/|$)`);
    const newPath = pathname.replace(regex, `/${newLocale}$1`);
    
    // Fallback if we're at the root or unexpected path
    if (newPath === pathname) {
       router.push(`/${newLocale}${pathname.startsWith('/') ? pathname : '/' + pathname}`);
    } else {
       router.push(newPath);
    }
  };

  return (
    <div className="flex bg-[#ffffff]/10 backdrop-blur-md rounded-full border border-[#ffffff]/20 overflow-hidden text-xs">
      <button 
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1.5 transition-colors ${locale === 'en' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-[#C8C8C8] hover:text-[#F5F0E8]'}`}
      >
        EN
      </button>
      <button 
        onClick={() => handleLanguageChange('tr')}
        className={`px-3 py-1.5 transition-colors ${locale === 'tr' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-[#C8C8C8] hover:text-[#F5F0E8]'}`}
      >
        TR
      </button>
    </div>
  );
}
