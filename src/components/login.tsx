'use client';

import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { Button } from './ui/button';
import { useAuth } from '@/firebase';
import { Loader2, ShieldCheck, Sparkles, ArrowRight, TrendingUp, Lock, Layers, Wallet, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useEffect, useState } from 'react';
import Logo from './logo';

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
    title: "Privacy Shield",
    description: "Mask sensitive financial figures with instant blur toggles for safe browsing.",
    color: "from-amber-500 to-orange-600"
  }
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

  // Handle mobile redirect sign-in result when returning to page
  useEffect(() => {
    if (!auth) return;
    
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          toast({
            title: 'Welcome to FinVerse!',
            description: `Successfully signed in as ${result.user.displayName || result.user.email}`,
          });
        }
      })
      .catch((error: any) => {
        const errorCode = error?.code;
        if (errorCode !== 'auth/popup-closed-by-user' && errorCode !== 'auth/cancelled-popup-request') {
          console.error('[Login] Redirect sign-in error:', error);
          toast({
            title: 'Mobile Sign-in Error',
            description: error?.message || 'Authentication failed. Please try again.',
            variant: 'destructive',
          });
        }
      })
      .finally(() => {
        setIsSigningIn(false);
      });
  }, [auth, toast]);

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
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      // Try popup sign-in first (works on 95%+ mobile browsers)
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      const errorCode = error?.code;
      
      // Ignore user cancellation
      if (errorCode === 'auth/popup-closed-by-user' || errorCode === 'auth/cancelled-popup-request') {
        setIsSigningIn(false);
        return;
      }

      // If popup is blocked or fails on mobile, fall back to redirect
      console.warn('[Login] Popup sign-in issue, attempting redirect fallback:', errorCode);
      try {
        await signInWithRedirect(auth, provider);
      } catch (redirectError: any) {
        console.error('[Login] Redirect initiation error:', redirectError);
        toast({
          title: 'Sign-in Error',
          description: redirectError?.message || 'Could not launch Google Sign-In.',
          variant: 'destructive',
        });
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-x-hidden selection:bg-cyan-500/30">
      {/* Background Soft Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] left-[35%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-center">
            <Logo className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-emerald-400">
              FinVerse
            </span>
            <span className="font-semibold text-[10px] tracking-wider text-cyan-400/80 uppercase -mt-1">
              EXPENSE INTELLIGENCE
            </span>
          </div>
        </div>

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
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 border border-cyan-400/30 rounded-xl px-5 transition-all duration-300 hover:scale-105"
          >
            {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Get Started
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 pt-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Hero Copy & Sign In Card */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold w-fit">
            <Wallet className="h-4 w-4 text-cyan-400" />
            Next-Gen Personal Expense & Budget Management
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Master Your Money with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-emerald-400">
                FinVerse Intelligence
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              "{tagline}" Experience real-time budget tracking, category analytics, and privacy-shielded financial control.
            </p>
          </div>

          {/* Sign In Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-2xl backdrop-blur-2xl space-y-6 max-w-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <Logo className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Sign In to FinVerse</h3>
                  <p className="text-xs text-slate-400">Secure Access to Your Dashboard</p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" /> Auth
              </span>
            </div>

            <Button 
              onClick={handleGoogleSignIn} 
              disabled={isSigningIn}
              size="lg"
              className="w-full h-12 bg-white hover:bg-slate-100 text-slate-950 font-bold text-base shadow-xl rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-slate-950" />
                  <span>Connecting to Google...</span>
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

            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-400 text-center font-medium">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Free Setup
              </div>
              <div className="flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" /> Encrypted
              </div>
              <div className="flex items-center justify-center gap-1">
                <Globe className="h-3.5 w-3.5 text-sky-400" /> Cloud Sync
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Brand Showcase Card */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
          <div className="w-full max-w-lg rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-cyan-500/10 via-slate-900/90 to-emerald-500/10 border border-slate-800/80 shadow-2xl backdrop-blur-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all duration-700" />

            {/* Central Badge featuring Logo */}
            <div className="relative z-10 p-5 rounded-3xl bg-slate-950/90 border border-white/10 shadow-2xl flex flex-col items-center gap-3 transition-transform duration-500 group-hover:scale-105">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20">
                <Logo className="w-16 h-16" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-emerald-400">
                FinVerse
              </span>
            </div>

            <p className="relative z-10 text-sm text-slate-300 max-w-sm leading-relaxed">
              Your personal financial command center. Real-time budget monitoring, category analytics, and effortless expense control.
            </p>

            {/* Feature Pills */}
            <div className="relative z-10 grid grid-cols-2 gap-3 w-full pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-200 block">Real-Time</span>
                  <span className="text-[10px] text-slate-400">Budget Analytics</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-200 block">Privacy Shield</span>
                  <span className="text-[10px] text-slate-400">Blur Mode Toggle</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Grid Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold text-cyan-400 tracking-widest uppercase">Platform Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Built for Complete Financial Control</h2>
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
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEO Promotional & FAQ Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold text-emerald-400 tracking-widest uppercase">Frequently Asked Questions</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Why FinVerse by Versetile?</h2>
          <p className="text-sm text-slate-400">Everything you need to know about tracking personal expenses, setting budget caps, and cloud synchronization.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-cyan-300">How does FinVerse simplify monthly expense management?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              FinVerse gives you an intuitive single-screen control center. You can define monthly category caps, log income and expense entries in seconds, and track spending progress with visual progress indicators and real-time distribution charts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-emerald-300">Is my financial data secure on mobile and web?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes! FinVerse is powered by Firebase Cloud Auth & Firestore Security Rules. Your budget entries and income logs are bound strictly to your authenticated Google account and stored with end-to-end cloud protection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-sky-300">Can I clone or copy previous month budgets?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Absolutely! FinVerse includes a one-click "Copy Previous Month's Budgets" feature. When starting a new month, you can replicate your target spending structure instantly without manually re-entering categories.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-amber-300">Is FinVerse free to use?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              FinVerse is completely free to use as part of the Versetile Product Showcase ecosystem. Access your dashboard across desktop, mobile web, and tablets anytime at <a href="https://fin.versetile.in" className="text-cyan-400 underline font-mono">fin.versetile.in</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
