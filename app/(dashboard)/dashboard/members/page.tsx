'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, CheckCircle, Clock, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface JoinRequest {
  id: string
  name: string
  email: string
  projectName: string
  status: 'pending' | 'approved' | 'rejected'
  requestDate: string
}

const Loading = () => null

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const searchParams = useSearchParams()

  const joinRequests: JoinRequest[] = [
    {
      id: '1',
      name: 'Karim Ahmed',
      email: 'karim@example.com',
      projectName: 'Fish Farming Project',
      status: 'pending',
      requestDate: '2024-01-25',
    },
    {
      id: '2',
      name: 'Aisha Begum',
      email: 'aisha@example.com',
      projectName: 'Fish Farming Project',
      status: 'approved',
      requestDate: '2024-01-20',
    },
    {
      id: '3',
      name: 'Rashid Khan',
      email: 'rashid@example.com',
      projectName: 'Real Estate Venture',
      status: 'pending',
      requestDate: '2024-01-24',
    },
  ]

  const filteredRequests = joinRequests.filter((req) =>
    req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const JoinRequestCard = ({ request }: { request: JoinRequest }) => (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">
              {request.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{request.name}</h3>
            <p className="text-sm text-foreground/60">{request.email}</p>
            <p className="text-xs text-foreground/50 mt-2">
              Applied to: <span className="text-foreground">{request.projectName}</span>
            </p>
            <p className="text-xs text-foreground/50 mt-1">
              Requested on {new Date(request.requestDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {request.status === 'pending' && (
            <>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </>
          )}
          {request.status === 'approved' && (
            <span className="flex items-center gap-1 text-primary text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Approved
            </span>
          )}
          {request.status === 'rejected' && (
            <span className="flex items-center gap-1 text-destructive text-sm font-medium">
              <X className="h-4 w-4" />
              Rejected
            </span>
          )}
        </div>
      </div>
    </Card>
  )

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Members & Requests</h1>
          <p className="text-foreground/60 mt-1">Manage join requests and project members</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">Join Requests</TabsTrigger>
            <TabsTrigger value="members">My Memberships</TabsTrigger>
          </TabsList>

          {/* Join Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <JoinRequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Clock className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/60">No join requests found</p>
              </Card>
            )}
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <div className="space-y-4">
              {[
                { projectName: 'Fish Farming Project', position: 'Member', joinedDate: '2024-01-15' },
                { projectName: 'Real Estate Venture', position: 'Treasurer', joinedDate: '2024-01-20' },
                { projectName: 'Dairy Farm Initiative', position: 'President', joinedDate: '2024-01-10' },
              ].map((member, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{member.projectName}</h3>
                      <p className="text-sm text-foreground/60 mt-1">
                        Position: <span className="font-medium">{member.position}</span>
                      </p>
                      <p className="text-xs text-foreground/50 mt-2">
                        Joined {new Date(member.joinedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Project
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Suspense>
  )
}
