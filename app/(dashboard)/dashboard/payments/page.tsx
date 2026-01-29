"use client";

//==================================================================================
//                               PAYMENT GOVERNANCE
//==================================================================================
// Description: Auditing system for verifying and approving financial contributions.
// Features: Transaction verification, status tracking, and automated approval.
//==================================================================================

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
import {
  ChevronLeft,
  ChevronRight,
  Hash,
  Phone,
  User as UserIcon,
  Calendar,
  CheckCircle,
  Clock,
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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [openVerify, setOpenVerify] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  //======================   API SYNCHRONIZATION   ===============================
  const { data, isLoading } = useGetPaymentsQuery({
    page,
    limit: 10,
    status: status === "ALL" ? undefined : status,
    search,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [approvePayment, { isLoading: approving }] =
    useApprovePaymentMutation();

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
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black">
            <UserIcon size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground tracking-tight text-sm">
              {payment.userId?.name}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium italic">
              {payment.userId?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Hook",
      cell: (payment: any) => (
        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
          <Phone size={12} className="text-primary/60" />
          {payment.senderNumber}
        </div>
      ),
    },
    {
      header: "Net Amount",
      cell: (payment: any) => (
        <div className="flex items-center gap-1 font-black text-foreground bg-muted/30 px-2 py-1 rounded-lg w-fit">
          <span className="text-primary opacity-60">৳</span>
          {payment.amount.toLocaleString()}
        </div>
      ),
    },
    {
      header: "Audit Status",
      cell: (payment: any) => (
        <Badge
          className={`uppercase text-[9px] font-black px-2 py-0.5 tracking-tighter ${
            payment.status === "PAID"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none"
              : payment.status === "PENDING"
                ? "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-none"
                : "bg-red-500/10 text-red-600 border-red-500/20 shadow-none"
          }`}
          variant="outline"
        >
          {payment.status === "PAID" ? (
            <CheckCircle size={10} className="mr-1" />
          ) : (
            <Clock size={10} className="mr-1" />
          )}
          {payment.status}
        </Badge>
      ),
    },
    {
      header: "Verification",
      cell: (payment: any) =>
        payment.status === "PENDING" ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-[10px] font-black uppercase tracking-widest bg-primary/5 hover:bg-primary hover:text-white transition-all border border-primary/20"
            onClick={() => {
              setSelectedPayment(payment);
              setOpenVerify(true);
            }}
          >
            Verify Claim
          </Button>
        ) : (
          <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/40 italic">
            Closed Trace
          </div>
        ),
    },
    {
      header: "Record Date",
      cell: (payment: any) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 font-medium">
          <Calendar size={12} />
          {new Date(payment.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    },
  ];

  //======================   MAIN RENDER   ===============================
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <AFPageHeader
        title="Contribution Ledger"
        description="Verify financial commitments and authorize membership activations via transaction claims."
      />

      {/* Global Search & Multi-State Filtering */}
      <AFSearchFilters
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Reverse lookup via contributor identity or phone sequence..."
        filters={STATUS_TABS}
        activeFilter={status}
        onFilterChange={handleStatusChange}
      />

      {/* Audit Data Infrastructure */}
      <div className="rounded-3xl border border-muted/30 overflow-hidden shadow-2xl bg-card/50 backdrop-blur-sm">
        <AFDataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          emptyMessage="No transaction entities discovered within this sector."
        />
      </div>

      {/* Pagination Infrastructure */}
      {data && data.meta && data.meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-8 bg-muted/10 rounded-2xl">
          <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Ledger Sector <span className="text-primary">{data.meta.page}</span>{" "}
            / {data.meta.totalPages}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => {
                setPage((p) => p - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="h-10 px-6 rounded-xl font-bold bg-background shadow-sm hover:shadow-md transition-all"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Prev Sector
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === data.meta.totalPages}
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="h-10 px-6 rounded-xl font-bold bg-background shadow-sm hover:shadow-md transition-all"
            >
              Next Sector
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Verification Components (Hidden State) */}
      <VerifyPaymentModal
        open={openVerify}
        onClose={() => setOpenVerify(false)}
        payment={selectedPayment}
        onConfirm={() => setOpenConfirm(true)}
        loading={approving}
      />

      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent className="rounded-3xl border-none shadow-3xl overflow-hidden p-0">
          <div className="bg-emerald-500/10 p-8 flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <CheckCircle size={32} />
            </div>
            <div className="space-y-1">
              <AlertDialogTitle className="text-2xl font-black text-emerald-900 tracking-tight">
                Authorization Required
              </AlertDialogTitle>
              <AlertDialogDescription className="text-emerald-700/70 font-medium">
                Confirming this transaction will grant full system access to the
                contributor.
              </AlertDialogDescription>
            </div>
          </div>

          <div className="p-8 pt-4 flex flex-col sm:flex-row gap-3">
            <AlertDialogCancel className="flex-1 rounded-2xl h-12 font-bold border-muted-foreground/20 hover:bg-muted">
              Discard Protocol
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={approving}
              className="flex-1 rounded-2xl h-12 bg-emerald-600 hover:bg-emerald-700 font-black shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              {approving ? "Encoding..." : "Verify & Authorize"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
