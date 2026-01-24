'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TrendingUp, Users, FolderOpen, CreditCard, ArrowRight } from 'lucide-react'

interface DashboardStats {
  projectsActive: number
  totalInvested: number
  membersCount: number
  pendingApprovals: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    projectsActive: 0,
    totalInvested: 0,
    membersCount: 0,
    pendingApprovals: 0,
  })
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setStats({
        projectsActive: 3,
        totalInvested: 150000,
        membersCount: 24,
        pendingApprovals: 2,
      })
      setRecentProjects([
        {
          id: 1,
          name: 'Fish Farming Project',
          status: 'ongoing',
          progress: 65,
          members: 12,
          raised: 45000,
          target: 75000,
        },
        {
          id: 2,
          name: 'Agricultural Development',
          status: 'upcoming',
          progress: 0,
          members: 8,
          raised: 0,
          target: 50000,
        },
        {
          id: 3,
          name: 'Real Estate Venture',
          status: 'ongoing',
          progress: 45,
          members: 4,
          raised: 105000,
          target: 250000,
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const StatCard = ({ icon: Icon, label, value, trend }: any) => (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-foreground/60 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      {trend && (
        <p className="text-xs text-primary font-medium mt-4">
          {trend}
        </p>
      )}
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
        <p className="text-foreground/60">Here's your investment overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          icon={FolderOpen}
          label="Active Projects"
          value={stats.projectsActive}
          trend="2 new this month"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Invested"
          value={`৳${(stats.totalInvested / 1000).toFixed(0)}k`}
          trend="↑ 12% from last month"
        />
        <StatCard
          icon={Users}
          label="Network Members"
          value={stats.membersCount}
          trend="5 joined this month"
        />
        <StatCard
          icon={CreditCard}
          label="Pending Approvals"
          value={stats.pendingApprovals}
          trend="Action needed"
        />
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Your Projects</h2>
          <Link href="/dashboard/projects">
            <Button variant="outline" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">Loading projects...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {recentProjects.map((project) => (
              <Card key={project.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    <p className="text-sm text-foreground/60 mt-1">
                      {project.members} members
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'ongoing'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary/10 text-secondary'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-foreground/60">Progress</span>
                      <span className="text-sm font-medium text-foreground">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Investment Info */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">
                      ৳{(project.raised / 1000).toFixed(0)}k / ৳{(project.target / 1000).toFixed(0)}k raised
                    </span>
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
