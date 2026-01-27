"use client";

import {
  Home,
  Inbox,
  Search,
  Users,
  BookOpen,
  Tag,
  Video,
  LogOut,
  FolderOpen,
  Boxes,
  Layers,
  Truck,
  ShoppingCart,
  BarChart3,
  ShieldCheck,
  Settings,
  Wallet,
  FolderKanban,
  CreditCard,
  Image,
  Bell,
  Trash2,
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
  SidebarFooter, // Added SidebarHeader
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout, UserRole } from "@/redux/features/auth/authSlice";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
}


export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.MODERATOR,
      UserRole.USER,
    ],
  },

  // ===== Funds =====
  {
    title: "Funds",
    url: "/dashboard/funds",
    icon: Wallet,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR],
  },

  // ===== User Management =====
  {
    title: "Members",
    url: "/dashboard/users",
    icon: Users,
    roles: [UserRole.SUPER_ADMIN],
  },

  // ===== Projects =====
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderKanban,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR],
  },

  // ===== Payments =====
  {
    title: "Payments",
    url: "/dashboard/payments",
    icon: CreditCard,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR],
  },

  // ===== Banners =====
  {
    title: "Banners",
    url: "/dashboard/banners",
    icon: Image,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR],
  },

   // ===== Notice =====
  {
    title: "Notice",
    url: "/dashboard/notices",
    icon: Bell,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },

  // ===== Trash =====
  {
    title: "Trash",
    url: "/dashboard/trash",
    icon: Trash2,
    roles: [UserRole.SUPER_ADMIN],
  },


  // ===== Settings =====
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.MODERATOR,
      UserRole.USER,
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

export function AppSidebar({ user }: AppSidebarProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Clear Redux
    dispatch(logout());

    // 3. Notify and Redirect
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <Sidebar>
      {/* --- Profile Header Section --- */}

      <SidebarHeader className="border-b border-sidebar-border/50 pb-6 mb-2 px-6 pt-8 bg-sidebar-accent/5">
        <Link
          href="/"
          className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
        >
          <Avatar className="h-12 w-12 border-2 border-primary/20 shrink-0 shadow-lg">
            <AvatarImage src={user?.profilePhoto} alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col overflow-hidden text-left">
            <span className="text-base font-bold truncate text-sidebar-foreground">
              {user?.name}
            </span>
            <span className="text-xs text-primary font-medium uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-bold uppercase tracking-widest text-sidebar-foreground/40 mb-2">
            {t("common.dashboard")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems
                .filter((item) => item.roles.includes(user?.role))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`h-11 px-4 rounded-xl transition-all duration-200 hover:bg-primary/10 hover:text-primary active:scale-[0.98]`}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 font-medium"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/50 bg-sidebar-accent/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full h-11 justify-start gap-3 rounded-xl font-bold bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 shadow-sm"
            >
              <LogOut className="w-5 h-5" />
              <span>{t("common.logout")}</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
