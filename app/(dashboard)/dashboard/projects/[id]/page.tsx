"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  TrendingUp, 
  FileText, 
  Calendar, 
  Smartphone, 
  Tag, 
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { 
  useGetProjectQuery, 
  useAddProjectMemberMutation, 
  useRemoveProjectMemberMutation 
} from "@/redux/features/project/projectApi";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const user = useSelector(selectCurrentUser);

  const { data: projectRes, isLoading, error } = useGetProjectQuery(projectId);
  const [addMember, { isLoading: isAddingMember }] = useAddProjectMemberMutation();
  const [removeMember] = useRemoveProjectMemberMutation();

  const project = projectRes?.data || projectRes; // Handle different wrapper formats

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto mt-20">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or you don't have access.</p>
        <Button asChild>
          <Link href="/dashboard/projects">Back to Projects</Link>
        </Button>
      </Card>
    );
  }

  const investmentProgress = Math.min(
    ((project.totalInvestment || 0) / (project.initialInvestment || 1)) * 100,
    100
  );

  const handleAddMe = async () => {
    try {
      await addMember({
        projectId,
        memberData: {
          user: user?._id,
          role: "Member",
          responsibility: "Investor",
          active: true
        }
      }).unwrap();
      toast.success("Joined project successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to join project");
    }
  };

  const handleRemoveMember = async (memberUserId: string) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeMember({ projectId, userId: memberUserId }).unwrap();
      toast.success("Member removed");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove member");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Back Button */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Project Dashboard</span>
      </Link>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className={`px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest ${
              project.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700' : 
              project.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {project.status}
            </Badge>
            <Badge variant="outline" className="px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest border-primary/20 text-primary">
              {project.category}
            </Badge>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {project.name}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {project.location}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Started {new Date(project.startDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              {project.contactNumber}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
            <Button asChild variant="outline" className="font-bold rounded-xl h-12 border-gray-200">
              <Link href={`/dashboard/projects/${projectId}/edit`}>Edit Project</Link>
            </Button>
          )}
          <Button className="font-black rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
            Invest Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-gray-100/50 p-1.5 rounded-2xl mb-6 flex overflow-x-auto h-auto no-scrollbar">
              <TabsTrigger value="overview" className="flex-1 rounded-xl font-black text-xs uppercase py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="members" className="flex-1 rounded-xl font-black text-xs uppercase py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Participants ({project.memberCount || 0})
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex-1 rounded-xl font-black text-xs uppercase py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Vitals & Media
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                  <CardTitle className="text-lg font-black uppercase tracking-widest text-gray-700 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    Narrative & Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="prose prose-emerald max-w-none text-gray-600 leading-relaxed font-medium">
                    {project.description}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-3xl border-gray-100 shadow-sm border-l-4 border-l-emerald-500">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-black text-emerald-700 uppercase tracking-widest text-xs">Vitals</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-emerald-50/50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-emerald-600">Category</span>
                        <span className="text-xs font-black text-gray-900">{project.category}</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-gray-500">Start Date</span>
                        <span className="text-xs font-black text-gray-900">{new Date(project.startDate).toDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-gray-100 shadow-sm border-l-4 border-l-blue-500">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-black text-blue-700 uppercase tracking-widest text-xs">Authority</h3>
                    <div className="flex items-center gap-4 bg-blue-50/30 p-3 rounded-2xl">
                       <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-sm">
                        {project.createdBy?.name?.[0].toUpperCase()}
                       </div>
                       <div>
                         <p className="text-xs font-black text-gray-900">{project.createdBy?.name}</p>
                         <p className="text-[10px] font-bold text-blue-600">Project Architect</p>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <Card className="rounded-3xl border-gray-100 shadow-sm">
                <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between bg-gray-50/30">
                  <CardTitle className="text-lg font-black uppercase tracking-widest text-gray-700 flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    Member Roster
                  </CardTitle>
                  <Button 
                    onClick={handleAddMe} 
                    disabled={isAddingMember}
                    className="rounded-xl font-black text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Join This Project
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-50 py-4">
                    {project.members && project.members.length > 0 ? (
                      project.members.map((member: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between px-8 py-5 hover:bg-gray-50/50 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-sm">
                              {member.user?.name?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="font-black text-gray-900 text-sm">{member.user?.name || 'Anonymous'}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="secondary" className="px-2 py-0 h-5 text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border-none">
                                  {member.role || 'Member'}
                                </Badge>
                                <span className="text-[10px] font-bold text-gray-400">{member.responsibility}</span>
                              </div>
                            </div>
                          </div>
                          
                          {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?._id === member.user?._id) && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveMember(member.user?._id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center space-y-4">
                        <Users className="w-12 h-12 text-gray-200 mx-auto" />
                        <p className="text-sm font-bold text-gray-400">No members participating yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                  <CardHeader className="p-6 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-500">Media Assets</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="aspect-video w-full rounded-2xl bg-muted overflow-hidden relative group">
                      <img 
                        src={project.thumbnail} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <p className="text-white text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Main Showcase</p>
                      </div>
                    </div>
                  </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Financials */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-gray-100 shadow-2xl overflow-hidden sticky top-24">
            <CardHeader className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
               <div className="relative z-10 space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Fiscal Standing</p>
                 <h2 className="text-4xl font-black">
                   ৳{(project.totalInvestment || 0).toLocaleString()}
                 </h2>
                 <p className="text-[11px] font-bold opacity-70 italic">Capital accumulated from {project.memberCount || 0} participants</p>
               </div>
               <TrendingUp className="absolute bottom-[-20%] right-[-10%] w-40 h-40 text-black/10 -rotate-12" />
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Growth</p>
                   <p className="text-lg font-black text-primary">{Math.round(investmentProgress)}%</p>
                </div>
                <Progress value={investmentProgress} className="h-4 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-primary rounded-full" />
                </Progress>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                       <Badge className="bg-blue-100 text-blue-700 p-2 rounded-xl"><Clock className="w-4 h-4" /></Badge>
                       <span className="font-bold text-gray-500">Target Capital</span>
                    </div>
                    <span className="font-black text-gray-900">৳{(project.initialInvestment || 0).toLocaleString()}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                       <Badge className="bg-emerald-100 text-emerald-700 p-2 rounded-xl"><CheckCircle2 className="w-4 h-4" /></Badge>
                       <span className="font-bold text-gray-500">Raised</span>
                    </div>
                    <span className="font-black text-emerald-600">৳{(project.totalInvestment || 0).toLocaleString()}</span>
                 </div>
                 <Separator className="bg-gray-50" />
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                       <Badge className="bg-rose-50 text-rose-600 p-2 rounded-xl"><AlertCircle className="w-4 h-4" /></Badge>
                       <span className="font-bold text-gray-500">Delta</span>
                    </div>
                    <span className="font-black text-rose-600">৳{Math.max(0, (project.initialInvestment || 0) - (project.totalInvestment || 0)).toLocaleString()}</span>
                 </div>
              </div>

              <Button className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] shadow-xl">
                 Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
