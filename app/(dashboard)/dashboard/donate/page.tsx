"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useInitiatePaymentMutation } from "@/redux/features/payment/paymentApi";
import { useGetFundSummaryQuery } from "@/redux/features/fundApi/fundApi";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import {
  DollarSign,
  CreditCard,
  Heart,
  TrendingUp,
  Loader2,
  CheckCircle,
  ArrowRight,
  Wallet,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const SUGGESTED_AMOUNTS = [500, 1000, 2000, 5000, 10000];

export default function MonthlyDonationPage() {
  const [amount, setAmount] = useState<string>("1000");
  const [paymentMethod, setPaymentMethod] = useState<string>("STRIPE");
  const [customAmount, setCustomAmount] = useState<boolean>(false);

  const { data: summary, isLoading: summaryLoading } = useGetFundSummaryQuery();
  const [initiatePayment, { isLoading: processing }] = useInitiatePaymentMutation();

  const handleDonate = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid donation protocol.");
      return;
    }

    const toastId = toast.loading("Authorizing fiscal transmission...");

    try {
      const response = await initiatePayment({
        amount: Number(amount),
        method: paymentMethod as any,
        purpose: "MONTHLY_DONATION",
      }).unwrap();

      const gatewayUrl = response?.data?.gatewayUrl;

      if (gatewayUrl) {
        toast.success("Redirecting to secured gateway...", { id: toastId });
        window.location.href = gatewayUrl;
        return;
      }

      toast.error("Protocol mismatch. Gateway unavailable.", { id: toastId });
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Transaction rejected. Internal service error.",
        { id: toastId }
      );
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <AFPageHeader
        title="Fiscal Contribution Portal"
        description="Support our foundation's high-impact missions through verified monthly fiscal contributions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Amount Selection Area */}
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60 ml-2">Allocation Amount (BDT)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {SUGGESTED_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setAmount(amt.toString());
                    setCustomAmount(false);
                  }}
                  className={cn(
                    "h-16 rounded-2xl font-black text-sm transition-all duration-300 border-2",
                    amount === amt.toString() && !customAmount
                      ? "bg-primary border-transparent text-white shadow-xl shadow-primary/20 scale-105"
                      : "bg-card/40 border-muted/20 hover:border-primary/40 hover:bg-primary/5 text-foreground"
                  )}
                >
                  ৳{amt.toLocaleString()}
                </button>
              ))}
              <button
                onClick={() => setCustomAmount(true)}
                className={cn(
                  "h-16 rounded-2xl font-black text-sm transition-all duration-300 border-2",
                  customAmount
                    ? "bg-primary border-transparent text-white shadow-xl shadow-primary/20 scale-105"
                    : "bg-card/40 border-muted/20 hover:border-primary/40 hover:bg-primary/5 text-foreground"
                )}
              >
                Custom
              </button>
            </div>

            {customAmount && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="relative group">
                   <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-primary font-black">৳</div>
                   <Input
                     type="number"
                     placeholder="Enter custom commitment amount..."
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     className="pl-12 h-16 rounded-3xl bg-card/40 border-muted/30 focus:ring-primary/20 font-black text-lg"
                   />
                </div>
              </div>
            )}
          </section>

          {/* Gateway Infrastructure Area */}
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60 ml-2">Gateway Architecture</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { id: "STRIPE", label: "Stripe Global", desc: "International AES-256 Protocol", icon: CreditCard, color: "blue" },
                { id: "SSLCOMMERZ", label: "SSLCommerz", desc: "Local BKash/Nagad/Direct Hub", icon: Wallet, color: "indigo" },
              ].map((gw) => (
                <div
                  key={gw.id}
                  onClick={() => setPaymentMethod(gw.id)}
                  className={cn(
                    "p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 relative overflow-hidden group",
                    paymentMethod === gw.id
                      ? `bg-${gw.color}-600 border-transparent shadow-2xl shadow-${gw.color}-600/20 text-white scale-[1.02]`
                      : "bg-card/40 border-muted/20 hover:border-primary/40 hover:bg-primary/5"
                  )}
                >
                  <div className="relative z-10 flex items-center gap-6">
                    <div className={cn(
                      "h-16 w-16 rounded-2xl flex items-center justify-center transition-colors duration-500",
                      paymentMethod === gw.id ? "bg-white/20" : `bg-${gw.color}-500/10 text-${gw.color}-500`
                    )}>
                      <gw.icon size={32} />
                    </div>
                    <div>
                      <h4 className="font-black text-xl tracking-tight">{gw.label}</h4>
                      <p className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        paymentMethod === gw.id ? "text-white/70" : "text-muted-foreground/60"
                      )}>{gw.desc}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "absolute -right-8 -bottom-8 h-32 w-32 rounded-full blur-3xl opacity-20",
                    paymentMethod === gw.id ? "bg-white" : `bg-${gw.color}-500`
                  )} />
                </div>
              ))}
            </div>
          </section>

          {/* Impact Statement */}
          <div className="p-8 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10 flex gap-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                <Sparkles size={120} className="text-emerald-500" />
             </div>
             <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex shadow-inner items-center justify-center shrink-0">
                <Heart size={32} className="text-emerald-500 fill-current animate-pulse" />
             </div>
             <div className="space-y-2 relative">
                <h4 className="text-sm font-black text-emerald-700 uppercase tracking-widest">Certified Community Impact</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-bold">
                   100% of your fiscal allocation is injected directly into audited community projects. Our foundation operates on zero-leakage protocols, ensuring every BDT drives real-world transformation.
                </p>
             </div>
          </div>
        </div>

        {/* Audit Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="sticky top-24 border-none shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl border border-muted/20">
            <div className="p-10 bg-primary/5 border-b border-muted/20">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Audit Summary</h4>
               <p className="text-xs text-muted-foreground font-bold leading-tight uppercase tracking-widest">Current Foundation Liquidity</p>
            </div>
            
            <div className="p-10 space-y-10">
              {summaryLoading ? (
                 <div className="flex flex-col items-center gap-4 py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Syncing Ledger...</span>
                 </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Global Income</span>
                    <span className="text-lg font-black text-emerald-600 font-mono">৳{summary?.totalIncome?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10">
                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Total Expense</span>
                    <span className="text-lg font-black text-rose-600 font-mono">৳{summary?.totalExpense?.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Net Available Fund</p>
                    <p className="text-5xl font-black text-primary text-center tracking-tighter drop-shadow-sm font-mono leading-none">৳{summary?.currentBalance?.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="h-px bg-muted/30" />

              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gateway Protocol</span>
                    <span className="text-xs font-black">{paymentMethod}</span>
                 </div>
                 <div className="flex justify-between items-center text-primary">
                    <span className="text-[10px] font-black uppercase tracking-widest">Settlement Amount</span>
                    <span className="text-2xl font-black">৳{Number(amount).toLocaleString()}</span>
                 </div>
              </div>

              <Button
                onClick={handleDonate}
                disabled={processing || !amount || Number(amount) <= 0}
                className="w-full h-18 rounded-[1.75rem] bg-primary hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/30 transition-all font-black uppercase text-xs tracking-[0.2em] relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 skew-x-12" />
                {processing ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Auditing...
                  </>
                ) : (
                  <>
                    Authorize Settlement
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-center gap-3 py-2">
                 <ShieldCheck size={14} className="text-emerald-500" />
                 <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Bank-Grade Encryption Verified</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
