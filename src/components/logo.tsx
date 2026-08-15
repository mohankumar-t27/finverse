'use client';

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className, showText = false, size = 'md' }: LogoProps) {
  const sizeMap = {
    sm: { container: 'h-8 w-8', text: 'text-lg', subtext: 'text-[9px]' },
    md: { container: 'h-10 w-10', text: 'text-xl', subtext: 'text-[10px]' },
    lg: { container: 'h-12 w-12', text: 'text-2xl', subtext: 'text-[11px]' },
    xl: { container: 'h-16 w-16', text: 'text-3xl', subtext: 'text-[12px]' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      <div className={cn("relative flex items-center justify-center rounded-2xl p-1 transition-all duration-300 group-hover:scale-105 shrink-0", currentSize.container, className)}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/30 via-emerald-500/30 to-indigo-500/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glass Card Container */}
        <div className="relative z-10 w-full h-full rounded-xl overflow-hidden border border-white/20 shadow-xl bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-1">
          {/* Native Vector SVG Logo Icon */}
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full transform transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110"
          >
            <defs>
              <linearGradient id="finGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="finGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Hexagon Shield */}
            <path
              d="M50 8 L85 28 L85 72 L50 92 L15 72 L15 28 Z"
              fill="#090d16"
              stroke="url(#finGradient1)"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Tech Grid Pattern Lines */}
            <path d="M50 8 V92" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
            <path d="M15 28 L85 72" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
            <path d="M15 72 L85 28" stroke="white" strokeOpacity="0.06" strokeWidth="1" />

            {/* Left Bar */}
            <rect x="30" y="48" width="10" height="26" rx="3" fill="url(#finGradient1)" />
            
            {/* Center Bar */}
            <rect x="45" y="36" width="10" height="38" rx="3" fill="url(#finGradient2)" />

            {/* Right Bar */}
            <rect x="60" y="24" width="10" height="50" rx="3" fill="url(#finGradient1)" />

            {/* Dynamic Upward Trendline & Arrowhead */}
            <path
              d="M26 62 L42 46 L56 54 L76 28"
              stroke="#38bdf8"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#neonGlow)"
            />
            
            {/* Arrowhead */}
            <path
              d="M66 28 H76 V38"
              stroke="#38bdf8"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glowing Accent Core Node */}
            <circle cx="76" cy="28" r="4" fill="#a7f3d0" filter="url(#neonGlow)" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-emerald-400", currentSize.text)}>
            FinVerse
          </span>
          <span className={cn("font-semibold tracking-wider text-cyan-400/80 uppercase -mt-1", currentSize.subtext)}>
            Quantum Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
