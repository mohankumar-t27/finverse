'use client';

import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { Button } from './ui/button';
import { useAuth } from '@/firebase';
import { Loader2, ShieldCheck, BarChart3, Zap } from 'lucide-react';
import { BackgroundGradientAnimation } from './ui/background-gradient';
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useEffect, useState } from 'react';
import Logo from './logo';

const taglines = [
  "Track and manage your monthly expenses with ease",
  "Your monthly spending, simplified.",
  "Track smart. Spend better.",
  "Money clarity, every month.",
  "Manage your money, month by month.",
  "Know where your money goes."
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
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Glass Card Container */}
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-slate-950/80 backdrop-blur-2xl shadow-2xl p-8 sm:p-10 text-center">
            {/* Glow backdrop inside card */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />

            {/* Brand Logo & Header */}
            <div className="flex flex-col items-center justify-center mb-6">
              <Logo size="xl" showText={false} />
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-emerald-400 mt-4">
                FinVerse
              </h1>
              <span className="text-[11px] font-bold tracking-widest text-cyan-400/90 uppercase mt-1">
                Quantum Intelligence Platform
              </span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-8 h-12 flex items-center justify-center font-medium">
              "{tagline}"
            </p>

            {/* Google Sign-in Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 border border-cyan-400/30 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </Button>

            {/* Feature Badges */}
            <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-white/10 text-[11px] text-muted-foreground font-medium">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Encrypted</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <BarChart3 className="h-4 w-4 text-cyan-400" />
                <span>Real-Time</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Instant Sync</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
