'use client';

import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { Button } from './ui/button';
import { useAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';
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
  const { auth, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [tagline, setTagline] = useState('');

  useEffect(() => {
    setTagline(taglines[Math.floor(Math.random() * taglines.length)]);
  }, []);

  useEffect(() => {
    // When returning from a redirect, authLoading will be true until the user state is determined.
    // We can use this to show a loading indicator.
    if (!authLoading && auth) {
      getRedirectResult(auth).catch((error) => {
        // Handle any errors from the redirect result, though auth state is our source of truth.
        console.error('Error from getRedirectResult:', error);
      });
    }
  }, [authLoading, auth]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    
    try {
      if (isMobile) {
        await signInWithRedirect(auth, provider);
        // The page will redirect, so isSigningIn will be reset on page load.
      } else {
        await signInWithPopup(auth, provider);
        setIsSigningIn(false);
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
      setIsSigningIn(false);
    }
  };
  
  // The main loading state now considers both the initial auth check and any sign-in process.
  const isLoading = authLoading || isSigningIn;

  // Render nothing if the user is already authenticated
  if (user) {
    return null;
  }

  return (
    <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
            <div className="pointer-events-auto">
                 <div className="glass p-8 rounded-lg shadow-lg text-center w-full max-w-sm border">
                    <div className="flex justify-center items-center mb-6">
                        <Logo className="h-10 w-10" />
                        <h1 className="text-3xl font-bold tracking-tight text-foreground ml-2">
                            FinVerse
                        </h1>
                    </div>
                    <p className="text-muted-foreground mb-8 text-base h-12 flex items-center justify-center">
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
    </BackgroundGradientAnimation>
  );
}
