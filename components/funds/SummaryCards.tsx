"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export const SummaryCards = ({ summary }: { summary: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Current Balance - Now Green/Emerald */}
    <Card className="bg-emerald-50 border-emerald-200 shadow-sm relative overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
          Current Balance
        </CardTitle>
        <Wallet className="h-5 w-5 text-emerald-500" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold text-emerald-700">
          ৳ {summary?.currentBalance?.toLocaleString() || 0}
        </div>
        <p className="text-[10px] text-emerald-600/70 mt-1 font-medium italic">
          Net Available Funds
        </p>
      </CardContent>
      {/* Decorative background icon */}
      <Wallet className="absolute -right-4 -bottom-4 h-20 w-20 text-emerald-100 opacity-50" />
    </Card>

    {/* Total Expense */}
    <Card className="bg-red-50 border-red-200 shadow-sm relative overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-bold text-red-600 uppercase tracking-wider">
          Total Expense
        </CardTitle>
        <ArrowDownCircle className="h-5 w-5 text-red-500" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold text-red-700">
          ৳ {summary?.totalExpense?.toLocaleString() || 0}
        </div>
        <p className="text-[10px] text-red-600/70 mt-1 font-medium italic">
          Total Outgoing
        </p>
      </CardContent>
      <ArrowDownCircle className="absolute -right-4 -bottom-4 h-20 w-20 text-red-100 opacity-50" />
    </Card>
    {/* Total Income */}
    <Card className="bg-blue-50 border-blue-200 shadow-sm relative overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Total Income
        </CardTitle>
        <ArrowUpCircle className="h-5 w-5 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold text-blue-700">
          ৳ {summary?.totalIncome?.toLocaleString() || 0}
        </div>
        <p className="text-[10px] text-blue-600/70 mt-1 font-medium italic">
          Lifetime Earnings
        </p>
      </CardContent>
      <ArrowUpCircle className="absolute -right-4 -bottom-4 h-20 w-20 text-blue-100 opacity-50" />
    </Card>
  </div>
);
