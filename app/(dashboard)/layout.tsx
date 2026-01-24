"use client";
import { useEffect } from "react"; // 1. Import useEffect
import { useRouter } from "next/navigation"; // 2. Import useRouter

import React from "react";
import { useSelector } from "react-redux";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector(selectCurrentUser);
  const router = useRouter();

  // 3. Redirect logic
  useEffect(() => {
    if (!user) {
      router.push("/login"); // Or your specific login route
    }
  }, [user, router]);

  // 4. Prevent flicker: Don't render anything if user is missing
  if (!user) {
    return null; 
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <main className="w-full flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-semibold capitalize">
            {user?.role} Dashboard
          </h1>
        </header>
        
        <div className="p-4 md:p-8 bg-white">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}