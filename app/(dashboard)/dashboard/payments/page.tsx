"use client";

import { useState } from "react";
import {
  useGetPaymentsQuery,
  useApprovePaymentMutation,
} from "@/redux/features/payment/paymentApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { VerifyPaymentModal } from "@/components/verifyPaymentModel";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { AFSearchFilters } from "@/components/shared/AFSearchFilters";
import { AFDataTable } from "@/components/shared/AFDataTable";
import { AFSectionTitle } from "@/components/shared/AFSectionTitle";
import { AFPagination } from "@/components/shared/AFPagination";
import { Card } from "@/components/ui/card";
import {
  Phone,
  User as UserIcon,
  Calendar,
  CheckCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Wallet,
} from "lucide-react";

/**
 * Filter configuration for payment lifecycle stages.
 */
const STATUS_TABS = [
  { label: "Full Registry", value: "ALL" },
  { label: "Awaiting Verification", value: "PENDING" },
  { label: "Successful", value: "PAID" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Failed", value: "FAILED" },
];

export default function AdminPaymentsPage() {
  //======================   STATE & HOOKS   ===============================
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [openVerify, setOpenVerify] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  //======================   API SYNCHRONIZATION   ===============================
  const { data: paymentsResponse, isLoading } = useGetPaymentsQuery({
    page,
    limit,
    status: status === "ALL" ? undefined : status,
    search: search || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [approvePayment, { isLoading: approving }] =
    useApprovePaymentMutation();

  const payments = paymentsResponse?.data || [];
  const meta = paymentsResponse?.meta || { totalPages: 1, total: 0 };

  //======================   EVENT HANDLERS   ===============================
  const handleApprove = async () => {
    const toastId = toast.loading("Executing payment settlement protocol...");
    try {
      await approvePayment(selectedPayment._id).unwrap();
      toast.success("Transaction verified and settled successfully ✅", {
        id: toastId,
      });
      setOpenConfirm(false);
      setOpenVerify(false);
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Protocol Violation: Approval sequence failed ❌",
        { id: toastId },
      );
    }
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  //======================   TABLE DEFINITION   ===============================
  const columns = [
    {
      header: "Contributor Identity",
      cell: (payment: any) => (
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary font-black shadow-inner">
             {payment.userId?.name?.charAt(0) || <UserIcon size={16} />}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground tracking-tight text-sm">
              {payment.userId?.name || "Anonymous Donor"}
            </span>
            <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-tighter">
              {payment.userId?.email || "No digital trail"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Method",
      cell: (payment: any) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-black text-foreground">
            <Phone size={10} className="text-primary/40" />
            {payment.senderNumber || payment.userId?.phone || "Verified User"}
          </div>
          <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
            {payment.method === "STRIPE" ? "Stripe AES-256" : 
             payment.method === "SSLCOMMERZ" ? "SSLCommerz 3D" : 
             `${payment.method} Network`}
          </div>
        </div>
      ),
    },
    {
      header: "Net Settlement",
      cell: (payment: any) => (
        <div className="flex items-center gap-1.5 font-black text-foreground bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-xl w-fit">
          <span className="text-primary/40 text-[10px]">৳</span>
          <span className="text-sm">{(payment.amount || 0).toLocaleString()}</span>
        </div>
      ),
    },
    {
      header: "Audit Status",
      cell: (payment: any) => (
        <Badge
          className={`uppercase text-[9px] font-black px-2.5 py-1 tracking-widest rounded-lg border-2 shadow-none ${
            payment.paymentStatus === "PAID"
              ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20"
              : payment.paymentStatus === "PENDING"
                ? "bg-amber-500/5 text-amber-600 border-amber-500/20"
                : "bg-red-500/5 text-red-600 border-red-500/20"
          }`}
          variant="outline"
        >
          {payment.paymentStatus === "PAID" ? (
            <CheckCircle size={10} className="mr-1.5" />
          ) : payment.paymentStatus === "PENDING" ? (
            <Clock size={10} className="mr-1.5 animate-pulse" />
          ) : (
            <AlertCircle size={10} className="mr-1.5" />
          )}
          {payment.paymentStatus}
        </Badge>
      ),
    },
    {
      header: "Management",
      cell: (payment: any) =>
        payment.paymentStatus === "PENDING" ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-10 px-6 text-[10px] font-black uppercase tracking-widest bg-emerald-500/5 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all rounded-xl border border-emerald-500/20 shadow-sm"
            onClick={() => {
              setSelectedPayment(payment);
              setOpenVerify(true);
            }}
          >
            Authorize Claim
          </Button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/20 w-fit rounded-xl border border-muted/30">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
              Audit Closed
            </span>
          </div>
        ),
    },
    {
      header: "Record Date",
      cell: (payment: any) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-foreground font-black">
            <Calendar size={10} className="text-primary/40" />
            {new Date(payment.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">
            {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
  ];

  //======================   MAIN RENDER   ===============================
  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Page Header */}
      <AFPageHeader
        title="Contribution Ledger"
        description="Audit systemic financial commitments, verify transaction integrity, and authorize membership activations."
      />

       {/* Quick Stats Banner */}
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <Card className="p-6 border-none bg-card/40 backdrop-blur-md shadow-sm flex items-center gap-6 rounded-[2rem]">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
               <CreditCard size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Ledger Count</p>
               <p className="text-3xl font-black">{meta.total || 0}</p>
            </div>
         </Card>
         <Card className="p-6 border-none bg-card/40 backdrop-blur-md shadow-sm flex items-center gap-6 rounded-[2rem]">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
               <Clock size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Pending Audit</p>
               <p className="text-3xl font-black">{payments.filter((p: any) => p.status === 'PENDING').length}</p>
            </div>
         </Card>
         <Card className="p-6 border-none bg-card/40 backdrop-blur-md shadow-sm flex items-center gap-6 rounded-[2rem]">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
               <Wallet size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Settled Funds</p>
               <p className="text-3xl font-black">৳{(payments.filter((p: any) => p.status === 'PAID').reduce((acc: number, curr: any) => acc + curr.amount, 0) / 1000).toFixed(1)}k</p>
            </div>
         </Card>
      </div>

      <div className="space-y-8">
        <AFSectionTitle 
          title="Financial Infrastructure" 
          subtitle="Real-time transaction monitoring and lifecycle management for all incoming contributions."
          badge="Audit Stream"
        />

        <div className="rounded-[3rem] overflow-hidden bg-card/30 backdrop-blur-md border border-muted/20 shadow-2xl p-8">
          {/* Filtering Infrastructure */}
          <AFSearchFilters
            searchValue={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            searchPlaceholder="Identify records via phone sequence, contributor hash, or digital trail..."
            filters={STATUS_TABS}
            activeFilter={status}
            onFilterChange={handleStatusChange}
          />

          {/* Data Infrastructure */}
          <div className="mt-10 rounded-[2rem] overflow-hidden shadow-2xl border border-muted/10 bg-card/50">
            <AFDataTable
              columns={columns}
              data={payments}
              isLoading={isLoading}
              emptyMessage="No transaction entities discovered within this sector."
            />
          </div>

          {/* Pagination Infrastructure */}
          <AFPagination 
             currentPage={page}
             totalPages={meta.totalPages}
             onPageChange={(p) => {
               setPage(p);
               window.scrollTo({ top: 0, behavior: 'smooth' });
             }}
          />
        </div>
      </div>

      {/* Verification Infrastructure */}
      <VerifyPaymentModal
        open={openVerify}
        onClose={() => setOpenVerify(false)}
        payment={selectedPayment}
        onConfirm={() => setOpenConfirm(true)}
        loading={approving}
      />

      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent className="rounded-[3rem] border-none shadow-3xl overflow-hidden p-0 max-w-[500px]">
          <div className="bg-emerald-500/10 p-12 flex flex-col items-center gap-6 text-center">
            <div className="h-20 w-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-600/30 scale-110">
              <ShieldCheck size={40} />
            </div>
            <div className="space-y-2">
              <AlertDialogTitle className="text-3xl font-black text-emerald-950 tracking-tighter uppercase">
                Confirm Settlement
              </AlertDialogTitle>
              <AlertDialogDescription className="text-emerald-700 font-bold text-sm max-w-xs mx-auto tabular-nums">
                Analyzing transaction integrity... Proceeding will authorize full system access for ID: {selectedPayment?.userId?.name || 'NODE'}.
              </AlertDialogDescription>
            </div>
          </div>

          <div className="p-10 pt-6 flex flex-col sm:flex-row gap-4">
            <AlertDialogCancel className="flex-1 rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest border-muted shadow-sm hover:bg-muted transition-all">
              Abort Protocol
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={approving}
              className="flex-1 rounded-2xl h-14 bg-emerald-600 hover:bg-emerald-700 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-emerald-600/30 transition-all hover:scale-105"
            >
              {approving ? "Encoding..." : "Verify & Authorize"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
