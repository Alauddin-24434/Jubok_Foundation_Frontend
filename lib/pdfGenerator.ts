import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateFundPDF = (
  history: any[],
  summary: any,
  sigName: string,
  sigDesignation: string,
) => {
  if (!history) return;

  const pdf = new jsPDF("p", "mm", "a4") as any;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const now = new Date();

  // ১. ওয়াটারমার্ক
  pdf.saveGraphicsState();
  pdf.setGState(new (pdf as any).GState({ opacity: 0.03 }));
  for (let x = 10; x < pageWidth; x += 40) {
    for (let y = 10; y < pageHeight; y += 40) {
      try {
        pdf.addImage("/images/SEAL.png", "PNG", x, y, 15, 15);
      } catch (e) {}
    }
  }
  pdf.restoreGraphicsState();

  // ২. সেন্টার টেক্সট ওয়াটারমার্ক
  pdf.saveGraphicsState();
  pdf.setGState(new (pdf as any).GState({ opacity: 0.07 }));
  pdf.setFontSize(40);
  pdf.setFont(undefined, "bold");
  pdf.setTextColor(100);
  pdf.text("ALHAMDULILLAH FOUNDATION", pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: 45,
  });
  pdf.restoreGraphicsState();

  // ৩. হেডার
  pdf.setFontSize(22);
  pdf.setTextColor(41, 128, 185);
  pdf.text("AF MONTHLY FUND INVOICE", pageWidth / 2, 20, { align: "center" });

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

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
    styles: { fontSize: 9, cellPadding: 3 },
  });

  const finalTableY = (pdf as any).lastAutoTable.finalY + 10;
  pdf.setFont(undefined, "bold");
  pdf.setTextColor(0);
  pdf.text(
    `Total Current Balance: ${(summary?.currentBalance || 0).toLocaleString()} BDT`,
    pageWidth - 14,
    finalTableY,
    { align: "right" },
  );

  // ৪. সিগনেচার ও সিল
  const footerY = pageHeight - 45;
  try {
    pdf.addImage(
      "/images/SEAL.png",
      "PNG",
      pageWidth - 60,
      footerY - 20,
      45,
      45,
    );
    pdf.setTextColor(39, 174, 96);
    pdf.setFontSize(16);
    pdf.text("VERIFIED", pageWidth - 38, footerY + 2, {
      align: "center",
      angle: -15,
    });
  } catch (e) {}

  pdf.setTextColor(0, 0, 150);
  pdf.setFont("times", "italic", "bold");
  pdf.setFontSize(18);
  pdf.text(sigName, 14, footerY);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(0);
  pdf.text("________________________", 14, footerY + 2);
  pdf.text(sigDesignation || "Authorized Person", 14, footerY + 8);

  const blobURL = pdf.output("bloburl");
  window.open(blobURL, "_blank");
};
