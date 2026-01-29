"use client";

//==================================================================================
//                               DASHBOARD LAYOUT
//==================================================================================
// Description: Main layout for all dashboard pages, including sidebar and header.
// Features: Theme toggle, Language switcher, User feedback, and Responsive design.
//==================================================================================

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { IUser, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Languages, Sun, Moon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PublicNotificationBell } from "@/components/shared/notificationBell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //======================   STATE & HOOKS   ===============================
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  //======================   RENDER HELPERS   ===============================
  return (
    <SidebarProvider>
      {/* Sidebar Component */}
      <AppSidebar user={user as IUser} />

      <SidebarInset className="flex flex-col min-h-screen overflow-hidden">
        {/*======================   DASHBOARD HEADER   ===============================*/}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <div className="h-6 w-[1px] bg-muted-foreground/20 mx-1 hidden sm:block" />
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70 hidden xs:block">
              {user?.role} {t("common.dashboard")}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <PublicNotificationBell />
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full hover:bg-primary/10 h-9 w-9"
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-slate-700" />
              )}
            </Button>

            {/* Language Switcher Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 h-9 w-9"
                >
                  <Languages className="h-4 w-4 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[180px] rounded-2xl shadow-2xl border-primary/10 p-2"
              >
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl font-bold py-3"
                  onClick={() => {
                    i18n.changeLanguage("en");
                    localStorage.setItem("lang", "en");
                  }}
                >
                  English (US)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl font-bold py-3"
                  onClick={() => {
                    i18n.changeLanguage("bn");
                    localStorage.setItem("lang", "bn");
                  }}
                >
                  বাংলা (Bengali)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/*======================   DASHBOARD CONTENT   ===============================*/}
        <div className="flex-1 p-4 md:p-6 lg:p-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 overflow-y-auto">
          <div className="mx-auto max-w-7xl w-full">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
