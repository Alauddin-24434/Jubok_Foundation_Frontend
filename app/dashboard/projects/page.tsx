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

interface Project {
  id: string
  name: string
  description: string
  status: 'upcoming' | 'ongoing' | 'expired'
  location: string
  target: number
  raised: number
  members: number
  endDate: string
  thumbnail?: string
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const searchParams = useSearchParams()

  const projects: Project[] = [
    {
      id: '1',
      name: 'Fish Farming Project',
      description: 'Modern fish farming facility with sustainable practices',
      status: 'ongoing',
      location: 'Dhaka, Bangladesh',
      target: 75000,
      raised: 45000,
      members: 12,
      endDate: '2024-12-31',
      thumbnail: 'https://images.unsplash.com/photo-1574495173258-7686c3dd0b4e?w=400&h=300&fit=crop',
    },
    {
      id: '2',
      name: 'Agricultural Development',
      description: 'Organic vegetable farming cooperative',
      status: 'upcoming',
      location: 'Sylhet, Bangladesh',
      target: 50000,
      raised: 0,
      members: 8,
      endDate: '2025-03-31',
      thumbnail: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
    },
    {
      id: '3',
      name: 'Real Estate Venture',
      description: 'Residential complex development project',
      status: 'ongoing',
      location: 'Chittagong, Bangladesh',
      target: 250000,
      raised: 105000,
      members: 24,
      endDate: '2025-06-30',
      thumbnail: 'https://images.unsplash.com/photo-1486406146891-cd5c0b3a0b5f?w=400&h=300&fit=crop',
    },
    {
      id: '4',
      name: 'Dairy Farm Initiative',
      description: 'Modern dairy production facility',
      status: 'ongoing',
      location: 'Khulna, Bangladesh',
      target: 120000,
      raised: 78000,
      members: 15,
      endDate: '2025-09-30',
      thumbnail: 'https://images.unsplash.com/photo-1500595046891-cd5c0b3a0b5f?w=400&h=300&fit=crop',
    },
  ]

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const ProjectCard = ({ project }: { project: Project }) => (
    <Link href={`/dashboard/projects/${project.id}`}>
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
                {Math.round((project.raised / project.target) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${Math.min((project.raised / project.target) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p className="text-foreground font-semibold">৳{(project.raised / 1000).toFixed(0)}k</p>
              <p className="text-xs text-foreground/60">Raised</p>
            </div>
            <div>
              <p className="text-foreground font-semibold">{project.members}</p>
              <p className="text-xs text-foreground/60">Members</p>
            </div>
            <div>
              <p className="text-foreground font-semibold">৳{(project.target / 1000).toFixed(0)}k</p>
              <p className="text-xs text-foreground/60">Target</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-foreground/60 mt-1">Discover and manage investment projects</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
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
            {filteredProjects.map((project) => (
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
