"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useInitiatePaymentMutation } from "@/redux/features/payment/paymentApi";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { CreditCard, Wallet, CheckCircle2, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------- types ---------------- */
type PaymentPurpose = "MEMBERSHIP_FEE" | "MONTHLY_DONATION";

export enum PaymentMethod {
  STRIPE = "STRIPE",
  SSLCOMMERZ = "SSLCOMMERZ",
}

const PURPOSES = [
  {
    id: "MEMBERSHIP_FEE",
    label: "Foundation Membership",
    description: "One-time registration fee to become a verified member.",
    amount: 1000,
    icon: ShieldCheck,
  },
  {
    id: "MONTHLY_DONATION",
    label: "Monthly Contribution",
    description: "Support recurring foundation projects and initiatives.",
    amount: 1500,
    icon: Sparkles,
  },
];

export default function PaymentPage() {
  const [initiatePayment, { isLoading }] = useInitiatePaymentMutation();
  const [selectedPurpose, setSelectedPurpose] = useState(PURPOSES[0]);
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.STRIPE);

  /* ---------------- handlers ---------------- */

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Initializing secure transaction...");

    try {
      const payload = {
        amount: selectedPurpose.amount,
        method: method,
        purpose: selectedPurpose.id,
      };

      const response = await initiatePayment(payload).unwrap();
      const gatewayUrl = response?.data?.gatewayUrl;

      if (gatewayUrl) {
        toast.success("Redirecting to secure gateway...", { id: toastId });
        window.location.href = gatewayUrl;
        return;
      }

      toast.success("Protocol recorded. Awaiting confirmation.", { id: toastId });
    } catch (err: any) {
      toast.error(err?.data?.message || "Transaction Protocol Violation", { id: toastId });
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <AFPageHeader
        title="Fiscal Settlement"
        description="Verify your foundation commitment through our encrypted gateway infrastructure."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60 ml-1">
              Select Commitment Level
            </h3>
            <div className="grid gap-4">
              {PURPOSES.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPurpose(p)}
                  className={cn(
                    "relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 overflow-hidden group",
                    selectedPurpose.id === p.id
                      ? "bg-primary border-transparent shadow-2xl shadow-primary/30 scale-[1.02]"
                      : "bg-card/40 border-muted/20 hover:border-primary/40 hover:bg-primary/5"
                  )}
                >
                  {/* Decorative Glow */}
                  <div className={cn(
                    "absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl transition-opacity duration-1000",
                    selectedPurpose.id === p.id ? "bg-white/20 opacity-100" : "bg-primary/5 opacity-0 group-hover:opacity-100"
                  )} />

                  <div className="relative flex items-center gap-6">
                    <div className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors duration-500",
                      selectedPurpose.id === p.id ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                    )}>
                      <p.icon size={28} />
                    </div>
                    <div className="flex-1">
                      <h4 className={cn(
                        "font-black text-xl tracking-tight transition-colors duration-500",
                        selectedPurpose.id === p.id ? "text-white" : "text-foreground"
                      )}>
                        {p.label}
                      </h4>
                      <p className={cn(
                        "text-xs font-medium leading-relaxed transition-colors duration-500",
                        selectedPurpose.id === p.id ? "text-white/70" : "text-muted-foreground"
                      )}>
                        {p.description}
                      </p>
                    </div>
                    <div className={cn(
                      "text-right transition-colors duration-500",
                      selectedPurpose.id === p.id ? "text-white" : "text-primary"
                    )}>
                      <span className="text-[10px] font-black uppercase block opacity-60">Amount</span>
                      <span className="text-2xl font-black">৳{p.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60 ml-1">
              Gateway Infrastructure
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMethod(PaymentMethod.STRIPE)}
                className={cn(
                  "p-8 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all duration-500",
                  method === PaymentMethod.STRIPE
                    ? "bg-blue-600 border-transparent shadow-xl shadow-blue-600/20 text-white scale-[1.02]"
                    : "bg-card/40 border-muted/20 hover:border-blue-500/40 hover:bg-blue-500/5 text-muted-foreground"
                )}
              >
                <CreditCard size={32} />
                <span className="font-black text-xs uppercase tracking-[0.2em]">Stripe Global</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod(PaymentMethod.SSLCOMMERZ)}
                className={cn(
                  "p-8 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all duration-500",
                  method === PaymentMethod.SSLCOMMERZ
                    ? "bg-indigo-600 border-transparent shadow-xl shadow-indigo-600/20 text-white scale-[1.02]"
                    : "bg-card/40 border-muted/20 hover:border-indigo-500/40 hover:bg-indigo-500/5 text-muted-foreground"
                )}
              >
                <Wallet size={32} />
                <span className="font-black text-xs uppercase tracking-[0.2em]">SSLCommerz</span>
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <Card className="sticky top-24 border-none shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl border border-muted/20">
            <div className="p-8 bg-primary/5 border-b border-muted/20">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Transaction Summary</h4>
               <p className="text-xs text-muted-foreground font-bold leading-tight">Review your settlement details before proceeding to the encrypted gateway.</p>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-muted-foreground">Allocation</span>
                  <span className="text-foreground">{selectedPurpose.label}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-muted-foreground">Security Protocol</span>
                  <span className="text-foreground">{method === PaymentMethod.STRIPE ? "Stripe AES-256" : "SSLCommerz 3D"}</span>
                </div>
                <div className="h-px bg-muted/30" />
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Net Settlement</span>
                  <span className="text-4xl font-black text-primary tracking-tighter">৳{selectedPurpose.amount}</span>
                </div>
              </div>

              <Button
                onClick={submit}
                disabled={isLoading}
                className="w-full h-16 rounded-2xl bg-primary hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/30 transition-all font-black uppercase text-xs tracking-[0.2em]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    Authorize Payment
                    <CheckCircle2 className="ml-3 h-5 w-5" />
                  </>
                )}
              </Button>
              
              <p className="text-[9px] text-center text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
                By authorizing this transaction, you agree to our foundation's fiscal transparency protocols and charter.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
