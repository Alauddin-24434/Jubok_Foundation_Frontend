'use client'

//==================================================================================
//                               DASHBOARD OVERVIEW
//==================================================================================
// Description: Main entry point for the dashboard after login.
// Features: Statistical overview, pending account handling, and project summaries.
//==================================================================================

import Link from 'next/link'
import { AlertTriangle, LayoutDashboard, Database, CreditCard } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { useGetMeQuery, useGetStatsQuery } from '@/redux/features/auth/authApi'
import { useGetProjectsQuery } from '@/redux/features/project/projectApi'
import { AFPageHeader } from '@/components/shared/AFPageHeader'

export default function DashboardPage() {
  //======================   API HOOKS & DATA   ===============================
  const { data: user, isLoading: userLoading } = useGetMeQuery({})
  const { data: stats } = useGetStatsQuery({})
  const { data: projectsData } = useGetProjectsQuery({ limit: 5 })

  //======================   RENDER LOGIC   ===============================
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-primary/20 rounded-full"></div>
          <p className="text-muted-foreground font-medium italic">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const isPending = user?.status === 'PENDING'

  //======================   PENDING ACCOUNT VIEW   ===============================
  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="max-w-xl w-full border-destructive/20 bg-destructive/5 backdrop-blur-sm overflow-hidden shadow-2xl">
          <div className="p-8 sm:p-12 flex flex-col items-center text-center gap-6">
            <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center animate-bounce">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-destructive tracking-tight">
                Account Approval Pending
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Your account is currently under review. To activate full access, please complete your registration payment.
              </p>
            </div>

            <Link href="/payment" className="w-full sm:w-auto">
              <Button variant="destructive" size="lg" className="w-full sm:px-12 rounded-full font-bold shadow-lg shadow-destructive/20 hover:scale-105 transition-transform">
                Complete Payment Now
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  //======================   STANDARD DASHBOARD VIEW   ===============================
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Page Header */}
      <AFPageHeader 
        title={`Welcome back, ${user?.name || 'User'}!`}
        description="Here's a quick look at your foundation's current status and activities."
      />

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Total Projects</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Database size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Total Funds</p>
              <h3 className="text-2xl font-bold">৳ 450,000</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">New Requests</p>
              <h3 className="text-2xl font-bold">5</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity / Projects Preview */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-8 border-dashed border-2 flex flex-col items-center justify-center text-center min-h-[300px] bg-muted/5">
          <div className="bg-primary/5 p-4 rounded-full mb-4">
            <LayoutDashboard className="h-8 w-8 text-primary/40" />
          </div>
          <h3 className="text-lg font-bold">Project Visualizations Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            We are currently integrating data visualizations for your projects. Stay tuned for real-time analytics and tracking.
          </p>
        </Card>
      </div>
    </div>
  )
}

