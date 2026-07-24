import React from 'react';
import Navbar from "@/components/layout/Navbar";
import { TrustBanner } from "@/components/ui/TrustBanner";
import Footer from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-brand-white">
      <Navbar />
      <TrustBanner />
      <main className="flex-grow">{children}</main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
