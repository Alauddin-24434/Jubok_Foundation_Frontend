"use client";

//==================================================================================
//                               USER MANAGEMENT
//==================================================================================
// Description: Administrative interface for managing system users and access.
// Features: Role assignment, Permission control, Search/Filter, and Status badges.
//==================================================================================

import { useState } from "react";
import {
  Trash2,
  Shield,
  Loader2,
  UserCheck,
  UserX,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/redux/features/user/userApi";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/redux/features/auth/authSlice";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { AFSearchFilters } from "@/components/shared/AFSearchFilters";
import { AFDataTable } from "@/components/shared/AFDataTable";
import { AFModal } from "@/components/shared/AFModal";
import { Button } from "@/components/ui/button";

//======================   User Status Configuration   ===============================
export enum UserStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED",
}

const AVAILABLE_PERMISSIONS = [
  "manage_users",
  "manage_projects",
  "manage_banners",
  "view_analytics",
  "approve_payments",
  "manage_members",
];

export default function UsersPage() {
  //======================   STATE & HOOKS   ===============================
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: users, isLoading } = useGetUsersQuery({
    search: searchTerm,
    role: roleFilter === "all" ? undefined : roleFilter,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  //======================   EVENT HANDLERS   ===============================
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUser({ id: userId, data: { role: newRole } }).unwrap();
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to permanently delete this user profile?")) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("User removed successfully");
      } catch (error) {
        toast.error("Failed to delete user profile");
      }
    }
  };

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const openPermissionModal = (user: any) => {
    setEditingUser(user);
    setSelectedPermissions(user.permissions || []);
    setIsModalOpen(true);
  };

  const savePermissions = async () => {
    if (!editingUser) return;
    try {
      await updateUser({
        id: editingUser._id,
        data: { permissions: selectedPermissions },
      }).unwrap();
      toast.success(`Permissions updated for ${editingUser.name}`);
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      toast.error("Failed to update security permissions");
    }
  };

  //======================   UI HELPERS   ===============================
  const getStatusBadge = (status: string) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 uppercase text-[9px] font-black px-2 py-0.5">
            <UserCheck size={10} className="mr-1" />
            {status}
          </Badge>
        );
      case UserStatus.SUSPENDED:
        return (
          <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20 uppercase text-[9px] font-black px-2 py-0.5">
            <UserX size={10} className="mr-1" />
            {status}
          </Badge>
        );
      case UserStatus.PENDING:
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 uppercase text-[9px] font-black px-2 py-0.5"
          >
            <Loader2 size={10} className="mr-1 animate-spin" />
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="uppercase text-[9px] font-black px-2 py-0.5">
            {status}
          </Badge>
        );
    }
  };

  //======================   TABLE DEFINITION   ===============================
  const columns = [
    { 
      header: "User Identity", 
      cell: (user: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <UserIcon size={14} className="text-primary" />
            {user.name}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Mail size={12} />
            {user.email}
          </span>
        </div>
      )
    },
    {
      header: "System Role",
      cell: (user: any) => (
        <Select
          defaultValue={user.role}
          onValueChange={(value) => handleRoleChange(user._id, value)}
        >
          <SelectTrigger className="w-[120px] h-9 text-[11px] font-bold rounded-lg bg-background border-muted-foreground/20 focus:ring-primary/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value={UserRole.ADMIN} className="text-xs font-medium">Admin</SelectItem>
            <SelectItem value={UserRole.MEMBER} className="text-xs font-medium">Member</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      header: "Access Rights",
      cell: (user: any) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {user.permissions?.length > 0 ? (
            user.permissions.map((p: string) => (
              <Badge
                key={p}
                variant="secondary"
                className="text-[8px] px-1.5 h-4.5 capitalize font-black bg-primary/5 text-primary border-primary/10 tracking-tighter"
              >
                {p.replace(/_/g, " ")}
              </Badge>
            ))
          ) : (
            <span className="text-[10px] text-muted-foreground italic font-medium">
              Standard Access
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Verification",
      cell: (user: any) => getStatusBadge(user.status),
    },
    {
      header: "Actions",
      cell: (user: any) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border border-blue-100 cursor-pointer text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            onClick={() => openPermissionModal(user)}
            title="Modify Permissions"
          >
            <Shield className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border border-red-100 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            onClick={() => handleDelete(user._id)}
            title="Delete User"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  //======================   MAIN RENDER   ===============================
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <AFPageHeader
        title="User Governance"
        description="Monitor system accounts, adjust roles, and manage granular security permissions."
      />

      {/* Control & Filter Bar */}
      <AFSearchFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Find account by name or email hash..."
      >
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-background shadow-sm border-muted-foreground/20 font-bold text-sm">
            <SelectValue placeholder="System Role" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="font-medium">All User Roles</SelectItem>
            <SelectItem value={UserRole.ADMIN} className="font-medium">Administrator</SelectItem>
            <SelectItem value={UserRole.MEMBER} className="font-medium">Foundation Member</SelectItem>
          </SelectContent>
        </Select>
      </AFSearchFilters>

      {/* Data Visualization (Table) */}
      <div className="rounded-2xl overflow-hidden shadow-xl border border-muted/30">
        <AFDataTable
          columns={columns}
          data={users || []}
          isLoading={isLoading}
          emptyMessage="No security identities matching your search criteria."
        />
      </div>

      {/* Permission Security Modal */}
      <AFModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Escalated Access Controls"
        className="sm:max-w-[500px] rounded-3xl"
      >
        <div className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center">
              <Shield className="text-primary h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Managing Security for</p>
              <h4 className="font-black text-lg text-foreground">{editingUser?.name}</h4>
              <p className="text-xs text-muted-foreground">{editingUser?.email}</p>
            </div>
          </div>

          <div className="grid gap-3 py-2">
            {AVAILABLE_PERMISSIONS.map((permission) => (
              <div
                key={permission}
                className={`flex items-center space-x-3 p-4 rounded-2xl border transition-all duration-300 ${
                  selectedPermissions.includes(permission) 
                  ? "bg-primary/5 border-primary/30 shadow-sm" 
                  : "bg-background border-muted hover:border-muted-foreground/30"
                }`}
              >
                <Checkbox
                  id={permission}
                  checked={selectedPermissions.includes(permission)}
                  onCheckedChange={() => handlePermissionToggle(permission)}
                  className="h-5 w-5 rounded-md border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <Label
                  htmlFor={permission}
                  className="capitalize cursor-pointer flex-1 text-sm font-bold tracking-tight text-foreground/90"
                >
                  {permission.replace(/_/g, " ")}
                </Label>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-muted/50">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl px-6 font-bold order-2 sm:order-1">
              Discard Changes
            </Button>
            <Button onClick={savePermissions} disabled={isUpdating} className="rounded-xl px-8 font-black shadow-lg shadow-primary/20 order-1 sm:order-2">
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin font-bold" />}
              Commit Permissions
            </Button>
          </div>
        </div>
      </AFModal>
    </div>
  );
}

