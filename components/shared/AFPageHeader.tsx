"use client";

import { ReactNode } from "react";

//======================   AFPageHeader Props Interface   ===============================
interface AFPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

//======================   Reusable Page Header Component   ===============================
export function AFPageHeader({ title, description, action }: AFPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  );
}
