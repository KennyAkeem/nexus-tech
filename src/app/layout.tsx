import "./globals.css";
import { Inter } from "next/font/google";
// Import ClientProviders directly (do NOT dynamic() with ssr:false) so providers mount earlier
import ClientProviders from "@/components/ClientProviders/ClientProviders";
import ConditionalLayout from "@/components/Layout/ConditionalLayout";
import SimulatedAlertBubble from "@/components/SimulatedAlertBubble";
import BackToTop from "@/components/BackToTop";
import Preloader from "@/components/Preloader";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nexus Tech",
  description: "Nexus Tech — Crypto trading and investments",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-darkmode text-white overflow-x-hidden`}>
        <Preloader />
        {/* ConditionalLayout will render Header/Footer except on routes we hide (e.g., /profile) */}
        {/* ClientProviders is a client component that mounts Toast + Preloader providers */}
        <ConditionalLayout>
          <ClientProviders>{children}</ClientProviders>
        </ConditionalLayout>
         <BackToTop />
        <SimulatedAlertBubble />
      </body>
    </html>
  );
}