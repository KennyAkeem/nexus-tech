"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-[9999]">
      <div className="flex flex-col items-center space-y-4">
        {/* Replace text with your logo image */}
        <Image
          src="/logo.png"
          alt="StarSpaceTechnology Logo"
          width={180}
          height={60}
          className="object-contain animate-fade"
        />

        <div className="w-20 h-1.5 bg-white/40 rounded overflow-hidden">
          <div className="h-full w-1/2 bg-white animate-[load_1.2s_linear_infinite]" />
        </div>
      </div>

      {/* Inline keyframes for the loading bar and fade animation */}
      <style jsx>{`
        @keyframes load {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        @keyframes fade {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
          }
        }
        .animate-fade {
          animation: fade 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
