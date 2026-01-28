"use client";

import ProjectForm from "@/components/projects/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Create New Project
        </h1>
        <p className="text-foreground/60 mt-1">
          Fill in the details to launch a new investment project
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
