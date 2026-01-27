'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type Notice = {
  _id: string
  title: string
  fileUrl: string


}

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    fileUrl: '',
  
  })

  const resetForm = () => {
    setFormData({
      title: '',
      fileUrl: '',
      

    })
  }

  // 🔹 Cloudinary PDF Upload
  const handlePdfUpload = async (file: File) => {
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', 'your_upload_preset') // 🔴 change this
    form.append('resource_type', 'auto')

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload`,
        {
          method: 'POST',
          body: form,
        }
      )

      const data = await res.json()
      setFormData({ ...formData, fileUrl: data.secure_url })
      toast.success('PDF uploaded successfully')
    } catch {
      toast.error('PDF upload failed')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fileUrl) {
      toast.error('Please upload PDF')
      return
    }

    setNotices([
      ...notices,
      {
        _id: Date.now().toString(),
        ...formData,
      },
    ])

    toast.success('Notice created')
    setIsOpen(false)
    resetForm()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notices</h1>
          <p className="text-muted-foreground">
            Upload and manage notice PDFs
          </p>
        </div>

        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Notice
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Notice</DialogTitle>
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


              <div className="space-y-2">
                <label className="text-sm font-medium">Upload PDF</label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handlePdfUpload(file)
                  }}
                />
                {formData.fileUrl && (
                  <p className="text-sm text-green-600">
                    PDF uploaded successfully
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Save Notice
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notice List */}
      <div className="grid gap-4">
        {notices.map((notice) => (
          <div
            key={notice._id}
            className="flex items-center justify-between border rounded-md p-4"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">{notice.title}</p>
               
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={notice.fileUrl}
                target="_blank"
                className="text-sm underline"
              >
                View PDF
              </a>

      
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
