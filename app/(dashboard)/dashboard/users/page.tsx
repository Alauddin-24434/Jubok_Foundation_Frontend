"use client";

import { useState } from "react";
import {
  Trash2,
  Shield,
  Loader2,
  UserCheck,
  UserX,
  Mail,
  User as UserIcon,
  ShieldAlert,
  Users,
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
import { AFSectionTitle } from "@/components/shared/AFSectionTitle";
import { AFPagination } from "@/components/shared/AFPagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: usersResponse, isLoading } = useGetUsersQuery({
    page,
    limit,
    search: searchTerm || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta || { totalPages: 1, total: 0 };

  //======================   EVENT HANDLERS   ===============================
  const handleRoleChange = async (userId: string, newRole: string) => {
    const toastId = toast.loading("Executing role escalation...");
    try {
      await updateUser({ id: userId, data: { role: newRole } }).unwrap();
      toast.success("Identity role recalculated successfully", { id: toastId });
    } catch (error) {
      toast.error("Role update failed. Security override required.", { id: toastId });
    }
  };

  const handleDelete = async (userId: string) => {
    if (
      confirm("Are you sure you want to permanently delete this user profile?")
    ) {
      const toastId = toast.loading("Purging user profile...");
      try {
        await deleteUser(userId).unwrap();
        toast.success("Security identity purged", { id: toastId });
      } catch (error) {
        toast.error("Cleanup failed. Identity remains intact.", { id: toastId });
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
    const toastId = toast.loading("Syncing security protocols...");
    try {
      await updateUser({
        id: editingUser._id,
        data: { permissions: selectedPermissions },
      }).unwrap();
      toast.success(`Access rights synchronized for ${editingUser.name}`, { id: toastId });
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      toast.error("Protocol sync failed", { id: toastId });
    }
  };

  //======================   UI HELPERS   ===============================
  const getStatusBadge = (status: string) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 uppercase text-[9px] font-black px-2.5 py-1 rounded-lg">
            <UserCheck size={10} className="mr-1.5" />
            {status}
          </Badge>
        );
      case UserStatus.SUSPENDED:
        return (
          <Badge
            variant="destructive"
            className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20 uppercase text-[9px] font-black px-2.5 py-1 rounded-lg"
          >
            <UserX size={10} className="mr-1.5" />
            {status}
          </Badge>
        );
      case UserStatus.PENDING:
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 uppercase text-[9px] font-black px-2.5 py-1 rounded-lg"
          >
            <Loader2 size={10} className="mr-1.5 animate-spin" />
            {status}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="uppercase text-[9px] font-black px-2.5 py-1 rounded-lg"
          >
            {status}
          </Badge>
        );
    }
  };

  //======================   TABLE DEFINITION   ===============================
  const columns = [
    {
      header: "Identity",
      cell: (user: any) => (
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black shadow-inner">
             {user.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
              {user.name}
            </span>
            <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1 font-bold uppercase tracking-tight">
              <Mail size={10} />
              {user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "System Rank",
      cell: (user: any) => (
        <Select
          defaultValue={user.role}
          onValueChange={(value) => handleRoleChange(user._id, value)}
        >
          <SelectTrigger className="w-[140px] h-9 text-[10px] font-black uppercase tracking-widest rounded-xl bg-background/50 border-muted-foreground/10 focus:ring-primary/20 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-muted/20 shadow-2xl">
            <SelectItem value={UserRole.ADMIN} className="text-xs font-black uppercase tracking-widest">
              Administrator
            </SelectItem>
            <SelectItem value={UserRole.MEMBER} className="text-xs font-black uppercase tracking-widest">
              Member
            </SelectItem>
            <SelectItem value={UserRole.USER} className="text-xs font-black uppercase tracking-widest">
              Registered
            </SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      header: "Privileges",
      cell: (user: any) => (
        <div className="flex flex-wrap gap-1.5 max-w-[240px]">
          {user.permissions?.length > 0 ? (
            user.permissions.map((p: string) => (
              <Badge
                key={p}
                variant="secondary"
                className="text-[8px] px-2 h-5 capitalize font-black bg-primary/5 text-primary/70 border-primary/10 tracking-tighter rounded-full"
              >
                {p.replace(/_/g, " ")}
              </Badge>
            ))
          ) : (
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest bg-muted/20 px-2 py-0.5 rounded-full">
              Standard
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
      header: "Management",
      cell: (user: any) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-2xl border border-blue-500/10 cursor-pointer text-blue-500 hover:text-blue-600 hover:bg-blue-500/5 transition-all shadow-sm"
            onClick={() => openPermissionModal(user)}
          >
            <ShieldAlert className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-2xl border border-red-500/10 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/5 transition-all shadow-sm"
            onClick={() => handleDelete(user._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  //======================   MAIN RENDER   ===============================
  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Page Header */}
      <AFPageHeader
        title="Identity Control"
        description="Monitor system accounts, adjust roles, and manage granular security permissions for the foundation ecosystem."
      />

      {/* Stats Summary Area */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <Card className="p-6 border-none bg-card/40 backdrop-blur-md shadow-sm flex items-center gap-6 rounded-[2rem]">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
               <Users size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Total Identities</p>
               <p className="text-3xl font-black">{meta.total || 0}</p>
            </div>
         </Card>
         <Card className="p-6 border-none bg-card/40 backdrop-blur-md shadow-sm flex items-center gap-6 rounded-[2rem]">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
               <UserCheck size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Active Nodes</p>
               <p className="text-3xl font-black">{users.filter((u: any) => u.status === 'ACTIVE').length}</p>
            </div>
         </Card>
         <Card className="p-6 border-none bg-card/40 backdrop-blur-md shadow-sm flex items-center gap-6 rounded-[2rem]">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
               <Shield size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Admin Council</p>
               <p className="text-3xl font-black">{users.filter((u: any) => u.role === 'ADMIN').length}</p>
            </div>
         </Card>
      </div>

      <div className="space-y-8">
        <AFSectionTitle 
          title="Personnel Ledger" 
          subtitle="A centralized registry of all ecosystem participants and their respective clearance levels."
          badge="Security Console"
        />

        <div className="rounded-[3rem] overflow-hidden bg-card/30 backdrop-blur-md border border-muted/20 shadow-2xl p-8">
          {/* Filtering Engine */}
          <AFSearchFilters
            searchValue={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setPage(1);
            }}
            searchPlaceholder="Identify by signature, email, or identity hash..."
          >
            <Select value={roleFilter} onValueChange={(val) => {
              setRoleFilter(val);
              setPage(1);
            }}>
              <SelectTrigger className="w-full sm:w-[240px] h-12 rounded-2xl bg-background/50 backdrop-blur-sm shadow-sm border-muted-foreground/10 font-black text-[10px] uppercase tracking-widest">
                <SelectValue placeholder="Access Rank" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-muted/20 shadow-2xl">
                <SelectItem value="all" className="text-xs font-black uppercase tracking-widest">All Clearance Levels</SelectItem>
                <SelectItem value={UserRole.ADMIN} className="text-xs font-black uppercase tracking-widest">Administrator</SelectItem>
                <SelectItem value={UserRole.MEMBER} className="text-xs font-black uppercase tracking-widest">Ecosystem Member</SelectItem>
                <SelectItem value={UserRole.USER} className="text-xs font-black uppercase tracking-widest">Unverified Guest</SelectItem>
              </SelectContent>
            </Select>
          </AFSearchFilters>

          {/* Data Infrastructure */}
          <div className="mt-10 rounded-[2rem] overflow-hidden shadow-2xl border border-muted/10 bg-card/50">
            <AFDataTable
              columns={columns}
              data={users}
              isLoading={isLoading}
              emptyMessage="No matching identities discovered in the foundation records."
            />
          </div>

          {/* Pagination Infrastructure */}
          <AFPagination 
             currentPage={page}
             totalPages={meta.totalPages}
             onPageChange={(p) => {
               setPage(p);
               window.scrollTo({ top: 0, behavior: 'smooth' });
             }}
          />
        </div>
      </div>

      {/* Security Protocol Modal */}
      <AFModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Security Access Control"
        className="sm:max-w-[550px] rounded-[2.5rem] border-none shadow-2xl"
      >
        <div className="space-y-8">
          <div className="bg-primary/5 p-6 rounded-[2rem] flex items-center gap-5 border border-primary/10">
            <div className="bg-primary/10 h-16 w-16 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="text-primary h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">
                Profile Clearance
              </p>
              <h4 className="font-black text-2xl text-foreground">
                {editingUser?.name}
              </h4>
              <p className="text-xs font-bold text-muted-foreground/60 tracking-tight">
                {editingUser?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 py-2">
            {AVAILABLE_PERMISSIONS.map((permission) => (
              <div
                key={permission}
                onClick={() => handlePermissionToggle(permission)}
                className={`flex items-center space-x-4 p-5 rounded-2xl border cursor-pointer transition-all duration-500 ${
                  selectedPermissions.includes(permission)
                    ? "bg-primary text-primary-foreground border-transparent shadow-xl shadow-primary/20 scale-[1.02]"
                    : "bg-background border-muted/30 hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                <Checkbox
                  id={permission}
                  checked={selectedPermissions.includes(permission)}
                  onCheckedChange={() => handlePermissionToggle(permission)}
                  className="h-5 w-5 rounded-md border-primary/30 data-[state=checked]:bg-white data-[state=checked]:text-primary pointer-events-none"
                />
                <Label
                  htmlFor={permission}
                  className="capitalize cursor-pointer flex-1 text-xs font-black tracking-widest uppercase pointer-events-none"
                >
                  {permission.replace(/_/g, " ")}
                </Label>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-muted/30">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="rounded-2xl px-10 h-12 font-black uppercase text-[10px] tracking-widest order-2 sm:order-1 transition-all"
            >
              Abort Mission
            </Button>
            <Button
              onClick={savePermissions}
              disabled={isUpdating}
              className="rounded-2xl px-12 h-12 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/20 bg-primary order-1 sm:order-2 hover:scale-105 transition-all"
            >
              {isUpdating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update clearance
            </Button>
          </div>
        </div>
      </AFModal>
    </div>
  );
}
