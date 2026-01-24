'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2, Layout } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { 
  useGetBannersQuery, 
  useCreateBannerMutation, 
  useUpdateBannerMutation, 
  useDeleteBannerMutation 
} from '@/redux/features/banner/bannerApi'
import { useGetProjectsQuery } from '@/redux/features/project/projectApi'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CloudinaryUpload from '@/components/shared/CloudinaryUpload'

export default function BannersPage() {
  const { data: banners, isLoading } = useGetBannersQuery(undefined)
  const { data: projects } = useGetProjectsQuery({})
  
  const [createBanner] = useCreateBannerMutation()
  const [updateBanner] = useUpdateBannerMutation()
  const [deleteBanner] = useDeleteBannerMutation()

  const [isOpen, setIsOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    projectRef: '',
    displayOrder: 0,
    isActive: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingBanner) {
        await updateBanner({ id: editingBanner._id, data: formData }).unwrap()
        toast.success('Banner updated successfully')
      } else {
        await createBanner(formData).unwrap()
        toast.success('Banner created successfully')
      }
      setIsOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to save banner')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      image: '',
      projectRef: '',
      displayOrder: 0,
      isActive: true
    })
    setEditingBanner(null)
  }

  const handleEdit = (banner: any) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      image: banner.image,
      projectRef: banner.projectRef?._id || banner.projectRef,
      displayOrder: banner.displayOrder,
      isActive: banner.isActive
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteBanner(id).unwrap()
        toast.success('Banner deleted')
      } catch (error) {
        toast.error('Failed to delete')
      }
    }
  }

  if (isLoading) return <div>Loading banners...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Banner Management</h1>
          <p className="text-foreground/60 mt-1">Manage home page banners</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  className="h-10"
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Associated Project</label>
                <Select 
                  value={formData.projectRef} 
                  onValueChange={value => setFormData({...formData, projectRef: value})}
                  required
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map((p: any) => (
                      <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CloudinaryUpload 
                label="Banner Image"
                value={formData.image}
                onUploadSuccess={(url) => setFormData({...formData, image: url})}
                onRemove={() => setFormData({...formData, image: ''})}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Order</label>
                <Input 
                  className="h-10"
                  type="number"
                  value={formData.displayOrder} 
                  onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                />
              </div>
              <Button type="submit" className="w-full h-10">
                {editingBanner ? 'Update Banner' : 'Create Banner'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px] md:min-w-full">
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
                  <img src={banner.image} className="w-20 h-10 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">{banner.title}</TableCell>
                <TableCell>{banner.projectRef?.name || 'N/A'}</TableCell>
                <TableCell>{banner.displayOrder}</TableCell>
                <TableCell>
                  <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                    {banner.isActive ? 'Active' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(banner)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(banner._id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
  )
}
