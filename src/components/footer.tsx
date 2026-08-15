'use client';

import Logo from './logo';
import { ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full flex-shrink-0 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6 px-4 md:px-6 mt-auto relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Logo className="w-5 h-5 shrink-0" />
          <span>&copy; {new Date().getFullYear()} Versetile Technologies Pvt Ltd. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-[11px] font-medium">
          <a 
            href="https://versetile.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            Versetile Main Site <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Firebase Cloud Sync
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <Zap className="h-3.5 w-3.5" /> End-to-End Encryption
          </span>
        </div>
      </div>
    </footer>
  );
}
