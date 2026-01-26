'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, CreditCard, CheckCircle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useVerifyPaymentMutation, useGetMyPaymentsQuery, useInitiatePaymentMutation } from "@/redux/features/payment/paymentApi"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Wallet } from "lucide-react"

export default function PaymentRequiredPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation()
  const [initiatePayment, { isLoading: isInitiating }] = useInitiatePaymentMutation()
  const { data: myPayments, isLoading: isLoadingPayments } = useGetMyPaymentsQuery({})
  
  const [formData, setFormData] = useState({
    bkashNumber: '',
    transactionId: ''
  })

  // Check if there is a pending membership payment
  const pendingPayment = myPayments?.find(
    (p: any) => p.status === 'pending'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await verifyPayment(formData).unwrap()
      toast.success("Payment submitted for verification")
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to submit payment")
    }
  }

  const handleSSLPayment = async () => {
    try {
      const response = await initiatePayment({
        amount: 500,
        method: 'bkash', // SSLCommerz will handle actual method selection
        type: 'membership'
      }).unwrap()
      
      if (response.gatewayUrl) {
        window.location.href = response.gatewayUrl
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to initiate payment")
    }
  }

  if (isLoadingPayments) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (pendingPayment) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6 shadow-2xl border-amber-500/20">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Verification Pending</h1>
            <p className="text-foreground/60 text-sm">
              We have received your payment request.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-mono font-bold">{pendingPayment.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bkash Number:</span>
              <span className="font-mono font-bold">{pendingPayment.bkashNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{new Date(pendingPayment.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <p className="text-xs text-foreground/40">
            An admin will review and activate your account shortly.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[90vh] p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="max-w-xl w-full p-0 overflow-hidden shadow-2xl border-none ring-1 ring-primary/10">
        <div className="bg-primary p-8 text-primary-foreground text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Activation Required</h1>
          <p className="text-primary-foreground/80">
            Please complete your membership payment to access the platform.
          </p>
        </div>

        <div className="p-8">
          <Tabs defaultValue="ssl" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-muted/50">
              <TabsTrigger value="ssl" className="gap-2 text-base data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Zap className="w-4 h-4" />
                Express Pay
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2 text-base data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Wallet className="w-4 h-4" />
                Manual Pay
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ssl" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">Recommended Method</p>
                    <h3 className="text-xl font-bold text-blue-900">SSLCommerz Gateway</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-700">Amount to pay</p>
                    <p className="text-2xl font-black text-blue-900">৳500</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" /> Instant Activation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" /> Multiple Payment Options (Cards, Mobile Banking)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" /> Secure Encryption
                  </li>
                </ul>
              </div>

              <Button 
                onClick={handleSSLPayment}
                disabled={isInitiating}
                className="w-full h-14 text-lg font-bold gap-3 shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all"
              >
                {isInitiating ? (
                  <>Redirecting...</>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    Pay with SSLCommerz
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="manual" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl space-y-4">
                <h3 className="font-bold text-amber-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Manual Verification Process
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-700">bKash (Personal)</p>
                    <p className="text-sm font-bold text-amber-900">017XXXXXXXX</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-700">Nagad (Personal)</p>
                    <p className="text-sm font-bold text-amber-900">018XXXXXXXX</p>
                  </div>
                </div>
                <p className="text-xs text-amber-800 italic">
                  * Send <span className="font-bold">৳500</span> using "Send Money" and paste info below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Sender's Mobile Number</Label>
                  <Input 
                    placeholder="01XXXXXXXXX" 
                    value={formData.bkashNumber}
                    onChange={(e) => setFormData({...formData, bkashNumber: e.target.value})}
                    required
                    className="h-12 text-lg font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Transaction ID (TrxID)</Label>
                  <Input 
                    placeholder="X9A3J... (from SMS)" 
                    value={formData.transactionId}
                    onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                    required
                    className="h-12 text-lg font-mono font-bold uppercase"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isVerifying}
                  variant="outline"
                  className="w-full h-14 text-lg font-bold gap-2 border-2 hover:bg-amber-50"
                >
                  {isVerifying ? 'Submitting...' : 'Submit Manual Payment'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-muted/30 p-6 text-center border-t">
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            By making a payment, you agree to our terms of service. Account status will be updated automatically for gateway payments.
          </p>
        </div>
      </Card>
    </div>
  )
}
