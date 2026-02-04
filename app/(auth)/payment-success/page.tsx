"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Home, Receipt, Clock } from "lucide-react";
import Link from "next/link";
import { useGetMeQuery } from "@/redux/features/auth/authApi";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  
  // Trigger user data refresh to sync role after payment
  const { refetch } = useGetMeQuery({}, { skip: !mounted });

  const tranId = searchParams.get("tranId");
  const amount = searchParams.get("amount");
  const message = searchParams.get("message");

  // Determine if this is a membership or donation payment
  const isMembership = message?.includes("membership");

  useEffect(() => {
    setMounted(true);
    
    // Simple confetti effect using CSS animation
    const timer = setTimeout(() => {
      // Trigger any additional effects here
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-none shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-12 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6 animate-bounce">
            <CheckCircle className="w-14 h-14 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-emerald-100 text-lg font-medium">
            {message || "Your payment has been received"}
          </p>
        </div>

        {/* Payment Details */}
        <CardContent className="p-8 space-y-6">
          {tranId && amount && (
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-100">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-600">
                    Transaction ID
                  </span>
                  <span className="text-sm font-mono font-bold text-gray-900">
                    {tranId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-600">
                    Amount Paid
                  </span>
                  <span className="text-3xl font-black text-emerald-600">
                    ৳ {Number(amount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Conditional Message */}
          {isMembership ? (
            <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border-2 border-emerald-100">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-emerald-900">
                    Membership Active! 🎖️
                  </h3>
                  <p className="text-sm text-emerald-700 leading-relaxed font-medium">
                    Congratulations! Your membership has been automatically activated. 
                    You now have full access to the dashboard, projects, and member directory.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-2 border-blue-100">
              <h3 className="text-lg font-black text-blue-900 mb-2">
                Thank You for Your Generosity! 🙏
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                Your contribution has been added to the foundation fund and will
                be used to support our ongoing projects and initiatives. You're
                making a real difference in our community!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-xl font-bold border-2 hover:bg-gray-50"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            <Button
              asChild
              className="h-12 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Receipt Note */}
          <p className="text-xs text-center text-gray-500 pt-4">
            A receipt has been sent to your registered email address.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
