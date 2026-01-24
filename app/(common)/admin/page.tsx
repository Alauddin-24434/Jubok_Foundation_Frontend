'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { Users, FolderOpen, CreditCard, TrendingUp, AlertCircle } from 'lucide-react'

interface AdminStats {
  totalUsers: number
  activeProjects: number
  totalFunding: number
  pendingApprovals: number
}

export default function AdminPage() {
  const [stats] = useState<AdminStats>({
    totalUsers: 156,
    activeProjects: 24,
    totalFunding: 2450000,
    pendingApprovals: 8,
  })

  // Mock data for charts
  const fundingData = [
    { month: 'Jan', amount: 120000 },
    { month: 'Feb', amount: 210000 },
    { month: 'Mar', amount: 290000 },
    { month: 'Apr', amount: 345000 },
    { month: 'May', amount: 420000 },
    { month: 'Jun', amount: 465000 },
  ]

  const projectStatusData = [
    { name: 'Ongoing', value: 12, fill: '#0ea5e9' },
    { name: 'Upcoming', value: 8, fill: '#06b6d4' },
    { name: 'Completed', value: 4, fill: '#10b981' },
  ]

  const recentUsers = [
    { id: 1, name: 'Ahmed Hassan', role: 'User', joinDate: '2024-01-25', status: 'active' },
    { id: 2, name: 'Fatima Khan', role: 'User', joinDate: '2024-01-24', status: 'active' },
    { id: 3, name: 'Mohammad Ali', role: 'Moderator', joinDate: '2024-01-20', status: 'active' },
  ]

  const pendingRequests = [
    { id: 1, projectName: 'Dairy Farm Initiative', applicants: 5, priority: 'high' },
    { id: 2, projectName: 'Agricultural Development', applicants: 3, priority: 'medium' },
    { id: 3, projectName: 'Fish Farming Project', applicants: 1, priority: 'low' },
  ]

  const StatCard = ({ icon: Icon, label, value, change }: any) => (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-foreground/60 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          {change && (
            <p className="text-xs text-primary font-medium mt-2">{change}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-foreground/60 mt-1">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
          change="↑ 12 this month"
        />
        <StatCard
          icon={FolderOpen}
          label="Active Projects"
          value={stats.activeProjects}
          change="2 new projects"
        />
        <StatCard
          icon={CreditCard}
          label="Total Funding"
          value={`৳${(stats.totalFunding / 1000).toFixed(0)}k`}
          change="↑ 15% growth"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Reviews"
          value={stats.pendingApprovals}
          change="Action needed"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Funding Trend */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Monthly Funding Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fundingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-foreground)" opacity={0.7} />
                  <YAxis stroke="var(--color-foreground)" opacity={0.7} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-primary)', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Project Status */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Project Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-foreground">Recent Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Joined</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition">
                      <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-foreground/60">{user.role}</td>
                      <td className="px-6 py-4 text-sm text-foreground/60">{user.joinDate}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{request.projectName}</h3>
                    <p className="text-sm text-foreground/60 mt-1">
                      {request.applicants} pending applications
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      request.priority === 'high'
                        ? 'bg-destructive/10 text-destructive'
                        : request.priority === 'medium'
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-muted text-foreground/60'
                    }`}>
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                    </span>
                    <Button size="sm">Review</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-6">System Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Maintenance Mode</p>
                  <p className="text-sm text-foreground/60 mt-1">Temporarily disable user access</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">System Backup</p>
                  <p className="text-sm text-foreground/60 mt-1">Last backup: 2 hours ago</p>
                </div>
                <Button variant="outline" size="sm">Backup Now</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Email Configuration</p>
                  <p className="text-sm text-foreground/60 mt-1">Configure SMTP settings</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
