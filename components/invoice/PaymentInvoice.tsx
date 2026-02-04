import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Calendar, CreditCard, User, Mail, Phone, MapPin, Hash, DollarSign, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoiceProps {
  payment: {
    _id: string;
    transactionId: string;
    amount: number;
    method: string;
    purpose: string;
    paymentStatus: string;
    paidAt?: string;
    createdAt: string;
    userId: {
      name: string;
      email: string;
      phone?: string;
      address?: string;
      cityState?: string;
      avatar?: string;
    };
  };
}

export const PaymentInvoice: React.FC<InvoiceProps> = ({ payment }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPurposeLabel = (purpose: string) => {
    const labels: Record<string, string> = {
      MEMBERSHIP_FEE: 'Membership Fee',
      MONTHLY_DONATION: 'Monthly Donation',
      PROJECT_DONATION: 'Project Donation',
    };
    return labels[purpose] || purpose;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PAID: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
      PENDING: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
      FAILED: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
      CANCELLED: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white',
    };
    return colors[status] || 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
  };

  const handleDownload = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${payment.transactionId}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', sans-serif; 
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          .header h1 { font-size: 32px; margin-bottom: 10px; }
          .header p { opacity: 0.9; }
          .status-badge {
            display: inline-block;
            padding: 8px 24px;
            border-radius: 50px;
            font-weight: bold;
            font-size: 14px;
            margin-top: 20px;
            background: ${payment.paymentStatus === 'PAID' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'};
            color: white;
          }
          .content { padding: 40px; }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 30px 0;
          }
          .info-item {
            padding: 20px;
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            border-radius: 12px;
            border-left: 4px solid #667eea;
          }
          .info-label {
            font-size: 12px;
            color: #6b7280;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 16px;
            font-weight: bold;
            color: #111827;
          }
          .amount-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 16px;
            text-align: center;
            margin: 30px 0;
          }
          .amount-section h2 { font-size: 48px; margin: 10px 0; }
          .footer {
            text-align: center;
            padding: 30px;
            background: #f9fafb;
            border-top: 2px solid #e5e7eb;
          }
          .footer p { color: #6b7280; font-size: 12px; margin: 5px 0; }
          hr { border: none; border-top: 2px solid #e5e7eb; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>🎯 Payment Invoice</h1>
            <p>Jubok Foundation - Official Receipt</p>
            <div class="status-badge">${payment.paymentStatus}</div>
          </div>
          
          <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
              <div class="info-label">Invoice ID</div>
              <div class="info-value" style="font-size: 18px; font-family: monospace;">${payment._id}</div>
            </div>

            <hr>

            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Transaction ID</div>
                <div class="info-value">${payment.transactionId}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Payment Method</div>
                <div class="info-value">${payment.method}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Purpose</div>
                <div class="info-value">${getPurposeLabel(payment.purpose)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Payment Date</div>
                <div class="info-value">${formatDate(payment.paidAt || payment.createdAt)}</div>
              </div>
            </div>

            <hr>

            <h3 style="color: #667eea; margin: 30px 0 20px;">Customer Details</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Name</div>
                <div class="info-value">${payment.userId.name}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">${payment.userId.email}</div>
              </div>
              ${payment.userId.phone ? `
              <div class="info-item">
                <div class="info-label">Phone</div>
                <div class="info-value">${payment.userId.phone}</div>
              </div>` : ''}
              ${payment.userId.address ? `
              <div class="info-item">
                <div class="info-label">Address</div>
                <div class="info-value">${payment.userId.address}${payment.userId.cityState ? ', ' + payment.userId.cityState : ''}</div>
              </div>` : ''}
            </div>

            <div class="amount-section">
              <div style="font-size: 14px; opacity: 0.9; text-transform: uppercase; letter-spacing: 2px;">Total Amount</div>
              <h2>৳${payment.amount.toLocaleString()}</h2>
              ${payment.paymentStatus === 'PAID' ? '<div style="margin-top: 10px;">✓ Payment Verified</div>' : ''}
            </div>
          </div>

          <div class="footer">
            <p>This is an official receipt from Jubok Foundation.</p>
            <p>For any queries, please contact our support team.</p>
            <p style="margin-top: 15px; font-family: monospace;">Generated on ${formatDate(new Date().toISOString())}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header with Gradient */}
      <div className="text-center space-y-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-3xl -z-10"></div>
        <div className="flex items-center justify-center gap-3">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Payment Invoice
        </h1>
        <p className="text-muted-foreground text-lg">Jubok Foundation - Official Receipt</p>
      </div>

      {/* Main Invoice Card */}
      <Card className="p-8 shadow-2xl border-none bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-950/30 dark:to-pink-950/30 backdrop-blur-xl">
        {/* Status Badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Invoice ID</p>
            <p className="text-lg font-black font-mono bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {payment._id}
            </p>
          </div>
          <Badge className={`${getStatusColor(payment.paymentStatus)} font-black uppercase px-6 py-3 text-sm shadow-lg`}>
            {payment.paymentStatus}
          </Badge>
        </div>

        <Separator className="my-6 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        {/* Transaction Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Transaction Details
            </h3>
            
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-l-4 border-blue-500">
              <Hash className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-bold">Transaction ID</p>
                <p className="font-bold font-mono text-blue-900 dark:text-blue-300">{payment.transactionId}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-l-4 border-purple-500">
              <CreditCard className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-bold">Payment Method</p>
                <p className="font-bold text-purple-900 dark:text-purple-300">{payment.method}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-l-4 border-emerald-500">
              <DollarSign className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-bold">Purpose</p>
                <p className="font-bold text-emerald-900 dark:text-emerald-300">{getPurposeLabel(payment.purpose)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-l-4 border-amber-500">
              <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-bold">Payment Date</p>
                <p className="font-bold text-amber-900 dark:text-amber-300">{formatDate(payment.paidAt || payment.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Customer Details
            </h3>
            
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-l-4 border-indigo-500">
              <User className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-bold">Name</p>
                <p className="font-bold text-indigo-900 dark:text-indigo-300">{payment.userId.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-l-4 border-pink-500">
              <Mail className="h-5 w-5 text-pink-600 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-bold">Email</p>
                <p className="font-bold text-pink-900 dark:text-pink-300 break-all">{payment.userId.email}</p>
              </div>
            </div>

            {payment.userId.phone && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30 border-l-4 border-cyan-500">
                <Phone className="h-5 w-5 text-cyan-600 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground font-bold">Phone</p>
                  <p className="font-bold text-cyan-900 dark:text-cyan-300">{payment.userId.phone}</p>
                </div>
              </div>
            )}

            {payment.userId.address && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-l-4 border-violet-500">
                <MapPin className="h-5 w-5 text-violet-600 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground font-bold">Address</p>
                  <p className="font-bold text-sm text-violet-900 dark:text-violet-300">{payment.userId.address}</p>
                  {payment.userId.cityState && (
                    <p className="text-xs text-muted-foreground mt-1">{payment.userId.cityState}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-6 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

        {/* Amount Section */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl p-8 border-4 border-white/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-xs font-bold text-white/80 uppercase tracking-[0.3em] mb-2">Total Amount</p>
              <p className="text-6xl font-black text-white drop-shadow-2xl">৳{payment.amount.toLocaleString()}</p>
            </div>
            {payment.paymentStatus === 'PAID' && (
              <div className="text-center bg-white/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30">
                <CheckCircle2 className="h-16 w-16 text-white mx-auto mb-3 drop-shadow-lg" />
                <p className="text-sm font-black text-white uppercase tracking-widest">Verified</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-purple-200/50">
          <p className="text-xs text-muted-foreground text-center">
            This is an official receipt from Jubok Foundation. For any queries, please contact our support team.
          </p>
          <p className="text-xs text-muted-foreground text-center mt-2 font-mono">
            Generated on {formatDate(new Date().toISOString())}
          </p>
        </div>
      </Card>

      {/* Download Button */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleDownload}
          size="lg"
          className="px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white rounded-2xl font-black text-base shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all hover:scale-105 active:scale-95"
        >
          <Download className="h-5 w-5 mr-3" />
          Download Invoice
        </Button>
      </div>
    </div>
  );
};
