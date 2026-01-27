"use client";

import { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetFundHistoryQuery,
  useGetFundSummaryQuery,
} from "@/redux/features/fundApi/fundApi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function FundDashboard() {
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  // নতুন স্টেট: নাম এবং পদবী
  const [sigName, setSigName] = useState("");
  const [sigDesignation, setSigDesignation] = useState("");

  const { data: summary, isLoading: summaryLoading } = useGetFundSummaryQuery();
  const { data: history, isLoading: historyLoading } = useGetFundHistoryQuery({
    limit,
  });

  if (summaryLoading || historyLoading)
    return <p className="p-6">Loading fund data...</p>;

  const filteredHistory = history?.filter(
    (tx) =>
      tx.reason.toLowerCase().includes(search.toLowerCase()) ||
      tx.createdBy?.name?.toLowerCase().includes(search.toLowerCase()) ||
      tx.createdBy?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const viewMonthlyInvoicePDF = async () => {
    if (!history) return;

    const pdf = new jsPDF("p", "mm", "a4") as any;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const now = new Date();

    // 🎨 ১. স্মল সিল ওয়াটারমার্ক (পুরো পেজ জুড়ে)
    pdf.saveGraphicsState();
    pdf.setGState(new (pdf as any).GState({ opacity: 0.03 })); // খুবই হালকা (৩%)
    for (let x = 10; x < pageWidth; x += 40) {
      for (let y = 10; y < pageHeight; y += 40) {
        try {
          pdf.addImage("/images/SEAL.png", "PNG", x, y, 15, 15);
        } catch (e) {}
      }
    }
    pdf.restoreGraphicsState();

    // 🎨 ২. মেইন সেন্টার ওয়াটারমার্ক
    pdf.saveGraphicsState();
    pdf.setGState(new (pdf as any).GState({ opacity: 0.07 })); // ৭% ট্রান্সপারেন্সি
    pdf.setFontSize(50);
    pdf.setFont(undefined, "bold");
    pdf.setTextColor(100);
    // পেজের ঠিক মাঝখানে সেন্টারে
    pdf.text("ALHAMDULILLAH FOUNDATION", pageWidth / 1.5, pageHeight / 1.4, {
      align: "center",
      angle: 45,
    });

    pdf.restoreGraphicsState();

    // ৩. হেডার
    pdf.setFontSize(22);
    pdf.setTextColor(41, 128, 185);
  
    pdf.text("AF MONTHLY FUND INVOICE", pageWidth / 2, 20, { align: "center" });

    // ৪. পিরিয়ড ও তারিখ
    pdf.setFontSize(10);
    pdf.setTextColor(80);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);
    pdf.text(
      `Period: ${oneMonthAgo.toLocaleDateString()} - ${now.toLocaleDateString()}`,
      14,
      30,
    );
    pdf.text(`Generated: ${now.toLocaleString()}`, pageWidth - 14, 30, {
      align: "right",
    });

    // ৫. ট্রানজেকশন টেবিল
    const lastMonthTx = history.filter(
      (tx) => new Date(tx.createdAt) >= oneMonthAgo,
    );
    const tableRows = lastMonthTx.map((tx) => [
      new Date(tx.createdAt).toLocaleDateString(),
      tx.createdBy?.name || "N/A",
      tx.type,
      tx.amount.toLocaleString(),
      tx.balanceSnapshot.toLocaleString(),
      tx.reason,
    ]);

    autoTable(pdf, {
      startY: 35,
      head: [["Date", "User Name", "Type", "Amount", "Balance", "Reason"]],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      // টেবিলের ব্যাকগ্রাউন্ডে যেন ওয়াটারমার্ক হালকা দেখা যায়
      styles: { fontSize: 9, cellPadding: 3, fillColor: [255, 255, 255, 0.85] },
    });

    // ৬. ব্যালেন্স সামারি
    const finalTableY = (pdf as any).lastAutoTable.finalY + 10;
    pdf.setFont(undefined, "bold");
    pdf.setTextColor(0);
    pdf.text(
      `Total Current Balance: ${(summary?.currentBalance || 0).toLocaleString()} BDT`,
      pageWidth - 14,
      finalTableY,
      { align: "right" },
    );

    // ৭. ফুটার (সিগনেচার ও বড় সিল)
    const footerY = pageHeight - 45;

    try {
      // মেইন সিল ইমেজ (সাইজ বড় করা হয়েছে - ৪৫x৪৫)
      const sealX = pageWidth - 60;
      pdf.addImage("/images/SEAL.png", "PNG", sealX, footerY - 20, 45, 45);

      // VERIFIED স্ট্যাম্প
      pdf.setTextColor(39, 174, 96);
      pdf.setFontSize(16);
      pdf.text("VERIFIED", sealX + 22, footerY + 2, {
        align: "center",
        angle: -15,
      });

      // টাইপ করা সিগনেচার
      pdf.setTextColor(0, 0, 150);
      pdf.setFont("times", "italic", "bold");
      pdf.setFontSize(18);
      pdf.text(sigName, 14, footerY);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(0);
      pdf.text("________________________", 14, footerY + 2);
      pdf.setFont(undefined, "bold");
      pdf.text(sigDesignation || "Authorized Person", 14, footerY + 8);

      pdf.setFont(undefined, "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(120);
      pdf.text(`Signed on: ${now.toLocaleDateString()}`, 14, footerY + 13);
    } catch (error) {
      console.warn("Images not found");
    }

    // লাইসেন্স ইনফো
    pdf.setFontSize(9);
    pdf.setTextColor(150);
    pdf.text(`License No: AF-123456`, 14, pageHeight - 10);

    const blobURL = pdf.output("bloburl");
    window.open(blobURL, "_blank");
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* 💰 SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-sm text-green-600 uppercase">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-700 text-center">
            ৳ {summary?.totalIncome?.toLocaleString() || 0}
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-sm text-red-600 uppercase">
              Total Expense
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-red-700 text-center">
            ৳ {summary?.totalExpense?.toLocaleString() || 0}
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-sm text-blue-600 uppercase">
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-blue-700 text-center">
            ৳ {summary?.currentBalance?.toLocaleString() || 0}
          </CardContent>
        </Card>
      </div>

      {/* 🛠️ INVOICE CONTROL PANEL (Updated with Designation) */}
      <Card className="border-2 border-blue-100 shadow-md">
        <CardHeader className="bg-blue-50/50">
          <CardTitle className="text-lg text-blue-700">
            Invoice Generation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Signatory Name
            </label>
            <Input
              placeholder="e.g. Md. Abdul Karim"
              value={sigName}
              onChange={(e) => setSigName(e.target.value)}
              className="bg-white border-blue-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Designation (Podobi)
            </label>
            <Input
              placeholder="e.g. President / Secretary"
              value={sigDesignation}
              onChange={(e) => setSigDesignation(e.target.value)}
              className="bg-white border-blue-200"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={viewMonthlyInvoicePDF}
              disabled={!sigName || !sigDesignation}
              className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold h-10 shadow-lg"
            >
              Generate & Preview PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 📊 HISTORY TABLE SECTION */}
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Input
            placeholder="Search by reason or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md shadow-sm"
          />
          <div className="flex gap-2">
            {[10, 20, 50].map((num) => (
              <Button
                key={num}
                size="sm"
                variant={limit === num ? "default" : "outline"}
                onClick={() => setLimit(num)}
              >
                Last {num}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory?.map((tx) => (
                <TableRow
                  key={tx._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>
                    <div className="font-medium">{tx.createdBy?.name}</div>
                    <div className="text-[10px] text-gray-400">
                      {tx.createdBy?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tx.type === "INCOME" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {tx.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-gray-800">
                    ৳ {tx.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-gray-500">
                    ৳ {tx.balanceSnapshot.toLocaleString()}
                  </TableCell>
                  <TableCell className="max-w-[180px] text-sm text-gray-600 truncate">
                    {tx.reason}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
