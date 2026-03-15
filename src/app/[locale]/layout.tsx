import type { Metadata } from "next";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Mirr - Your mirror. Your style. Your truth.",
  description: "AI-Powered Style Intelligence App",
};

export default async function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#000000] text-[#F5F0E8] antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex flex-col min-h-[100dvh] relative max-w-md mx-auto w-full bg-[#0A0A0A] shadow-2xl overflow-x-hidden">
             
             {/* Decorative Elements - strict pointer-events-none and negative z-index */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#D4AF37]/5 to-transparent rounded-bl-full blur-3xl pointer-events-none -z-10" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#C8C8C8]/5 to-transparent rounded-tr-full blur-3xl pointer-events-none -z-10" />
             
             {/* Main Content Area - high z-index to ensure interactivity */}
             <main className="flex-1 overflow-y-auto pb-24 z-20 relative">
                <ToastProvider>
                  {children}
                </ToastProvider>
             </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
