"use client";

//==================================================================================
//                               FUNDS MANAGEMENT
//==================================================================================
// Description: Core module for tracking foundation finances, income, and expenses.
// Features: Real-time summary, PDF report generation, and transaction history.
//==================================================================================

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Settings, Loader2, DollarSign } from "lucide-react";
import {
  useAddFundTransactionMutation,
  useGetFundHistoryQuery,
  useGetFundSummaryQuery,
} from "@/redux/features/fundApi/fundApi";
import { AddTransactionForm } from "@/components/funds/AddTransactionForm";
import { generateFundPDF } from "@/lib/pdfGenerator";
import { TransactionTable } from "@/components/funds/TransactionTable";
import { SummaryCards } from "@/components/funds/SummaryCards";
import { AFPageHeader } from "@/components/shared/AFPageHeader";

export default function FundDashboard() {
  //======================   STATE & HOOKS   ===============================
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [sigName, setSigName] = useState("");
  const [sigDesignation, setSigDesignation] = useState("");

  const { data: summary, isLoading: sLoading } = useGetFundSummaryQuery();
  const { data: history, isLoading: hLoading } = useGetFundHistoryQuery({
    limit,
  });
  const [addTransaction, { isLoading: adding }] =
    useAddFundTransactionMutation();

  //======================   RENDER LOGIC   ===============================
  if (sLoading || hLoading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Fetching financial records...
        </p>
      </div>
    );
  }

  //======================   MAIN VIEW   ===============================
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Section */}
      <AFPageHeader
        title="Fund Governance"
        description="Monitor liquidity, track expenditures, and audited financial reporting."
      />

      {/* 💰 FINANCIAL SUMMARY OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCards summary={summary} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ➕ NEW TRANSACTION FORM (Left/Top) */}
        <div className="xl:col-span-2">
          <AddTransactionForm
            onAdd={async (data: any) => await addTransaction(data).unwrap()}
            adding={adding}
          />
        </div>

        {/* 🛠️ REPORT GENERATION SETTINGS (Right) */}
        <div className="space-y-6">
          <Card className="border-2 border-primary/10 shadow-xl rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                <Settings size={16} />
                Report Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                  Signatory Name
                </label>
                <Input
                  placeholder="e.g. Abdullah Al Mamun"
                  className="rounded-xl border-muted-foreground/20 focus:ring-primary/20 h-11"
                  value={sigName}
                  onChange={(e) => setSigName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                  Official Designation
                </label>
                <Input
                  placeholder="e.g. Chairman"
                  className="rounded-xl border-muted-foreground/20 focus:ring-primary/20 h-11"
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl h-11 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
              >
                <FileText size={18} className="mr-2" />
                Generate Audit PDF
              </Button>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
            <h4 className="text-amber-600 font-bold text-sm mb-2">
              Financial Integrity Tip
            </h4>
            <p className="text-xs text-amber-700/70 leading-relaxed font-medium">
              Always attach evidence/receipts for expenses above ৳1,000 to
              maintain auditing standards.
            </p>
          </div>
        </div>
      </div>

      {/* 📊 TRANSACTION AUDIT HISTORY */}
      <div className="rounded-2xl overflow-hidden bg-card border border-muted/30 shadow-2xl">
        <div className="p-6 border-b border-muted/30 bg-muted/5">
          <h3 className="text-lg font-black text-foreground flex items-center gap-2">
            <DollarSign size={20} className="text-primary" />
            Transaction Audit Log
          </h3>
        </div>
        <TransactionTable
          history={history}
          search={search}
          setSearch={setSearch}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </div>
  );
}
