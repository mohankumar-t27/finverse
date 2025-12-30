'use client';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from './ui/button';
import { useAuth } from '@/firebase';
import { IndianRupee } from 'lucide-react';
import { BackgroundGradientAnimation } from './ui/background-gradient';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const { auth, loading } = useAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    if (!auth || loading) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const errorCode = (error as any).code;
      if (errorCode === 'auth/cancelled-popup-request' || errorCode === 'auth/popup-closed-by-user') {
        // This is a normal user action, so we don't need to show a toast.
        // The user intentionally closed the popup.
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
                        <Button onClick={handleGoogleSignIn} className="w-full" disabled={loading}>
                            {loading ? 'Initializing...' : 'Sign in with Google'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </BackgroundGradientAnimation>
  );
}
