'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import CloudinaryUpload from '@/components/shared/CloudinaryUpload'
import YouTubePreview from '@/components/shared/YouTubePreview'
import { useCreateProjectMutation, useUpdateProjectMutation } from '@/redux/features/project/projectApi'
import { Card } from '@/components/ui/card'
import { Plus, X, RotateCcw } from 'lucide-react'

interface ProjectFormProps {
  initialData?: any
  isEditing?: boolean
}

const DRAFT_KEY = 'af_project_draft'

export default function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const router = useRouter()
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation()
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation()

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    thumbnail: initialData?.thumbnail || '',
    images: initialData?.images || [],
    videos: initialData?.videos || [''],
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    amount: initialData?.amount || 0,
    location: initialData?.location || '',
    contactNumber: initialData?.contactNumber || '',
    notice: initialData?.notice || '',
  })

  // Load draft from localStorage on mount (only for new projects)
  useEffect(() => {
    if (!isEditing) {
      const draft = localStorage.getItem(DRAFT_KEY)
      if (draft) {
        try {
          const parsedDraft = JSON.parse(draft)
          setFormData(prev => ({
            ...prev,
            ...parsedDraft
          }))
          toast.info('Loaded draft from previous session')
        } catch (e) {
          console.error('Failed to parse draft', e)
        }
      }
    }
  }, [isEditing])

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (!isEditing) {
      const { videos, ...draftData } = formData // We don't save videos for now to keep it simple
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData))
    }
  }, [formData, isEditing])

  const clearDraft = () => {
    if (confirm('Are you sure you want to clear the draft? This will reset the form.')) {
      localStorage.removeItem(DRAFT_KEY)
      setFormData({
        name: '',
        description: '',
        thumbnail: '',
        images: [],
        videos: [''],
        startDate: '',
        endDate: '',
        amount: 0,
        location: '',
        contactNumber: '',
        notice: '',
      })
      toast.success('Draft cleared')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter out empty video URLs and sanitize data
    const cleanedData = {
      ...formData,
      amount: Number(formData.amount),
      videos: formData.videos.filter((v: string) => v.trim() !== ''),
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
    }

    console.log('Sending project data:', cleanedData)

    try {
      if (isEditing) {
        await updateProject({ id: initialData._id, data: cleanedData }).unwrap()
        toast.success('Project updated successfully')
      } else {
        await createProject(cleanedData).unwrap()
        toast.success('Project created successfully')
        // Clear draft on success
        localStorage.removeItem(DRAFT_KEY)
      }
      router.push('/dashboard/projects')
    } catch (error: any) {
      console.error('Failed to save project:', error)
      const message = error.data?.message || error.message || 'Failed to save project'
      const detail = Array.isArray(message) ? message.map(m => m.message || m).join(', ') : message
      toast.error(`Error: ${detail}`)
    }
  }

  const addVideoUrl = () => {
    setFormData({ ...formData, videos: [...formData.videos, ''] })
  }

  const removeVideoUrl = (index: number) => {
    const newVideos = [...formData.videos]
    newVideos.splice(index, 1)
    setFormData({ ...formData, videos: newVideos })
  }

  const updateVideoUrl = (index: number, value: string) => {
    const newVideos = [...formData.videos]
    newVideos[index] = value
    setFormData({ ...formData, videos: newVideos })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Name</label>
            <Input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input 
              value={formData.location} 
              onChange={e => setFormData({...formData, location: e.target.value})}
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="min-h-[150px]"
            required 
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Amount (৳)</label>
            <Input 
              type="number"
              value={formData.amount} 
              onChange={e => setFormData({...formData, amount: parseInt(e.target.value)})}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Input 
              type="date"
              value={formData.startDate} 
              onChange={e => setFormData({...formData, startDate: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <Input 
              type="date"
              value={formData.endDate} 
              onChange={e => setFormData({...formData, endDate: e.target.value})}
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Thumbnail</label>
          <CloudinaryUpload 
            value={formData.thumbnail}
            onUploadSuccess={(url) => setFormData({...formData, thumbnail: url})}
            onRemove={() => setFormData({...formData, thumbnail: ''})}
          />
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold mb-4">Media & Contact</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">YouTube Video URLs</label>
            <Button type="button" variant="outline" size="sm" onClick={addVideoUrl}>
              <Plus className="h-4 w-4 mr-2" /> Add More
            </Button>
          </div>
          {formData.videos.map((url: string, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex gap-2">
                <Input 
                  placeholder="Paste YouTube URL here..."
                  value={url}
                  onChange={e => updateVideoUrl(index, e.target.value)}
                />
                {formData.videos.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeVideoUrl(index)}>
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <YouTubePreview url={url} />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contact Number</label>
          <Input 
            value={formData.contactNumber} 
            onChange={e => setFormData({...formData, contactNumber: e.target.value})}
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notice (Special Instructions)</label>
          <Input 
            value={formData.notice} 
            onChange={e => setFormData({...formData, notice: e.target.value})}
          />
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        {!isEditing && (
          <Button 
            type="button" 
            variant="ghost" 
            onClick={clearDraft}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear Draft
          </Button>
        )}
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
        </Button>
      </div>
    </form>
  )
}
