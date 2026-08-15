'use client';

import { TrendingUp, PiggyBank, ShieldCheck, Wallet, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function HeroVectorIllustration() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 flex flex-col justify-between overflow-hidden shadow-2xl group">
      {/* Background Soft Radial Glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />

      {/* Top Header Mockup */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Wallet className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-200 block">FinVerse Dashboard</span>
            <span className="text-[10px] text-slate-400 font-mono">Monthly Budget Summary</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>

      {/* Center Main Vector Stats Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-3 my-2">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Income</span>
          <span className="text-lg font-black text-emerald-400 font-mono">₹1,50,000</span>
          <span className="text-[10px] text-emerald-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +12% from last mo
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Spent</span>
          <span className="text-lg font-black text-cyan-400 font-mono">₹68,450</span>
          <span className="text-[10px] text-cyan-400">45% of budget used</span>
        </div>
      </div>

      {/* Vector Bar Chart Illustration */}
      <div className="relative z-10 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span>Category Utilization</span>
          <span className="text-emerald-400 font-mono">Target: 80%</span>
        </div>

        {/* Vector SVG Chart Bars */}
        <div className="flex items-end justify-between gap-3 h-20 pt-2 px-2">
          {[
            { label: 'Food', height: '65%', color: 'from-emerald-500 to-teal-400' },
            { label: 'Rent', height: '85%', color: 'from-cyan-500 to-blue-400' },
            { label: 'Travel', height: '40%', color: 'from-emerald-400 to-cyan-400' },
            { label: 'Util', height: '50%', color: 'from-indigo-500 to-purple-400' },
            { label: 'Sav', height: '90%', color: 'from-teal-400 to-emerald-500' }
          ].map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group/bar">
              <div 
                className={`w-full rounded-t-md bg-gradient-to-t ${bar.color} transition-all duration-500 group-hover/bar:brightness-125 shadow-md`}
                style={{ height: bar.height }}
              />
              <span className="text-[9px] font-medium text-slate-400">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Pill Banner */}
      <div className="relative z-10 flex items-center justify-between pt-2 text-[10px] text-slate-400 border-t border-slate-800/60">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Auto Categorized
        </span>
        <span className="font-mono text-cyan-400">https://fin.versetile.in</span>
      </div>
    </div>
  );
}
