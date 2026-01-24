'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Shield, Trash2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'moderator' | 'admin' | 'super_admin'
  joinDate: string
  status: 'active' | 'inactive' | 'suspended'
  projectsCount: number
  investmentAmount: number
}

const Loading = () => null

export default function AdminUsersPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const users: User[] = [
    {
      id: '1',
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      phone: '+880 1234567890',
      role: 'user',
      joinDate: '2024-01-10',
      status: 'active',
      projectsCount: 3,
      investmentAmount: 45000,
    },
    {
      id: '2',
      name: 'Fatima Khan',
      email: 'fatima@example.com',
      phone: '+880 9876543210',
      role: 'moderator',
      joinDate: '2024-01-05',
      status: 'active',
      projectsCount: 2,
      investmentAmount: 75000,
    },
    {
      id: '3',
      name: 'Mohammad Ali',
      email: 'mohammad@example.com',
      phone: '+880 5555555555',
      role: 'admin',
      joinDate: '2023-12-20',
      status: 'active',
      projectsCount: 5,
      investmentAmount: 150000,
    },
    {
      id: '4',
      name: 'Aisha Begum',
      email: 'aisha@example.com',
      phone: '+880 4444444444',
      role: 'user',
      joinDate: '2024-01-15',
      status: 'inactive',
      projectsCount: 1,
      investmentAmount: 20000,
    },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-destructive/10 text-destructive'
      case 'admin':
        return 'bg-primary/10 text-primary'
      case 'moderator':
        return 'bg-secondary/10 text-secondary'
      default:
        return 'bg-muted text-foreground/60'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-primary/10 text-primary'
      case 'inactive':
        return 'bg-muted text-foreground/60'
      case 'suspended':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted text-foreground/60'
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
            <p className="text-foreground/60 mt-1">Manage platform users and roles</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'user', 'moderator', 'admin'].map((role) => (
              <Button
                key={role}
                variant={roleFilter === role ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter(role)}
                className="capitalize"
              >
                {role}
              </Button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Projects</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Investment</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-foreground/60">Joined {new Date(user.joinDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{user.projectsCount}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      ৳{(user.investmentAmount / 1000).toFixed(0)}k
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="Change Role">
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredUsers.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-foreground/60">No users found matching your criteria</p>
          </Card>
        )}
      </div>
    </Suspense>
  )
}
