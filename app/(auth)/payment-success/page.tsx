"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6 shadow-2xl border-green-500/20">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Payment Received!
          </h1>
          <p className="text-foreground/70">
            Thank you for paying your membership due. Your transaction ID has
            been recorded.
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg flex items-start gap-3 text-left">
          <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-sm">Pending Confirmation</p>
            <p className="text-xs text-foreground/60">
              An admin will review your payment and activate your membership
              shortly. This usually takes 1-2 hours.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Link href="/">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
