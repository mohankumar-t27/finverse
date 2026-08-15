import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Logo from '@/components/logo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6 text-center">
      <div className="max-w-md w-full space-y-6 flex flex-col items-center">
        <div className="flex items-center gap-3">
          <Logo className="w-12 h-12 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-emerald-400">
              FinVerse
            </span>
            <span className="font-semibold text-[10px] tracking-wider text-cyan-400/80 uppercase -mt-1">
              Quantum Intelligence Platform
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl w-full space-y-4">
          <div className="p-3 rounded-full bg-rose-500/10 text-rose-500 w-fit mx-auto">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
          <p className="text-xs text-slate-400">
            The page or financial portal route you requested could not be located on FinVerse Quantum Network.
          </p>

          <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">
            <Link href="/" className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Return to FinVerse Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
