'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { useGetMeQuery, useGetStatsQuery } from '@/redux/features/auth/authApi'
import { useGetProjectsQuery } from '@/redux/features/project/projectApi'

export default function DashboardPage() {
  // const { data: user, isLoading: userLoading } = useGetMeQuery({})
  // const { data: stats } = useGetStatsQuery({})
  // const { data: projectsData } = useGetProjectsQuery({ limit: 5 })

  // if (userLoading) {
  //   return <p className="p-6">Loading...</p>
  // }

  // const isPending = user?.status === 'pending'

  // 🔒 PENDING USER → SHOW ONLY WARNING PAGE
  // if (isPending) {
  //   return (
  //     <div className="min-h-[70vh] flex items-center justify-center px-4">
  //       <Card className="max-w-xl w-full border-destructive/40 bg-destructive/5">
  //         <div className="p-10 flex flex-col items-center text-center gap-5">
  //           <AlertTriangle className="h-12 w-12 text-destructive" />

  //           <h2 className="text-2xl font-bold text-destructive">
  //             Account Approval Pending
  //           </h2>

  //           <p className="text-sm text-destructive/80 leading-relaxed">
  //             Your account is currently pending approval.
  //             <br />
  //             To activate your account, please confirm your payment.
  //           </p>

  //           <Link href="/payment">
  //             <Button variant="destructive" size="lg">
  //               Confirm Payment
  //             </Button>
  //           </Link>
  //         </div>
  //       </Card>
  //     </div>
  //   )
  // }

  // 👇 APPROVED USER → NORMAL DASHBOARD
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold mb-2">
          {/* Welcome back, {user?.name || 'User'}! */}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your dashboard overview
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">Stats Card 1</Card>
        <Card className="p-6">Stats Card 2</Card>
        <Card className="p-6">Stats Card 3</Card>
      </div>

      <div>
        <Card className="p-6">
          Projects will be shown here
        </Card>
      </div>
    </div>
  )
}
