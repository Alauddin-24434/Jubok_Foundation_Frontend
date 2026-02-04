"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  MapPin,
  Users,
  Target,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Suspense } from "react";
import Loading from "./loading";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "@/redux/features/project/projectApi";
import { toast } from "sonner";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { AFSearchFilters } from "@/components/shared/AFSearchFilters";
import { AFSectionTitle } from "@/components/shared/AFSectionTitle";
import { AFPagination } from "@/components/shared/AFPagination";

export default function ProjectsPage() {
  //======================   STATE & HOOKS   ===============================
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: projectsResponse, isLoading } = useGetProjectsQuery({
    page,
    limit,
    status: filterStatus === "all" ? undefined : filterStatus,
    search: searchQuery || undefined,
  });

  const [deleteProject] = useDeleteProjectMutation();

  const projects = projectsResponse?.data || [];
  const meta = projectsResponse?.meta || { totalPages: 1, total: 0 };

  //======================   EVENT HANDLERS   ===============================
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      const toastId = toast.loading("Decommissioning project...");
      try {
        await deleteProject(id).unwrap();
        toast.success("Project identity purged successfully", { id: toastId });
      } catch (error) {
        toast.error("Failed to delete project. Protocol violation.", { id: toastId });
      }
    }
  };

  //======================   SUB-COMPONENTS   ===============================
  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <Card className="p-4 border-none bg-card/40 backdrop-blur-md shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</p>
        <p className="text-xl font-black">{value}</p>
      </div>
    </Card>
  );

  const ProjectCard = ({ project }: { project: any }) => {
    const progress = Math.min(
      ((project.totalInvestment || 0) / (project.initialInvestment || 1)) * 100,
      100,
    );

    return (
      <Card className="group overflow-hidden border-none bg-card/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 rounded-[2rem] flex flex-col h-full">
        {/* Project Thumbnail Area */}
        <div className="h-56 overflow-hidden relative">
          <img
            src={project.thumbnail || "/placeholder.svg"}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60" />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-xl border border-white/20 ${
                project.status === "ongoing"
                  ? "bg-emerald-500 text-white"
                  : project.status === "upcoming"
                    ? "bg-amber-500 text-white"
                    : "bg-slate-500 text-white"
              }`}
            >
              {project.status}
            </span>
          </div>

          {/* Location Badge */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-white text-[10px] font-bold border border-white/10">
              <MapPin size={10} className="text-primary-foreground" />
              {project.location}
            </div>
          </div>
        </div>

        <div className="p-7 flex flex-col flex-1">
          {/* Title & Description */}
          <div className="mb-6 flex-1">
            <Link href={`/dashboard/projects/${project._id}`}>
              <h3 className="text-xl font-black text-foreground mb-3 line-clamp-1 hover:text-primary transition-colors cursor-pointer">
                {project.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Progress Section */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Capital Raised</p>
                <p className="text-lg font-black text-primary">৳{(project.totalInvestment || 0).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-primary/60 bg-primary/5 px-2 py-0.5 rounded-md inline-block mb-1">
                  {Math.round(progress)}%
                </p>
              </div>
            </div>
            <div className="relative h-2.5 w-full bg-muted/30 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                  progress > 80 ? "bg-emerald-500" : "bg-primary"
                }`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-[-20deg]" />
              </div>
            </div>
          </div>

          {/* Meta Stats */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <Users size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Partners</p>
                <p className="text-sm font-black">{project.memberCount || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/5 flex items-center justify-center text-amber-500">
                <Target size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Goal</p>
                <p className="text-sm font-black">৳{(project.initialInvestment || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Hover Actions */}
          <div className="mt-8 flex gap-3">
             <Link href={`/dashboard/projects/${project._id}`} className="flex-1">
                <Button className="w-full h-11 rounded-2xl font-black text-xs uppercase tracking-widest bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all">
                  Deep Dive
                </Button>
             </Link>
             <div className="flex gap-2">
                <Link href={`/dashboard/projects/${project._id}/edit`}>
                  <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl border-muted hover:border-blue-500/50 hover:bg-blue-500/5 text-blue-500">
                    <Edit2 size={16} />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={(e) => handleDelete(e, project._id)}
                  className="h-11 w-11 rounded-2xl border-muted hover:border-destructive/50 hover:bg-destructive/5 text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
             </div>
          </div>
        </div>
      </Card>
    );
  };

  //======================   MAIN RENDER   ===============================
  if (isLoading) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="h-20 w-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.3em] animate-pulse">
          Retrieving Portfolio...
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
        {/* Page Header */}
        <AFPageHeader
          title="Strategic Portfolio"
          description="High-impact foundation initiatives driving sustainable growth across agriculture, technology, and real estate."
          action={
            <Link href="/dashboard/projects/new">
              <Button className="h-14 px-8 shadow-2xl shadow-primary/30 rounded-[1.25rem] hover:scale-105 transition-all group font-black uppercase text-xs tracking-widest bg-primary">
                <Plus className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                Inaugurate Project
              </Button>
            </Link>
          }
        />

        {/* Dynamic Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Briefcase} label="Total Assets" value={meta.total || 0} color="blue" />
          <StatCard icon={TrendingUp} label="Ongoing" value={projects.filter((p: any) => p.status === 'ongoing').length} color="emerald" />
          <StatCard icon={Clock} label="Upcoming" value={projects.filter((p: any) => p.status === 'upcoming').length} color="amber" />
          <StatCard icon={CheckCircle2} label="Completed" value={projects.filter((p: any) => p.status === 'expired').length} color="slate" />
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          <AFSectionTitle 
            title="Portfolio Overview" 
            subtitle="Analyze and track the performance of all community-backed investment projects."
            badge="Live Feed"
          />

          {/* Filtering & Search Area */}
          <div className="bg-card/30 backdrop-blur-md p-6 rounded-[2.5rem] border border-muted/20 shadow-sm">
            <AFSearchFilters
              searchValue={searchQuery}
              onSearchChange={(val) => {
                setSearchQuery(val);
                setPage(1);
              }}
              searchPlaceholder="Query by project identity, geological location, or strategic aims..."
              filters={[
                { label: "All Assets", value: "all" },
                { label: "In Pipeline", value: "upcoming" },
                { label: "Active Operations", value: "ongoing" },
                { label: "Archived", value: "expired" },
              ]}
              activeFilter={filterStatus}
              onFilterChange={(val) => {
                setFilterStatus(val);
                setPage(1);
              }}
            />
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {projects.map((project: any) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>

              {/* Pagination Infrastructure */}
              <AFPagination 
                currentPage={page}
                totalPages={meta.totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          ) : (
            <Card className="p-32 text-center border-none bg-card/20 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-muted/30">
              <div className="bg-primary/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Target className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-3">
                No Assets Discovered
              </h3>
              <p className="text-muted-foreground/60 mb-10 max-w-sm mx-auto font-medium">
                The current query did not match any projects in the foundation ledger.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                  setPage(1);
                }}
                className="rounded-2xl px-12 h-12 font-black uppercase text-[10px] tracking-widest border-primary/20 hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5"
              >
                Clear All Constraints
              </Button>
            </Card>
          )}
        </div>
      </div>
    </Suspense>
  );
}
