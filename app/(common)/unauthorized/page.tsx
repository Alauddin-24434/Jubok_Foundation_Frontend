"use client";

//==================================================================================
//                               UNAUTHORIZED ACCESS PAGE
//==================================================================================
// Description: Security barrier page shown when a user lacks required permissions.
// Features: Animated warning, redirection options, and security tips.
//==================================================================================

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden rounded-[2.5rem] bg-background/80 backdrop-blur-xl">
        <div className="relative p-8 sm:p-16 flex flex-col items-center text-center gap-8">
          
          {/* Animated Background Element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500/10 blur-[100px] rounded-full" />
          
          {/* Main Visual Indicator */}
          <div className="relative">
            <div className="h-24 w-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center ring-4 ring-white shadow-2xl animate-pulse">
              <ShieldAlert className="h-12 w-12 text-red-600" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-background p-1.5 rounded-xl shadow-lg border border-red-100">
               <Lock className="h-5 w-5 text-red-600" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 relative">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter decoration-red-500/30 underline-offset-8">
              Access Restricted
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-md mx-auto font-medium text-lg">
              Security Protocol: Your current account level does not have clearance for this sector. 
            </p>
          </div>

          {/* Detailed Info Card */}
          <div className="w-full bg-muted/30 p-6 rounded-3xl border border-muted flex gap-4 text-left">
            <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
               <Info size={20} />
            </div>
            <div className="space-y-1">
               <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Security Note</h4>
               <p className="text-xs text-muted-foreground leading-relaxed italic">
                 If you believe this is a mistake, please contact the System Administrator to request elevated privileges (SUPER_ADMIN status).
               </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full h-14 rounded-2xl font-black shadow-xl shadow-primary/20 scale-100 hover:scale-[1.03] active:scale-95 transition-all text-base bg-primary">
                Return to Command Center
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full h-14 rounded-2xl font-black border-2 transition-all hover:bg-muted text-base">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <p className="mt-12 text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground opacity-40">
        Ecryption ID: AF-RESTRICTED-403-PRTCL
      </p>
    </div>
  );
}
