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

  // ===== Projects =====
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderOpen,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR],
  },

   // ===== Banners =====
  {
    title: "Banners",
    url: "/dashboard/banners",
    icon: FolderOpen,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR],
  },

     // ===== Members =====
  {
    title: "Members",
    url: "/dashboard/members",
    icon: FolderOpen,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR],
  },


  // ===== Payments =====
  {
    title: "payments",
    url: "/dashboard/payments",
    icon: Boxes,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR],
  },

 
 

  // ===== Reports =====
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: BarChart3,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },

  // ===== User Management =====
  {
    title: "User Management",
    url: "/dashboard/users",
    icon: Users,
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
    role: "admin" | "user";
    profilePhoto?: string;
  };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const dispatch = useDispatch();

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

      <SidebarHeader className="border-b border-sidebar-border pb-4 mb-2">
        {/* Wrap the content with Link to make it clickable */}
        <Link
          // Dynamic route based on role
          href="/"
          className="flex items-center gap-3 px-4 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors rounded-lg group"
        >
          <Avatar className="h-10 w-10 border border-primary/20 shrink-0">
            <AvatarImage src={user?.profilePhoto} alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col overflow-hidden text-left">
            <span className="text-sm font-semibold truncate text-sidebar-foreground group-hover:text-primary transition-colors">
              {user?.name}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems
                .filter((item) => item.roles.includes(user?.role))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className="flex items-center space-x-2"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* --- Logout Footer Section --- */}
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full text-red-500 bg-gray-50 border cursor-pointer hover:text-red-600 hover:bg-red-50/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
