'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, CheckCircle, Clock, X, UserCheck, Eye, Phone, Mail } from 'lucide-react'
import { useGetPendingMembershipPaymentsQuery, useVerifyPaymentMutation, useApprovePaymentMutation } from '@/redux/features/payment/paymentApi'
import { useUpdateUserMutation } from '@/redux/features/user/userApi'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PendingMembersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: pendingPayments, isLoading } = useGetPendingMembershipPaymentsQuery({})
  const [updateUser] = useUpdateUserMutation()
  const [approvePayment] = useApprovePaymentMutation()
  const [verifyPayment] = useVerifyPaymentMutation()

  const filteredPayments = pendingPayments?.filter((p: any) => 
    p.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.userId?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleApprove = async (paymentId: string, userId: string) => {
    try {
      await approvePayment(paymentId).unwrap()
      toast.success('Member activated successfully')
    } catch (error) {
      toast.error('Failed to approve payment')
    }
  }

  const handleStatusChange = async (userId: string, status: string) => {
    try {
      await updateUser({ id: userId, data: { status } }).unwrap()
      toast.success(`User status updated to ${status}`)
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  if (isLoading) return <div className="p-8 text-center text-foreground">Loading pending requests...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Membership Approvals</h1>
        <p className="text-foreground/60 mt-1">Review manual payment submissions and activate members</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
          <Input
            placeholder="Search by name, email or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[250px]">Member</TableHead>
                <TableHead>Payment Info</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments?.length > 0 ? (
                filteredPayments.map((payment: any) => (
                  <TableRow key={payment._id} className="hover:bg-muted/30 transition-colors border-b last:border-none">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={payment.userId?.avatar} />
                          <AvatarFallback>{payment.userId?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{payment.userId?.name}</p>
                          <p className="text-xs text-muted-foreground">{payment.userId?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline" className="font-mono text-[10px] uppercase">
                          {payment.method}
                        </Badge>
                        <p className="text-sm font-bold text-primary">{payment.transactionId}</p>
                        <p className="text-xs text-muted-foreground">Sender: {payment.bkashNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold">৳{payment.amount}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{new Date(payment.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">{new Date(payment.createdAt).toLocaleTimeString()}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Member Details</DialogTitle>
                              <DialogDescription>
                                Verify identity before activation
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage src={payment.userId?.avatar} />
                                  <AvatarFallback>{payment.userId?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="text-lg font-bold">{payment.userId?.name}</h4>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="w-3 h-3" /> {payment.userId?.email}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="w-3 h-3" /> {payment.userId?.phone || 'N/A'}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h5 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Payment Verification</h5>
                                <div className="p-4 border rounded-lg space-y-2">
                                  <div className="flex justify-between">
                                    <span>Transaction ID:</span>
                                    <span className="font-mono font-bold text-primary">{payment.transactionId}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Method:</span>
                                    <span className="capitalize font-medium">{payment.method}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Sender Number:</span>
                                    <span className="font-medium">{payment.bkashNumber}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DialogFooter className="gap-2 sm:justify-end">
                              <Button variant="destructive" onClick={() => handleStatusChange(payment.userId?._id, 'suspended')}>
                                <X className="w-4 h-4 mr-2" /> Suspend User
                              </Button>
                              <Button onClick={() => handleApprove(payment._id, payment.userId?._id)}>
                                <UserCheck className="w-4 h-4 mr-2" /> Approve & Activate
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700 h-9 px-4"
                          onClick={() => handleApprove(payment._id, payment.userId?._id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Approve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Clock className="h-12 w-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No pending requests found</p>
                      <p className="text-sm">All clear! No members are waiting for approval.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
