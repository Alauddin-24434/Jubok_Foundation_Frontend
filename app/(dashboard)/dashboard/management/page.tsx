"use client";

//==================================================================================
//                               FOUNDATION GOVERNANCE
//==================================================================================
// Description: Structural oversight of the foundation's leadership and board.
// Features: Dynamic role assignment, tenure tracking, and active status toggling.
//==================================================================================

import { useState } from "react";
import { Plus, Edit2, Trash2, ShieldCheck, Calendar, Briefcase } from "lucide-react";
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
  //======================   STATE & API HOOKS   ===============================
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingManagement, setEditingManagement] = useState<any>(null);

  const { data: managements, isLoading } = useGetManagementsQuery({});
  const [deleteManagement] = useDeleteManagementMutation();

  //======================   FILTERING ENGINE   ===============================
  const filteredManagements = (managements as any[])?.filter((m: any) =>
    m.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //======================   EVENT HANDLERS   ===============================
  const handleEdit = (management: any) => {
    setEditingManagement(management);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you certain you want to revoke this management appointment? This is a permanent record change.")) {
      try {
        await deleteManagement(id).unwrap();
        toast.success("Governance record purged successfully");
      } catch (error) {
        toast.error("Process failed: Check permissions or constraints");
      }
    }
  };

  const closeModal = () => {
    setIsDialogOpen(false);
    setEditingManagement(null);
  };

  //======================   TABLE DEFINITION   ===============================
  const columns = [
    {
      header: "Leadership Profile",
      cell: (m: any) => (
        <div className="flex items-center gap-3">
           <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 font-black text-xs">
             {m.userId?.name?.substring(0, 2).toUpperCase()}
           </div>
           <div className="flex flex-col">
             <span className="font-bold text-foreground text-sm">{m.userId?.name}</span>
             <span className="text-[10px] text-muted-foreground font-medium">{m.userId?.email}</span>
           </div>
        </div>
      ),
    },
    { 
      header: "Official Position", 
      cell: (m: any) => (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
           <Briefcase size={12} className="text-primary/60" />
           {m.position}
        </div>
      )
    },
    {
      header: "Tenure Period",
      cell: (m: any) => (
        <div className="flex flex-col gap-0.5">
           <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
             <Calendar size={10} />
             {m.startAt ? format(new Date(m.startAt), "MMM d, yyyy") : "---"}
           </div>
           <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
             <span className="opacity-40">→</span>
             {m.endAt ? format(new Date(m.endAt), "MMM d, yyyy") : "Continuous"}
           </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (m: any) => (
        <Badge 
          className={m.isActive 
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none uppercase font-black text-[9px] px-2 py-0.5" 
            : "bg-muted text-muted-foreground border-transparent uppercase font-black text-[9px] px-2 py-0.5"
          }
          variant={m.isActive ? "default" : "secondary"}
        >
          {m.isActive ? "In Office" : "Vacated"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (m: any) => (
        <div className="flex justify-end gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(m)}
            className="h-8 w-8 rounded-full text-blue-500 hover:text-blue-600 hover:bg-blue-50 border border-blue-50"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(m._id)}
            className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-50"
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
        title="Leadership Secretariat"
        description="Organize the board of directors, executive management, and official positions."
        action={
          <Button onClick={() => setIsDialogOpen(true)} className="rounded-xl shadow-lg shadow-primary/20 h-11 px-6 font-black scale-100 hover:scale-105 active:scale-95 transition-all">
            <Plus className="h-5 w-5 mr-2" />
            Appoint Member
          </Button>
        }
      />

      {/* Advanced Filter Module */}
      <AFSearchFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Identify leader by name or official designation..."
      />

      {/* Structural Data View */}
      <div className="rounded-2xl border border-muted/30 overflow-hidden shadow-xl bg-card">
        <AFDataTable
          columns={columns}
          data={filteredManagements || []}
          isLoading={isLoading}
          emptyMessage="No governance structure established yet."
        />
      </div>

      {/* Appointment Interface Modal */}
      <AFModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingManagement ? "Amend Appointment" : "New Leadership Appointment"}
        className="sm:max-w-[500px] rounded-3xl"
      >
        <div className="bg-primary/5 p-4 rounded-xl flex items-center gap-3 mb-6">
          <ShieldCheck className="text-primary h-5 w-5" />
          <p className="text-xs font-bold text-primary uppercase tracking-tighter">Authorized Personnel Entry</p>
        </div>
        <ManagementForm
          initialData={editingManagement}
          onSuccess={closeModal}
        />
      </AFModal>
    </div>
  );
}

