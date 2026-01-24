'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface ProjectAdmin {
  id: string
  name: string
  location: string
  status: 'upcoming' | 'ongoing' | 'expired'
  createdBy: string
  members: number
  raised: number
  target: number
  createdDate: string
}

const AdminProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const searchParams = useSearchParams()

  const projects: ProjectAdmin[] = [
    {
      id: '1',
      name: 'Fish Farming Project',
      location: 'Dhaka, Bangladesh',
      status: 'ongoing',
      createdBy: 'Mohammad Ali',
      members: 12,
      raised: 45000,
      target: 75000,
      createdDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Agricultural Development',
      location: 'Sylhet, Bangladesh',
      status: 'upcoming',
      createdBy: 'Ahmed Hassan',
      members: 8,
      raised: 0,
      target: 50000,
      createdDate: '2024-01-20',
    },
    {
      id: '3',
      name: 'Real Estate Venture',
      location: 'Chittagong, Bangladesh',
      status: 'ongoing',
      createdBy: 'Fatima Khan',
      members: 24,
      raised: 105000,
      target: 250000,
      createdDate: '2024-01-10',
    },
    {
      id: '4',
      name: 'Dairy Farm Initiative',
      location: 'Khulna, Bangladesh',
      status: 'ongoing',
      createdBy: 'Mohammad Ali',
      members: 15,
      raised: 78000,
      target: 120000,
      createdDate: '2024-01-05',
    },
  ]

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-primary/10 text-primary'
      case 'upcoming':
        return 'bg-secondary/10 text-secondary'
      case 'expired':
        return 'bg-muted text-foreground/60'
      default:
        return 'bg-muted text-foreground/60'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects Management</h1>
          <p className="text-foreground/60 mt-1">Manage all platform projects</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'upcoming', 'ongoing', 'expired'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Project Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Members</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Funding</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Created By</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => {
                const fundingPercent = Math.round((project.raised / project.target) * 100)
                return (
                  <tr key={project.id} className="border-b border-border hover:bg-muted/30 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{project.name}</p>
                        <p className="text-xs text-foreground/60">Created {new Date(project.createdDate).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{project.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{project.members}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          ৳{(project.raised / 1000).toFixed(0)}k / ৳{(project.target / 1000).toFixed(0)}k
                        </p>
                        <div className="w-32 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${fundingPercent}%` }}
                          />
                        </div>
                        <p className="text-xs text-foreground/60 mt-1">{fundingPercent}%</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{project.createdBy}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredProjects.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-foreground/60">No projects found matching your criteria</p>
        </Card>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminProjectsPage />
    </Suspense>
  )
}
