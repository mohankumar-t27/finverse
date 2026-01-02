'use client';

import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, User } from 'firebase/auth';
import { Button } from './ui/button';
import { useAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { BackgroundGradientAnimation } from './ui/background-gradient';
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useEffect, useState, useRef } from 'react';
import Logo from './logo';

const taglines = [
  "Your monthly spending, simplified.",
  "Track smart. Spend better.",
  "Money clarity, every month.",
  "Manage your money, month by month.",
  "Know where your money goes."
];

export default function Login() {
  const { auth, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isProcessingSignIn, setIsProcessingSignIn] = useState(true);
  const redirectCheckRef = useRef(false);
  const [tagline, setTagline] = useState('');

  useEffect(() => {
    setTagline(taglines[Math.floor(Math.random() * taglines.length)]);
  }, []);

  useEffect(() => {
    if (!auth || redirectCheckRef.current) {
      if (!authLoading) {
        setIsProcessingSignIn(false);
      }
      return;
    }

    redirectCheckRef.current = true;
    setIsProcessingSignIn(true);

    getRedirectResult(auth)
      .then((result) => {
        // This block will be entered if the user has been redirected from Google.
        // The `useAuth` hook will handle the user state change automatically if `result` is not null.
        // We just need to manage the loading state.
      })
      .catch((error) => {
        const errorCode = (error as any).code;
        if (errorCode !== 'auth/popup-closed-by-user' && errorCode !== 'auth/cancelled-popup-request') {
          console.error('Error getting redirect result: ', error);
          toast({
            title: 'Sign-in Error',
            description: error.message || 'An unexpected error occurred during sign-in. Please try again.',
            variant: 'destructive',
          });
        }
      })
      .finally(() => {
        setIsProcessingSignIn(false);
      });
  }, [auth, authLoading, toast]);


  const handleGoogleSignIn = async () => {
    if (!auth || authLoading || isProcessingSignIn) return;
    
    const provider = new GoogleAuthProvider();
    
    try {
      setIsProcessingSignIn(true);
      if (isMobile) {
        await signInWithRedirect(auth, provider);
        // Page will redirect, so no need to set processing to false.
      } else {
        await signInWithPopup(auth, provider);
        setIsProcessingSignIn(false);
      }
    } catch (error) {
      const errorCode = (error as any).code;
      if (errorCode !== 'auth/cancelled-popup-request' && errorCode !== 'auth/popup-closed-by-user') {
        console.error('Error signing in with Google: ', error);
        toast({
            title: 'Sign-in Error',
            description: (error as any).message || 'An unexpected error occurred. Please try again.',
            variant: 'destructive',
        });
      }
      setIsProcessingSignIn(false);
    }
  };
  
  const isLoading = authLoading || isProcessingSignIn;

  if (user) {
    return null;
  }

  return (
    <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
            <div className="pointer-events-auto">
                 <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="glass p-8 rounded-lg shadow-lg text-center max-w-md w-full border">
                        <div className="flex justify-center items-center mb-6">
                            <Logo className="h-10 w-10" />
                            <h1 className="text-3xl font-bold tracking-tight text-foreground ml-2">
                                FinVerse
                            </h1>
                        </div>
                        <p className="text-muted-foreground mb-8 text-base">
                            {tagline}
                        </p>
                        <Button onClick={handleGoogleSignIn} className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait...
                                </>
                            ) : 'Sign in with Google'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </BackgroundGradientAnimation>
  );
}
