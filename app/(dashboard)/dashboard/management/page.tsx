"use client";

import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetManagementsQuery,
  useDeleteManagementMutation,
} from "@/redux/features/management/managementApi";
import { ManagementForm } from "./ManagementForm";
import { toast } from "sonner";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { AFSearchFilters } from "@/components/shared/AFSearchFilters";
import { AFDataTable } from "@/components/shared/AFDataTable";
import { AFModal } from "@/components/shared/AFModal";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ManagementPage() {
  //====================== STATE ======================
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy] = useState("createdAt");
  const [sortOrder] = useState<"asc" | "desc">("desc");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingManagement, setEditingManagement] = useState<any>(null);

  //====================== API ======================
  const { data, isLoading } = useGetManagementsQuery({
    page,
    limit,
    search: searchTerm,
    sortBy,
    sortOrder,
  });

  const [deleteManagement] = useDeleteManagementMutation();

  const managements = data?.data || [];
  const meta = data?.meta;

  //====================== HANDLERS ======================
  const handleEdit = (management: any) => {
    setEditingManagement(management);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this appointment?")) {
      try {
        await deleteManagement(id).unwrap();
        toast.success("Management record deleted");
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  const closeModal = () => {
    setIsDialogOpen(false);
    setEditingManagement(null);
  };

  //====================== TABLE ======================
  const columns = [
    {
      header: "Leadership Profile",
      cell: (m: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-xs">
            {m.userId?.name?.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-sm">{m.userId?.name}</div>
            <div className="text-[10px] text-muted-foreground">
              {m.userId?.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Position",
      cell: (m: any) => (
        <div className="flex items-center gap-1 text-xs font-bold">
          <Briefcase size={12} />
          {m.position}
        </div>
      ),
    },
    {
      header: "Tenure",
      cell: (m: any) => (
        <div className="text-xs">
          {m.startAt
            ? format(new Date(m.startAt), "MMM d, yyyy")
            : "---"}{" "}
          →{" "}
          {m.endAt
            ? format(new Date(m.endAt), "MMM d, yyyy")
            : "Present"}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (m: any) => (
        <Badge variant={m.isActive ? "default" : "secondary"}>
          {m.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (m: any) => (
        <div className="flex gap-2 justify-end">
          <Button size="icon" variant="ghost" onClick={() => handleEdit(m)}>
            <Edit2 size={16} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDelete(m._id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  //====================== RENDER ======================
  return (
    <div className="space-y-6">
      <AFPageHeader
        title="Leadership Secretariat"
        description="Manage foundation leadership and governance"
        action={
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Appoint Member
          </Button>
        }
      />

      <AFSearchFilters
        searchValue={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setPage(1);
        }}
      />

      <AFDataTable
        columns={columns}
        data={managements}
        isLoading={isLoading}
        emptyMessage="No management records found"
      />

      {/* Pagination */}
      {meta && (
        <div className="flex justify-between items-center text-xs font-bold">
          <span>
            Page {meta.page} of {meta.totalPage} • Total {meta.total}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              size="sm"
              disabled={page === meta.totalPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AFModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingManagement ? "Edit Appointment" : "New Appointment"}
      >
        <ManagementForm
          initialData={editingManagement}
          onSuccess={closeModal}
        />
      </AFModal>
    </div>
  );
}
