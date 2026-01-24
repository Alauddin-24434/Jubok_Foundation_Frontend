'use client'

import { useState, Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Plus, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Loading from './loading'

interface Payment {
  id: string
  projectName: string
  amount: number
  method: string
  status: 'pending' | 'paid' | 'failed'
  date: string
  transactionId?: string
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const searchParams = useSearchParams()

  const payments: Payment[] = [
    {
      id: '1',
      projectName: 'Fish Farming Project',
      amount: 15000,
      method: 'bKash',
      status: 'paid',
      date: '2024-01-20',
      transactionId: 'TXN001',
    },
    {
      id: '2',
      projectName: 'Real Estate Venture',
      amount: 25000,
      method: 'Bank Transfer',
      status: 'paid',
      date: '2024-01-18',
      transactionId: 'TXN002',
    },
    {
      id: '3',
      projectName: 'Dairy Farm Initiative',
      amount: 10000,
      method: 'Nagad',
      status: 'pending',
      date: '2024-01-25',
    },
    {
      id: '4',
      projectName: 'Agricultural Development',
      amount: 5000,
      method: 'Card',
      status: 'failed',
      date: '2024-01-22',
    },
  ]

  const filteredPayments = payments.filter((payment) =>
    payment.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalInvested = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-primary" />
      case 'pending':
        return <Clock className="h-5 w-5 text-secondary" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-primary/10 text-primary'
      case 'pending':
        return 'bg-secondary/10 text-secondary'
      case 'failed':
        return 'bg-destructive/10 text-destructive'
      default:
        return ''
    }
  }

  const StatCard = ({ label, value, color }: any) => (
    <Card className="p-6">
      <p className="text-foreground/60 text-sm font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
    </Card>
  )

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payments</h1>
            <p className="text-foreground/60 mt-1">View and manage your investments</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Investment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard
            label="Total Invested"
            value={`৳${(totalInvested / 1000).toFixed(0)}k`}
            color="text-primary"
          />
          <StatCard
            label="Pending Payments"
            value={`৳${(pendingAmount / 1000).toFixed(0)}k`}
            color="text-secondary"
          />
          <StatCard
            label="Total Transactions"
            value={payments.length}
            color="text-foreground"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          {['all', 'paid', 'pending', 'failed'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
                <Input
                  placeholder="Search by project or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground/70">Project</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground/70">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground/70">Method</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground/70">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground/70">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments
                      .filter(p => tab === 'all' || p.status === tab)
                      .map((payment) => (
                        <tr key={payment.id} className="border-b border-border hover:bg-muted/50 transition">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-foreground">{payment.projectName}</p>
                              {payment.transactionId && (
                                <p className="text-xs text-foreground/60 mt-1">ID: {payment.transactionId}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 font-semibold text-foreground">
                            ৳{payment.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-sm text-foreground/70">{payment.method}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(payment.status)}
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusLabel(payment.status)}`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-foreground/70">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4">
                            {payment.status === 'pending' && (
                              <Button variant="outline" size="sm">
                                Complete
                              </Button>
                            )}
                            {payment.status === 'failed' && (
                              <Button variant="outline" size="sm">
                                Retry
                              </Button>
                            )}
                            {payment.status === 'paid' && (
                              <Button variant="ghost" size="sm">
                                Receipt
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {filteredPayments.filter(p => tab === 'all' || p.status === tab).length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-foreground/60">No {tab !== 'all' ? tab : ''} payments found</p>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Suspense>
  )
}
