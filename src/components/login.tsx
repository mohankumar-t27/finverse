'use client';

import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { Button } from './ui/button';
import { useAuth } from '@/firebase';
import { Loader2, ShieldCheck, Zap, TrendingUp, Sparkles, Lock, PieChart, ArrowRight, BarChart3, Layers, DollarSign, PiggyBank, ExternalLink, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useEffect, useState } from 'react';
import Logo from './logo';
import HeroVectorIllustration from './hero-vector-illustration';

const taglines = [
  "Track and manage your monthly expenses with ease.",
  "Your monthly spending, simplified with intelligent analytics.",
  "Track smart. Spend better. Grow faster.",
  "Money clarity and budget security, month by month.",
  "Know exactly where every rupee goes in real time."
];

const features = [
  {
    icon: TrendingUp,
    title: "Real-Time Tracking",
    description: "Instant category spending monitoring with live budget utilization metrics.",
    color: "from-cyan-500 to-blue-600"
  },
  {
    icon: ShieldCheck,
    title: "Budget Cap Shield",
    description: "Proactive warnings when expenses exceed pre-set threshold limits.",
    color: "from-emerald-500 to-teal-600"
  },
  {
    icon: Layers,
    title: "Multi-Month Copy",
    description: "One-click rollover of previous month budgets to eliminate setup friction.",
    color: "from-purple-500 to-indigo-600"
  },
  {
    icon: Lock,
    title: "Privacy Masking",
    description: "Mask sensitive financial figures with instant blur toggles for safe browsing.",
    color: "from-amber-500 to-orange-600"
  }
];

const stats = [
  { value: "₹50M+", label: "Monthly Flow Tracked" },
  { value: "99.9%", label: "Cloud Sync Uptime" },
  { value: "< 50ms", label: "Instant Data Updates" }
];

export default function Login() {
  const { auth } = useAuth();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [tagline, setTagline] = useState('');

  useEffect(() => {
    setTagline(taglines[Math.floor(Math.random() * taglines.length)]);
  }, []);

  const handleGoogleSignIn = async () => {
    if (!auth) {
      toast({
        title: 'Authentication Error',
        description: 'Authentication service is not available. Please try again later.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    
    try {
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      const errorCode = (error as any).code;
      if (errorCode !== 'auth/cancelled-popup-request' && errorCode !== 'auth/popup-closed-by-user') {
        console.error('[Login] Error signing in with Google: ', error);
        toast({
          title: 'Sign-in Error',
          description: (error as any).message || 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
      setIsSigningIn(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-x-hidden selection:bg-emerald-500/30">
      {/* Background Soft Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[160px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      </div>

      {/* Header Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <a href="https://fin.versetile.in" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <Logo className="w-10 h-10 shrink-0" />
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-emerald-400">
              FinVerse
            </span>
            <span className="font-semibold text-[11px] tracking-wider text-cyan-400/80 uppercase -mt-1">
              QUANTUM INTELLIGENCE PLATFORM
            </span>
          </div>
        </a>

        <div className="flex items-center gap-4">
          <a 
            href="https://versetile.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
          >
            <Globe className="h-3.5 w-3.5" />
            Versetile Ecosystem
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
          <Button 
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/20 border border-emerald-400/30 rounded-xl px-5 transition-all duration-300 hover:scale-105"
          >
            {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 pt-4 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline & Action */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold w-fit">
            <PiggyBank className="h-4 w-4 text-emerald-400" />
            Versetile Product Showcase &bull; https://fin.versetile.in
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Master Your Money with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                FinVerse Intelligence
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              {tagline} Experience clean monthly budget tracking, smart category charts, and privacy-shielded financial insights.
            </p>
          </div>

          {/* Login Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5 max-w-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-300">Sign in to FinVerse Portal</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure Google Auth
              </span>
            </div>

            <Button 
              onClick={handleGoogleSignIn} 
              disabled={isSigningIn}
              size="lg"
              className="w-full h-12 bg-white hover:bg-slate-100 text-slate-900 font-bold text-base shadow-xl rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-slate-900" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Product by Versetile</span>
              <a href="https://versetile.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                versetile.in <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/60 max-w-lg">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-xl font-black text-emerald-400 font-mono">{stat.value}</span>
                <span className="text-xs text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Crisp React Vector Illustration Component */}
        <div className="lg:col-span-6 relative">
          <HeroVectorIllustration />

          {/* Feature Highlights Grid below Illustration */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 hover:border-emerald-500/30 transition-colors">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Crisp Analytics</h4>
                <p className="text-[11px] text-slate-400">Budget vs Actual charts</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 hover:border-cyan-500/30 transition-colors">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 flex-shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Budget Cap Shield</h4>
                <p className="text-[11px] text-slate-400">Over-spend protection</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Grid Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold text-emerald-400 tracking-widest uppercase">Core Features</span>
          <h2 className="text-3xl font-extrabold text-white">Built for Complete Financial Control</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index} 
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} p-3 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-full h-full" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 shrink-0" />
            <span>&copy; {new Date().getFullYear()} Versetile Technologies Pvt Ltd. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-slate-400 font-medium">
            <a href="https://versetile.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              Versetile Main Site <ExternalLink className="h-3 w-3" />
            </a>
            <a href="https://fin.versetile.in" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              FinVerse App <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
