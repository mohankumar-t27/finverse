'use client';

import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { Button } from './ui/button';
import { useAuth } from '@/firebase';
import { IndianRupee, Loader2 } from 'lucide-react';
import { BackgroundGradientAnimation } from './ui/background-gradient';
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useEffect, useState } from 'react';

export default function Login() {
  const { auth, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!auth) return;

    setIsRedirecting(true);
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User has been redirected back from the sign-in page.
          // The useAuth hook will handle the user state update.
        }
      })
      .catch((error) => {
        console.error('Error getting redirect result: ', error);
        toast({
            title: 'Sign-in Error',
            description: 'An unexpected error occurred during sign-in. Please try again.',
            variant: 'destructive',
        });
      })
      .finally(() => {
        setIsRedirecting(false);
      });
  }, [auth, toast]);


  const handleGoogleSignIn = async () => {
    if (!auth || authLoading || isRedirecting) return;
    
    const provider = new GoogleAuthProvider();
    
    try {
      if (isMobile) {
        setIsRedirecting(true);
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      setIsRedirecting(false);
      const errorCode = (error as any).code;
      if (errorCode === 'auth/cancelled-popup-request' || errorCode === 'auth/popup-closed-by-user') {
        // This is a normal user action, so we don't need to show a toast.
        return; 
      } else {
        console.error('Error signing in with Google: ', error);
        toast({
            title: 'Sign-in Error',
            description: 'An unexpected error occurred during sign-in. Please try again.',
            variant: 'destructive',
        });
      }
    }
  };

  const isLoading = authLoading || isRedirecting;

  return (
    <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
            <div className="pointer-events-auto">
                 <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="glass p-8 rounded-lg shadow-lg text-center max-w-md w-full border">
                        <div className="flex justify-center items-center mb-6">
                            <IndianRupee className="h-10 w-10 text-primary" />
                            <h1 className="text-3xl font-bold tracking-tight text-foreground ml-2">
                                ExpenseWise
                            </h1>
                        </div>
                        <p className="text-muted-foreground mb-8 text-base">
                            Track and manage your monthly expenses with ease.
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
