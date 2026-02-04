"use client";

import ProjectForm from "@/components/projects/ProjectForm";
import { AFPageHeader } from "@/components/shared/AFPageHeader";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <AFPageHeader
        title="Create New Project"
        description="Manage public notices & circulars"
      />

      <ProjectForm />
    </div>
  );
}
