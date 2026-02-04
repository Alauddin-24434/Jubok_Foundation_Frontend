"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, CreditCard, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useEffect } from "react";

interface Payment {
  _id: string;
  transactionId: string;
  amount: number;
  method: string;
  purpose: string;
  paymentStatus: string;
  paidAt?: string;
  createdAt: string;
}

export default function MyPaymentsPage() {
  const token = useSelector(selectCurrentToken);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/my-payments?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch payments");

        const result = await response.json();
        setPayments(result.data);
        setTotalPages(result.meta.totalPages);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPayments();
    }
  }, [token, page]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      INITIATED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      FAILED: "bg-red-500/10 text-red-600 border-red-500/20",
      CANCELLED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    };
    return colors[status] || "bg-gray-500/10 text-gray-600";
  };

  const getPurposeLabel = (purpose: string) => {
    const labels: Record<string, string> = {
      MEMBERSHIP_FEE: "Membership Fee",
      MONTHLY_DONATION: "Monthly Donation",
      PROJECT_DONATION: "Project Donation",
    };
    return labels[purpose] || purpose;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-bold">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">My Payments</h1>
          <p className="text-muted-foreground mt-1">
            View all your payment history and invoices
          </p>
        </div>
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold">No Payments Yet</h3>
              <p className="text-muted-foreground mt-2">
                You haven't made any payments yet.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => (
            <Card
              key={payment._id}
              className="p-6 hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-card to-muted/10"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge
                      className={`${getStatusColor(payment.paymentStatus)} border font-bold uppercase px-3 py-1`}
                    >
                      {payment.paymentStatus}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      {payment.transactionId}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="font-black text-lg">
                          ৳{payment.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Purpose</p>
                        <p className="font-bold text-sm">
                          {getPurposeLabel(payment.purpose)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-bold text-sm">
                          {formatDate(payment.paidAt || payment.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {payment.paymentStatus === "PAID" && (
                  <Link href={`/invoice/${payment._id}`}>
                    <Button
                      variant="outline"
                      className="rounded-xl font-bold group"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Invoice
                      <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="flex items-center px-4">
            <span className="text-sm font-bold">
              Page {page} of {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
