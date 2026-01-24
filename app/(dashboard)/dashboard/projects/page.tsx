'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Loading from './loading'
import { useGetProjectsQuery, useDeleteProjectMutation } from '@/redux/features/project/projectApi'
import { toast } from 'sonner'
import { Edit2, Trash2 } from 'lucide-react'

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const searchParams = useSearchParams()

  const { data: projects, isLoading } = useGetProjectsQuery({
    status: filterStatus === 'all' ? undefined : filterStatus
  })

  const [deleteProject] = useDeleteProjectMutation()

  const filteredProjects = projects?.filter((project: any) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  }) || []

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id).unwrap()
        toast.success('Project deleted successfully')
      } catch (error) {
        toast.error('Failed to delete project')
      }
    }
  }

  const ProjectCard = ({ project }: { project: any }) => (
    <div className="relative group">
      <Link href={`/dashboard/projects/${project._id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer">
          {/* Thumbnail */}
          {project.thumbnail && (
            <div className="h-40 bg-muted overflow-hidden">
              <img
                src={project.thumbnail || "/placeholder.svg"}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{project.name}</h3>
                <p className="text-xs text-foreground/60 mt-1">{project.location}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                project.status === 'ongoing'
                  ? 'bg-primary/10 text-primary'
                  : project.status === 'upcoming'
                  ? 'bg-secondary/10 text-secondary'
                  : 'bg-muted text-foreground/60'
              }`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-foreground/60 mb-4 line-clamp-2">{project.description}</p>

            {/* Progress */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-foreground/60">Funding Progress</span>
                <span className="font-medium text-foreground">
                  {Math.round((project.totalInvestment / project.amount) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min((project.totalInvestment / project.amount) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="text-foreground font-semibold">৳{(project.totalInvestment / 1000).toFixed(0)}k</p>
                <p className="text-xs text-foreground/60">Raised</p>
              </div>
              <div>
                <p className="text-foreground font-semibold">{project.memberCount}</p>
                <p className="text-xs text-foreground/60">Members</p>
              </div>
              <div>
                <p className="text-foreground font-semibold">৳{(project.amount / 1000).toFixed(0)}k</p>
                <p className="text-xs text-foreground/60">Target</p>
              </div>
            </div>
          </div>
        </Card>
      </Link>
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link href={`/dashboard/projects/${project._id}/edit`}>
          <Button size="icon" variant="secondary" className="h-8 w-8">
            <Edit2 className="h-4 w-4" />
          </Button>
        </Link>
        <Button size="icon" variant="destructive" className="h-8 w-8" onClick={(e) => handleDelete(e, project._id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  if (isLoading) return <div>Loading projects...</div>

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-foreground/60 mt-1">Discover and manage investment projects</p>
          </div>
          <Link href="/dashboard/projects/new" className="w-full sm:w-auto">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
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
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredProjects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-foreground/60">No projects found matching your criteria</p>
          </Card>
        )}
      </div>
    </Suspense>
  )
}
