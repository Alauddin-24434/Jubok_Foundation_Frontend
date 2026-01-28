"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, X, RotateCcw } from "lucide-react";

import CloudinaryUpload from "@/components/shared/CloudinaryUpload";
import YouTubePreview from "@/components/shared/YouTubePreview";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/redux/features/project/projectApi";

interface ProjectFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const DRAFT_KEY = "af_project_draft";

export default function ProjectForm({
  initialData,
  isEditing = false,
}: ProjectFormProps) {
  const router = useRouter();

  const [createProject, { isLoading: isCreating }] =
    useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] =
    useUpdateProjectMutation();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    thumbnail: initialData?.thumbnail || "",
    images: initialData?.images || [],
    videos: initialData?.videos || [""],
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : "",
    endDate: initialData?.endDate
      ? new Date(initialData.endDate).toISOString().split("T")[0]
      : "",
    intialInvestment: initialData?.intialInvestment || 0,
    category: initialData?.category || "Agriculture",
    location: initialData?.location || "",
    contactNumber: initialData?.contactNumber || "",
  });

  /* ================= Draft ================= */
  useEffect(() => {
    if (!isEditing) {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        setFormData((prev) => ({ ...prev, ...JSON.parse(draft) }));
        toast.info("Loaded draft from previous session");
      }
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      const { videos, ...draftData } = formData;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    }
  }, [formData, isEditing]);

  const clearDraft = () => {
    if (confirm("Clear saved draft?")) {
      localStorage.removeItem(DRAFT_KEY);
      setFormData({
        name: "",
        description: "",
        thumbnail: "",
        images: [],
        videos: [""],
        startDate: "",
        endDate: "",
        intialInvestment: 0,
        category: "Agriculture",
        location: "",
        contactNumber: "",
      });
      toast.success("Draft cleared");
    }
  };

  /* ================= Submit ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      intialInvestment: Number(formData.intialInvestment),
      videos: formData.videos.filter((v) => v.trim()),
      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : undefined,
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
        : undefined,
    };

    try {
      if (isEditing) {
        await updateProject({
          id: initialData._id,
          data: cleanedData,
        }).unwrap();
        toast.success("Project updated successfully");
      } else {
        await createProject(cleanedData).unwrap();
        toast.success("Project created successfully");
        localStorage.removeItem(DRAFT_KEY);
      }
      router.push("/dashboard/projects");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save project");
    }
  };

  /* ================= Video ================= */
  const addVideoUrl = () =>
    setFormData({ ...formData, videos: [...formData.videos, ""] });

  const removeVideoUrl = (i: number) =>
    setFormData({
      ...formData,
      videos: formData.videos.filter((_, index) => index !== i),
    });

  const updateVideoUrl = (i: number, v: string) => {
    const videos = [...formData.videos];
    videos[i] = v;
    setFormData({ ...formData, videos });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* ================= BASIC INFO ================= */}
      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Project Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Location <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            className="min-h-[150px]"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="flex h-10 w-full rounded-md border px-3 text-sm"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option value="Agriculture">Agriculture</option>
              <option value="Fish Farming">Fish Farming</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Initial Investment (৳) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.intialInvestment}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  intialInvestment: Number(e.target.value),
                })
              }
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Start Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              End Date <span className="text-muted-foreground">(Optional)</span>
            </label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Leave empty if the project is ongoing
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Thumbnail <span className="text-red-500">*</span>
          </label>
          <CloudinaryUpload
            value={formData.thumbnail}
            onUploadSuccess={(url) =>
              setFormData({ ...formData, thumbnail: url })
            }
            onRemove={() =>
              setFormData({ ...formData, thumbnail: "" })
            }
          />
        </div>
      </Card>

      {/* ================= MEDIA ================= */}
      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Media & Contact</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">YouTube Videos</label>
            <Button type="button" variant="outline" size="sm" onClick={addVideoUrl}>
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>

          {formData.videos.map((url, i) => (
            <div key={i} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="YouTube URL"
                  value={url}
                  onChange={(e) => updateVideoUrl(i, e.target.value)}
                />
                {formData.videos.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVideoUrl(i)}
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <YouTubePreview url={url} />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.contactNumber}
            onChange={(e) =>
              setFormData({ ...formData, contactNumber: e.target.value })
            }
            required
          />
        </div>
      </Card>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-4">
        {!isEditing && (
          <Button variant="ghost" type="button" onClick={clearDraft}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear Draft
          </Button>
        )}
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating || isUpdating}>
          {isEditing ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
