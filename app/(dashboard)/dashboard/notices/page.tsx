"use client";

import { useMemo, useState } from "react";
import {
  useGetNoticesQuery,
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  INotice,
} from "@/redux/features/notice/noticeApi";

import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { AFSearchFilters } from "@/components/shared/AFSearchFilters";
import { AFDataTable } from "@/components/shared/AFDataTable";
import { AFModal } from "@/components/shared/AFModal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  FileUp,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

//==================================================================================
//                               NOTICE PAGE (RTK QUERY)
//==================================================================================

export default function NoticePage() {
  // ================= STATE =================
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // ================= RTK QUERY =================
  const { data: notices = [], isLoading } = useGetNoticesQuery(undefined);

  const [createNotice, { isLoading: creating }] = useCreateNoticeMutation();

  const [deleteNotice] = useDeleteNoticeMutation();

  // ================= SEARCH FILTER =================
  const filteredNotices = useMemo(() => {
    return notices.filter((n: any) =>
      n.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [notices, search]);

  // ================= PDF UPLOAD =================
  const handlePdfUpload = async (file: File) => {
    setIsUploading(true);
    const toastId = toast.loading("Uploading PDF...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        { method: "POST", body: formData },
      );

      const data = await res.json();
      setFileUrl(data.secure_url);
      toast.success("PDF uploaded successfully", { id: toastId });
    } catch {
      toast.error("PDF upload failed", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  // ================= CREATE =================
  const handleCreate = async () => {
    if (!title || !fileUrl) {
      toast.error("Title & PDF required");
      return;
    }

    try {
      await createNotice({ title, fileUrl }).unwrap();
      toast.success("Notice published");
      setOpen(false);
      setTitle("");
      setFileUrl("");
    } catch {
      toast.error("Failed to create notice");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
  

    try {
      await deleteNotice(id).unwrap();
      toast.success("Notice deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= TABLE =================
  const columns = [
    {
      header: "Title",
      className: "text-center",
      cell: (item: INotice) => <p className="font-semibold">{item.title}</p>,
    },
    {
      header: "Created",
      className: "text-center",
      cell: (item: INotice) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      header: "Action",
      className: "text-center",
      cell: (item: INotice) => (
        <div className="flex justify-center items-center gap-3">
          <a href={item.fileUrl} target="_blank" className="text-primary">
            <ExternalLink size={16} />
          </a>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDelete(item._id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  // ================= RENDER =================
  return (
    <div className="space-y-6">
      <AFPageHeader
        title="Notice Board"
        description="Manage public notices & circulars"
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Notice
          </Button>
        }
      />

      <AFSearchFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search notice..."
      />

      <AFDataTable
        columns={columns}
        data={filteredNotices}
        isLoading={isLoading}
        emptyMessage="No notices found"
      />

      {/* ================= MODAL ================= */}
      <AFModal isOpen={open} onOpenChange={setOpen} title="Create Notice">
        <div className="space-y-5">
          {/* TITLE */}
          <Input
            placeholder="Notice title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* BEAUTIFUL PDF UPLOAD */}
          <div className="relative">
            <label className="block">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePdfUpload(file);
                }}
              />

              <div className="h-32 rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition">
                {!fileUrl && !isUploading && (
                  <>
                    <FileUp className="h-8 w-8 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground font-medium">
                      Click or drop PDF here
                    </p>
                  </>
                )}

                {isUploading && (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs text-primary">Uploading PDF...</p>
                  </>
                )}

                {fileUrl && !isUploading && (
                  <>
                    <CheckCircle className="h-7 w-7 text-emerald-500" />
                    <p className="text-xs font-semibold text-emerald-600">
                      PDF uploaded successfully
                    </p>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleCreate}
              disabled={creating || isUploading || !fileUrl}
            >
              {creating ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </AFModal>
    </div>
  );
}
