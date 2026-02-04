"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Settings, Loader2, DollarSign, Wallet } from "lucide-react";
import {
  useAddFundTransactionMutation,
  useGetFundHistoryQuery,
  useGetFundSummaryQuery,
  useGetExpenseRequestsQuery,
} from "@/redux/features/fundApi/fundApi";
import { AddTransactionForm } from "@/components/funds/AddTransactionForm";
import { generateFundPDF } from "@/lib/pdfGenerator";
import { TransactionTable } from "@/components/funds/TransactionTable";
import { SummaryCards } from "@/components/funds/SummaryCards";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { AFSectionTitle } from "@/components/shared/AFSectionTitle";
import { AFPagination } from "@/components/shared/AFPagination";
import { ExpenseRequestTable } from "@/components/funds/ExpenseRequestTable";

export default function FundDashboard() {
  //======================   STATE & HOOKS   ===============================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sigName, setSigName] = useState("");
  const [sigDesignation, setSigDesignation] = useState("");

  const { data: summary, isLoading: sLoading } = useGetFundSummaryQuery();
  const { data: historyResponse, isLoading: hLoading } = useGetFundHistoryQuery({
    page,
    limit,
  });
  const { data: requests, isLoading: rLoading } = useGetExpenseRequestsQuery({ status: 'PENDING' });
  const [addTransaction, { isLoading: adding }] =
    useAddFundTransactionMutation();

  const history = historyResponse?.data || [];
  const meta = historyResponse?.meta || { totalPages: 1, total: 0 };

  //======================   RENDER LOGIC   ===============================
  if (sLoading || hLoading || rLoading) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="h-20 w-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.3em] animate-pulse">
          Auditing financial records...
        </p>
      </div>
    );
  }

  //======================   MAIN VIEW   ===============================
  return (
    <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Page Header */}
      <AFPageHeader
        title="Fiscal Intelligence"
        description="Strategic monitoring of foundation liquidity, expenditure protocols, and audited fiscal trajectories."
      />

      {/* 💰 FINANCIAL SUMMARY OVERVIEW */}
      <SummaryCards summary={summary} />

      {/* 📝 EXPENSE APPROVAL QUEUE */}
      {requests && requests.length > 0 && (
         <div className="space-y-6">
            <AFSectionTitle 
              title="Awaiting Authorization" 
              subtitle="Pending expenditure requests requiring administrator verification before settlement."
              badge="Protocol Queue"
            />
            <ExpenseRequestTable requests={requests} isLoading={rLoading} />
         </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 ">
        {/* ➕ NEW TRANSACTION FORM (Left/Top) */}
        <div className="xl:col-span-2">
          <AFSectionTitle 
            title="Register Transaction" 
            subtitle="Initiate new fiscal entries into the foundation ledger. Expenses will require secondary approval."
            badge="Ledger Entry"
          />
          <AddTransactionForm
            onAdd={async (data: any) => await addTransaction(data).unwrap()}
            adding={adding}
          />
        </div>

        {/* 🛠️ REPORT GENERATION SETTINGS (Right) */}
        <div className="space-y-8">
           <AFSectionTitle 
            title="Fiscal Controls" 
            subtitle="Configure reporting protocols."
            className="mb-0"
          />
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-md border border-muted/20">
            <CardHeader className="p-8 border-b border-muted/20 bg-primary/5">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-primary">
                <Settings size={18} className="animate-spin-slow" />
                Report Protocols
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Primary Signatory
                </label>
                <Input
                  placeholder="e.g. Abdullah Al Mamun"
                  className="rounded-2xl border-muted/30 focus:ring-primary/20 h-12 bg-background/50 font-bold"
                  value={sigName}
                  onChange={(e) => setSigName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Official Designation
                </label>
                <Input
                  placeholder="e.g. Chairman"
                  className="rounded-2xl border-muted/30 focus:ring-primary/20 h-12 bg-background/50 font-bold"
                  value={sigDesignation}
                  onChange={(e) => setSigDesignation(e.target.value)}
                />
              </div>
              <Button
                onClick={() =>
                  generateFundPDF(
                    history || [],
                    summary,
                    sigName,
                    sigDesignation,
                  )
                }
                disabled={!sigName || !sigDesignation}
                className="w-full h-14 bg-primary hover:scale-[1.02] active:scale-95 text-primary-foreground font-black rounded-2xl shadow-2xl shadow-primary/30 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-3"
              >
                <FileText size={20} />
                Generate Audit PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 📊 TRANSACTION AUDIT HISTORY */}
      <div className="space-y-8">
        <AFSectionTitle 
          title="Fiscal Audit Stream" 
          subtitle="Comprehensive immutable log of all incoming and outgoing financial movements."
          badge="Live Ledger"
        />
        <div className="rounded-[3rem] overflow-hidden bg-card/30 backdrop-blur-md border border-muted/20 shadow-2xl p-8">
          <TransactionTable
            history={history}
            search={search}
            setSearch={(val: string) => {
              setSearch(val);
              setPage(1);
            }}
            limit={limit}
            setLimit={(val: number) => {
              setLimit(val);
              setPage(1);
            }}
          />

          <AFPagination 
             currentPage={page}
             totalPages={meta.totalPages}
             onPageChange={(p) => {
               setPage(p);
               window.scrollTo({ top: 0, behavior: 'smooth' });
             }}
             className="mt-8"
          />
        </div>
      </div>
    </div>
  );
}
