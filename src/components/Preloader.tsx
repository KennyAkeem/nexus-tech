"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Show loader on initial load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Re-trigger loader on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 700); // shorter delay for page transitions
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-[9999]">
      <div className="flex flex-col items-center space-y-3">
        <h1 className="text-3xl font-bold tracking-wide">NEXUS TECH</h1>
        <div className="w-14 h-1.5 bg-white/40 rounded overflow-hidden">
          <div className="h-full w-1/2 bg-white animate-[load_1.2s_linear_infinite]" />
        </div>
      </div>

      {/* Inline keyframes for the loading bar */}
      <style jsx>{`
        @keyframes load {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}
