'use client';

import Logo from './logo';
import { ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full flex-shrink-0 border-t border-border/40 bg-background/50 backdrop-blur-md py-6 px-4 md:px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Logo className="w-6 h-6 shrink-0" />
          <span>&copy; {new Date().getFullYear()} FinVerse Quantum Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5" /> Firebase Cloud Sync
          </span>
          <span className="flex items-center gap-1 text-cyan-400 font-medium">
            <Zap className="h-3.5 w-3.5" /> End-to-End Encryption
          </span>
        </div>
      </div>
    </footer>
  );
}
