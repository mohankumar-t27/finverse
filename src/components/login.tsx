'use client';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from './ui/button';
import { useAuth } from '@/firebase';
import { IndianRupee } from 'lucide-react';
import { BackgroundGradientAnimation } from './ui/background-gradient';

export default function Login() {
  const { auth } = useAuth();

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google: ', error);
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
                                MokiSpends
                            </h1>
                        </div>
                        <p className="text-muted-foreground mb-8 text-base">
                            Track and manage your monthly expenses with ease.
                        </p>
                        <Button onClick={handleGoogleSignIn} className="w-full">
                            Sign in with Google
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </BackgroundGradientAnimation>
  );
}
