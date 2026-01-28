"use client";

//==================================================================================
//                               APPLICATION SIDEBAR
//==================================================================================
// Description: Primary navigation component for the dashboard.
// Features: Role-based filtering, active state awareness, and smooth animations.
//==================================================================================

import {
  Home,
  Users,
  LogOut,
  ShieldCheck,
  Settings,
  Wallet,
  FolderKanban,
  CreditCard,
  Image as ImageIcon,
  Bell,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout, UserRole } from "@/redux/features/auth/authSlice";
import { useLogoutUserMutation } from "@/redux/features/auth/authApi";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import baseApi from "@/redux/baseApi";

//======================   SIDEBAR CONFIGURATION   ===============================
interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Command Center",
    url: "/dashboard",
    icon: Home,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.MEMBER,
      UserRole.GUEST,
    ],
  },
  {
    title: "Member Directory",
    url: "/dashboard/users",
    icon: Users,
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    title: "Financial Audit",
    url: "/dashboard/payments",
    icon: CreditCard,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Foundation Vault",
    url: "/dashboard/funds",
    icon: Wallet,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Notice Board",
    url: "/dashboard/notices",
    icon: Bell,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Capital Projects",
    url: "/dashboard/projects",
    icon: FolderKanban,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Marketing Assets",
    url: "/dashboard/banners",
    icon: ImageIcon,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Governance Board",
    url: "/dashboard/management",
    icon: ShieldCheck,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Identity Settings",
    url: "/dashboard/settings",
    icon: Settings,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.MEMBER,
      UserRole.GUEST,
    ],
  },
];

interface AppSidebarProps {
  user: {
    name: string;
    role: UserRole;
    profilePhoto?: string;
  };
}

//======================   COMPONENT LOGIC   ===============================
export function AppSidebar({ user }: AppSidebarProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      // 1. Call backend to clear cookie
      await logoutUser({}).unwrap();

      // 2. Clear Redux state
      dispatch(logout());

      // 3. Reset RTK Query cache
      dispatch(baseApi.util.resetApiState());

      // 4. Show success message
      toast.success("Security session terminated successfully");

      // 5. Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, still clear local state
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      router.push("/login");
    }
  };

  //======================   SUB-COMPONENTS   ===============================
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* 👤 LEADERSHIP IDENTITY PANEL */}
      <SidebarHeader className="pb-4 pt-8 px-3">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-90 transition-all group p-3 rounded-2xl bg-sidebar-accent/10 border border-sidebar-border/50 hover:bg-sidebar-accent/20 hover:shadow-md"
        >
          <div className="relative shrink-0">
            <Avatar className="h-12 w-12 border-2 border-primary/20 shrink-0 shadow-lg ring-offset-2 ring-primary/5 transition-all duration-500 rounded-2xl group-hover:rounded-xl">
              <AvatarImage
                src={user?.profilePhoto}
                alt={user?.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-black text-lg uppercase">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 border-2 border-sidebar rounded-full shadow-lg" />
          </div>

          <div className="flex flex-col overflow-hidden text-left">
            <span className="text-sm font-black tracking-tight text-sidebar-foreground group-hover:text-primary transition-colors truncate">
              {user?.name || "System User"}
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/70">
              {user?.role || "GUEST"}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* 🧭 SYSTEM NAVIGATION */}
      <SidebarContent className="px-3 py-2 scrollbar-none">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-sidebar-foreground/20 mb-3 h-auto">
            Strategic Oversight
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {sidebarItems
                .filter((item) => item.roles.includes(user?.role))
                .map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`h-9 px-4 rounded-xl transition-all duration-300 relative group/menu ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02] before:content-[''] before:absolute before:left-0 before:top-1/4 before:bottom-1/4 before:w-1 before:bg-white before:rounded-full"
                            : "text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-primary active:scale-[0.98]"
                        }`}
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-3 w-full"
                        >
                          <item.icon
                            className={`w-4 h-4 transition-all duration-300 ${isActive ? "scale-110" : "group-hover/menu:scale-110"}`}
                          />
                          <span
                            className={`text-xs font-bold tracking-tight transition-all duration-300 ${isActive ? "translate-x-1" : ""}`}
                          >
                            {item.title}
                          </span>
                          {isActive && (
                            <div className="ml-auto">
                              <ChevronRight size={12} className="opacity-50" />
                            </div>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 🚪 SECURITY TERMINATION */}
      <SidebarFooter className="p-3">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full h-10 justify-center gap-2 rounded-xl font-black text-[10px] transition-all duration-500 group border-destructive/20 text-destructive hover:bg-destructive hover:text-white"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-500" />
          <span className="uppercase tracking-[0.1em]">Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
