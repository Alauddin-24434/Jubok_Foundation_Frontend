'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TrendingUp, Users, FolderOpen, CreditCard, ArrowRight } from 'lucide-react'
import { useGetStatsQuery, useGetMeQuery } from '@/redux/features/auth/authApi'
import { useGetProjectsQuery } from '@/redux/features/project/projectApi'

export default function DashboardPage() {
  const { data: user } = useGetMeQuery({})
  const { data: stats, isLoading: statsLoading } = useGetStatsQuery({})
  const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery({ limit: 5 })

  const isAdmin = user?.role === 'SuperAdmin' || user?.role === 'Admin'

  const StatCard = ({ icon: Icon, label, value, trend }: any) => (
    <Card className="p-6 bg-card/50 backdrop-blur-md border-border/50 hover:border-primary/30 transition-all shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-foreground/60 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      {trend && (
        <p className="text-xs text-primary font-medium mt-4 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </p>
      )}
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-foreground/60">
          {isAdmin ? "Here's the platform's overall analytics" : "Here's your investment overview"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          icon={FolderOpen}
          label={isAdmin ? "Active Projects" : "My Projects"}
          value={stats?.projectsActive || 0}
          trend={statsLoading ? "Loading..." : "Live data"}
        />
        <StatCard
          icon={TrendingUp}
          label={isAdmin ? "Total Investment" : "My Investment"}
          value={`৳${(stats?.totalInvested || 0).toLocaleString()}`}
          trend={statsLoading ? "Loading..." : "Real-time"}
        />
        <StatCard
          icon={Users}
          label={isAdmin ? "Total Members" : "Network"}
          value={stats?.membersCount || 0}
          trend={isAdmin ? "Registered users" : "Community"}
        />
        <StatCard
          icon={CreditCard}
          label={isAdmin ? "Pending Requests" : "My Pending"}
          value={stats?.pendingApprovals || 0}
          trend={stats?.pendingApprovals > 0 ? "Action needed" : "Up to date"}
        />
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{isAdmin ? "Recent Projects" : "Your Active Projects"}</h2>
          <Link href="/dashboard/projects">
            <Button variant="outline" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {projectsLoading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6 h-32 animate-pulse bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {projectsData?.data?.slice(0, 3).map((project: any) => {
              const progress = Math.min((project.raisedAmount / project.targetAmount) * 100, 100) || 0;
              return (
                <Card key={project._id} className="p-6 bg-card/50 backdrop-blur-md border-border/50 hover:border-primary/30 transition-all shadow-md group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                      <p className="text-sm text-foreground/60 mt-1">
                        {project.members?.length || project.memberCount || 0} members • {project.category}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'ongoing'
                        ? 'bg-primary/10 text-primary'
                        : project.status === 'upcoming'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-foreground/60">Target Progress</span>
                        <span className="text-sm font-medium text-foreground">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Investment Info */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/60">
                        ৳{(project.raisedAmount || 0).toLocaleString()} / ৳{(project.targetAmount || 0).toLocaleString()} raised
                      </span>
                      <Link href={`/dashboard/projects/${project._id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}
            {(!projectsData?.data || projectsData.data.length === 0) && (
            <div className="text-center py-20 bg-background/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-border/50 transition-all">
                <p className="text-muted-foreground">No projects found</p>
                {isAdmin && (
                  <Link href="/dashboard/projects/new">
                    <Button variant="link" className="mt-2 text-primary">
                      Create your first project
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
