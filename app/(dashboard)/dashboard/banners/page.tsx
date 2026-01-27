"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "@/redux/features/banner/bannerApi";
import { useGetProjectsQuery } from "@/redux/features/project/projectApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CloudinaryUpload from "@/components/shared/CloudinaryUpload";

export default function BannersPage() {
  const { data: banners, isLoading } = useGetBannersQuery(undefined);
  const { data: projects } = useGetProjectsQuery({});

  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  // 🔑 displayOrder is STRING (important)
  const [formData, setFormData] = useState({
    title: "",
    description: "", // ✅ added
    image: "",
    projectRef: "",
    displayOrder: "",
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      projectRef: "",
      displayOrder: "",
      isActive: true,
    });
    setEditingBanner(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      displayOrder: Number(formData.displayOrder) || 0,
    };

    try {
      if (editingBanner) {
        await updateBanner({
          id: editingBanner._id, // ✅ id used
          data: payload,
        }).unwrap();
        toast.success("Banner updated successfully");
      } else {
        await createBanner(payload).unwrap();
        toast.success("Banner created successfully");
      }

      setIsOpen(false);
      resetForm();
    } catch {
      toast.error("Failed to save banner");
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      description: banner.description || "", // ✅
      image: banner.image || "",
      projectRef: banner.projectRef?._id || banner.projectRef || "",
      displayOrder: String(banner.displayOrder ?? ""),
      isActive: banner.isActive ?? true,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      await deleteBanner(id).unwrap();
      toast.success("Banner deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) return <div>Loading banners...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Banner Management</h1>
          <p className="text-muted-foreground">Manage home page banners</p>
        </div>

        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full min-h-[80px] rounded-md border px-3 py-2 text-sm"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Banner short description"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Associated Project
                </label>
                <Select
                  value={formData.projectRef}
                  onValueChange={(value) =>
                    setFormData({ ...formData, projectRef: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.data?.map((p: any) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <CloudinaryUpload
                label="Banner Image"
                value={formData.image}
                onUploadSuccess={(url) =>
                  setFormData({ ...formData, image: url })
                }
                onRemove={() => setFormData({ ...formData, image: "" })}
              />

              <div>
                <label className="text-sm font-medium">Display Order</label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: e.target.value,
                    })
                  }
                />
              </div>

              <Button type="submit" className="w-full">
                {editingBanner ? "Update Banner" : "Create Banner"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {banners?.map((banner: any) => (
              <TableRow key={banner._id}>
                <TableCell>
                  <img
                    src={banner.image}
                    className="w-20 h-10 object-cover rounded"
                  />
                </TableCell>
                <TableCell>{banner.title}</TableCell>
                <TableCell>{banner.projectRef?.name || "N/A"}</TableCell>
                <TableCell>{banner.displayOrder}</TableCell>
                <TableCell>
                  <Badge variant={banner.isActive ? "default" : "secondary"}>
                    {banner.isActive ? "Active" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(banner)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(banner._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
