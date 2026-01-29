"use client";
import ProjectCard from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { useGetProjectsQuery } from "@/redux/features/project/projectApi";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ProjectsSection() {
    const { t } = useTranslation();

  //====================== API ======================

  const { data: projectsData } = useGetProjectsQuery({});

  return (
    <section id="projects" className=" py-12 md:py-24 px-4 md:px-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16">
        {t("project.featured")}
      </h2>

      <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {projectsData?.data?.slice(0, 4).map((project: any) => (
          <ProjectCard key={project?._id} project={project} />
        ))}
      </div>
      <div className="text-center mt-12">
        <Link href="/projects">
          <Button variant="outline" size="lg" className="rounded-full px-8">
            {t("project.exploreAll")} <ArrowRight className="ml-2" size={18} />
          </Button>
        </Link>
      </div>
    </section>
  );
}
