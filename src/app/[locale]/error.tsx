"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] text-[#F5F0E8] p-4 text-center">
      <h2 className="text-2xl font-serif mb-4 text-[#D4AF37]">Bir şeyler ters gitti!</h2>
      <p className="text-[#C8C8C8] mb-6">Analiz sırasında beklenmeyen bir ağ hatası oluştu.</p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg font-medium hover:bg-[#B3932F] transition-colors"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
