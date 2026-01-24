'use client'

import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, MapPin, Users, TrendingUp, FileText } from 'lucide-react'
import Link from 'next/link'

export default function ProjectDetailsPage() {
  const params = useParams()
  const projectId = params.id

  // Mock data - replace with actual API call
  const project = {
    id: projectId,
    name: 'Fish Farming Project',
    description: 'Modern fish farming facility with sustainable practices and community benefits',
    status: 'ongoing',
    location: 'Dhaka, Bangladesh',
    target: 75000,
    raised: 45000,
    members: 12,
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    details: {
      about: 'This is a comprehensive fish farming project focused on sustainable aquaculture practices. The project aims to provide high-quality fish products while maintaining environmental standards.',
      benefits: [
        'Stable income streams',
        'Community employment',
        'Sustainable food production',
        'Market expansion opportunities'
      ],
      risks: [
        'Market price fluctuations',
        'Environmental factors',
        'Supply chain disruptions'
      ]
    },
    members: [
      { id: 1, name: 'Ahmed Hassan', position: 'President', joinedDate: '2024-01-15' },
      { id: 2, name: 'Fatima Khan', position: 'Treasurer', joinedDate: '2024-01-16' },
      { id: 3, name: 'Mohammad Ali', position: 'Secretary', joinedDate: '2024-01-17' },
    ],
    timeline: [
      { date: '2024-01-15', title: 'Project Launch', description: 'Official project kickoff' },
      { date: '2024-03-15', title: 'Construction Phase', description: 'Facility construction begins' },
      { date: '2024-06-15', title: 'Operations Start', description: 'Production operations commence' },
    ]
  }

  const investmentProgress = (project.raised / project.target) * 100

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="text-foreground/60 mt-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {project.location}
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-foreground/60 mb-1">Funding Progress</p>
            <p className="text-2xl font-bold text-primary">{Math.round(investmentProgress)}%</p>
            <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${investmentProgress}%` }}
              />
            </div>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-foreground/60 mb-1">Amount Raised</p>
            <p className="text-2xl font-bold text-foreground">৳{(project.raised / 1000).toFixed(0)}k</p>
            <p className="text-xs text-foreground/60 mt-3">of ৳{(project.target / 1000).toFixed(0)}k target</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-foreground/60 mb-1">Active Members</p>
            <p className="text-2xl font-bold text-foreground">{project.members.length}</p>
            <p className="text-xs text-foreground/60 mt-3">investors participating</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-foreground/60 mb-1">Timeline</p>
            <p className="text-lg font-bold text-foreground">9 months</p>
            <p className="text-xs text-foreground/60 mt-3">remaining</p>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-3">About This Project</h3>
            <p className="text-foreground/70">{project.details.about}</p>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Benefits</h4>
                <ul className="space-y-2">
                  {project.details.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-foreground/70">
                      <span className="text-primary mt-1.5">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Risk Factors</h4>
                <ul className="space-y-2">
                  {project.details.risks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-foreground/70">
                      <span className="text-accent mt-1.5">!</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Investment Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-foreground/60">Total Target</span>
                <span className="font-semibold">৳{(project.target / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-foreground/60">Currently Raised</span>
                <span className="font-semibold">৳{(project.raised / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-foreground/60">Remaining</span>
                <span className="font-semibold">৳{((project.target - project.raised) / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-foreground/60">Start Date</span>
                <span className="font-semibold">{new Date(project.startDate).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          <Button className="w-full" size="lg">
            Invest in This Project
          </Button>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Project Members</h3>
            <div className="space-y-3">
              {project.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-foreground/60">{member.position}</p>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/60">
                    Joined {new Date(member.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Request to Join</h3>
            <p className="text-foreground/70 mb-4">Interested in joining this project?</p>
            <Button className="w-full">
              Send Join Request
            </Button>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-6">Project Timeline</h3>
            <div className="space-y-6">
              {project.timeline.map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mt-2" />
                    {idx < project.timeline.length - 1 && (
                      <div className="w-0.5 h-24 bg-border my-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm text-foreground/60">{new Date(event.date).toLocaleDateString()}</p>
                    <h4 className="font-semibold text-foreground mt-1">{event.title}</h4>
                    <p className="text-foreground/70 text-sm mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
