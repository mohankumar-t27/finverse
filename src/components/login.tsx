'use client';

import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
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

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    
    try {
      if (isMobile) {
        await signInWithRedirect(auth, provider);
        // After this, the page will reload, and FirebaseClientProvider will handle the result.
      } else {
        await signInWithPopup(auth, provider);
      }
      // On success, the useAuth hook will detect the user and this component will unmount.
      // No need to setIsSigningIn(false) for success cases.
    } catch (error) {
      const errorCode = (error as any).code;
      // Don't show an error for user-cancelled popups or redirects.
      if (errorCode !== 'auth/cancelled-popup-request' && errorCode !== 'auth/popup-closed-by-user') {
        console.error('Error signing in with Google: ', error);
        toast({
            title: 'Sign-in Error',
            description: (error as any).message || 'An unexpected error occurred. Please try again.',
            variant: 'destructive',
        });
      }
      // Only set signing in to false if there was an error.
      setIsSigningIn(false);
    }
  };
  
  const isLoading = authLoading || isSigningIn;

  // Render nothing if the user is already authenticated.
  // The parent component will show the dashboard.
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
