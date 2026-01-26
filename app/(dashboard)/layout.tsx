"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Languages, Sun, Moon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  // Redirect logic
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.status === 'inactive' && user.role !== 'SuperAdmin') {
      // Allow inactive SuperAdmin for testing purposes if needed, otherwise remove the check
      // For now, strict check:
      router.push("/payment-required");
    }
  }, [user, router]);

  if (!user) {
    return null; 
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <main className="w-full flex flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-bold capitalize tracking-tight hidden sm:block">
              {user?.role} {t("common.dashboard")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
             {/* Theme Toggle */}
             <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>

              {/* Language Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Languages className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { i18n.changeLanguage("en"); localStorage.setItem("lang", "en"); }}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { i18n.changeLanguage("bn"); localStorage.setItem("lang", "bn"); }}>
                    বাংলা
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-primary/10 to-accent/10 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}