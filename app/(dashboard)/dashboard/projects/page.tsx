"use client";

//==================================================================================
//                               PROJECTS MANAGEMENT
//==================================================================================
// Description: Page for viewing and managing all foundation projects.
// Features: Search, Status filtering, Progress tracking, and Action controls.
//==================================================================================

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

export default function ProjectsPage() {
  //======================   STATE & HOOKS   ===============================
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: projects, isLoading } = useGetProjectsQuery({
    status: filterStatus === "all" ? undefined : filterStatus,
  });

  const [deleteProject] = useDeleteProjectMutation();

  //======================   FILTERING LOGIC   ===============================
  const filteredProjects =
    projects?.data?.filter((project: any) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }) || [];

  //======================   EVENT HANDLERS   ===============================
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      try {
        await deleteProject(id).unwrap();
        toast.success("Project deleted successfully");
      } catch (error) {
        toast.error("Failed to delete project. Please try again.");
      }
    }
  };

  //======================   SUB-COMPONENTS   ===============================
  const ProjectCard = ({ project }: { project: any }) => {
    const progress = Math.min(
      ((project.raisedAmount || 0) / (project.targetAmount || 1)) * 100,
      100,
    );

    return (
      <div className="relative group">
        <Link href={`/dashboard/projects/${project._id}`}>
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer border-muted/60 hover:border-primary/50 bg-card/50 backdrop-blur-sm group-hover:-translate-y-1">
            {/* Project Thumbnail */}
            <div className="h-48 bg-muted overflow-hidden relative">
              <img
                src={project.thumbnail || "/placeholder.svg"}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-3 right-3 z-10">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md ${
                    project.status === "ongoing"
                      ? "bg-emerald-500/90 text-white"
                      : project.status === "upcoming"
                        ? "bg-amber-500/90 text-white"
                        : "bg-slate-500/90 text-white"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>

            <div className="p-5">
              {/* Project Header */}
              <div className="mb-4">
                <h3 className="font-bold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                  <MapPin size={12} className="text-primary" />
                  {project.location}
                </p>
              </div>

              {/* Project Description */}
              <p className="text-sm text-foreground/70 mb-5 line-clamp-2 h-10 leading-relaxed italic">
                {project.description}
              </p>

              {/* Funding Progress Tracking */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-bold uppercase tracking-tighter">
                    Funding Progress
                  </span>
                  <span className="font-black text-primary bg-primary/10 px-2 py-0.5 rounded text-[10px]">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full transition-all duration-1000 ease-out ${
                      progress > 80 ? "bg-emerald-500" : "bg-primary"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                  <div className="h-full w-full absolute top-0 left-0 bg-white/10 animate-pulse pointer-events-none" />
                </div>
              </div>

              {/* Project Analytics Summary */}
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-muted/50 text-center">
                <div className="space-y-0.5">
                  <p className="text-foreground font-black text-sm">
                    ৳{((project.raisedAmount || 0) / 1000).toFixed(0)}k
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
                    Raised
                  </p>
                </div>
                <div className="space-y-0.5 border-x border-muted/30">
                  <div className="flex items-center justify-center gap-0.5">
                    <Users size={10} className="text-primary" />
                    <p className="text-foreground font-black text-sm">
                      {project.members?.length || project.memberCount || 0}
                    </p>
                  </div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
                    Members
                  </p>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-0.5">
                    <Target size={10} className="text-amber-500" />
                    <p className="text-foreground font-black text-sm">
                      ৳{((project.targetAmount || 0) / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
                    Target
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Link>

        {/* Management Actions (Visible on Hover) */}
        <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
          <Link href={`/dashboard/projects/${project._id}/edit`}>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full shadow-xl bg-background/95 hover:bg-white text-blue-600 border border-blue-100"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8 rounded-full shadow-xl hover:scale-110 transition-transform"
            onClick={(e) => handleDelete(e, project._id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  };

  //======================   MAIN RENDER   ===============================
  if (isLoading) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
        <p className="text-muted-foreground font-medium animate-pulse italic">
          Synchronizing projects...
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Page Header Section */}
        <AFPageHeader
          title="Foundation Projects"
          description="Track ongoing initiatives, manage contributions, and plan upcoming projects."
          action={
            <Link href="/dashboard/projects/new">
              <Button className="w-full sm:px-6 shadow-lg shadow-primary/20 rounded-xl hover:scale-105 transition-transform group font-bold">
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                Launch Project
              </Button>
            </Link>
          }
        />

        {/* Global Search & Advanced Filtering */}
        <AFSearchFilters
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Filter projects by title, region, or objectives..."
          filters={[
            { label: "All Works", value: "all" },
            { label: "Upcoming", value: "upcoming" },
            { label: "Ongoing", value: "ongoing" },
            { label: "Completed", value: "expired" },
          ]}
          activeFilter={filterStatus}
          onFilterChange={setFilterStatus}
        />

        {/* Dynamic Project Content Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProjects.map((project: any) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <Card className="p-24 text-center border-dashed border-2 bg-muted/10 rounded-3xl">
            <div className="bg-muted/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground font-bold text-lg">
              No matching projects discovered
            </p>
            <p className="text-sm text-muted-foreground/60 mb-6">
              Try adjusting your filters or search terms.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
              }}
              className="rounded-full px-8"
            >
              Reset All Filters
            </Button>
          </Card>
        )}
      </div>
    </Suspense>
  );
}
