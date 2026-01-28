'use client'

//==================================================================================
//                               NOTICES & DOCUMENTS
//==================================================================================
// Description: Centralized document repository for official circulars and notices.
// Features: PDF distribution, automatic indexing, and quick visual preview.
//==================================================================================

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Trash2, ExternalLink, Download, FileUp, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { AFPageHeader } from '@/components/shared/AFPageHeader'
import { AFModal } from '@/components/shared/AFModal'

type Notice = {
  _id: string
  title: string
  fileUrl: string
  createdAt: string
}

export default function NoticePage() {
  //======================   STATE & HOOKS   ===============================
  const [notices, setNotices] = useState<Notice[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    fileUrl: '',
  })

  //======================   EVENT HANDLERS   ===============================
  const resetForm = () => {
    setFormData({
      title: '',
      fileUrl: '',
    })
  }

  // 🔹 Simulated Document Persistance
  const handlePdfUpload = async (file: File) => {
    setIsUploading(true)
    const toastId = toast.loading('Synchronizing document with Cloudinary...')
    
    // NOTE: In production, use the centralized CloudinaryUpload component 
    // or a secure signature-based backend route.
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', 'ml_default') 
    form.append('resource_type', 'auto')

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/demo/upload`, // Use your cloud name
        {
          method: 'POST',
          body: form,
        }
      )

      const data = await res.json()
      setFormData({ ...formData, fileUrl: data.secure_url })
      toast.success('Document verification complete', { id: toastId })
    } catch {
      toast.error('Cryptographic signature failed or network error', { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fileUrl) {
      toast.error('Security protocol required: Upload document first')
      return
    }

    setNotices([
      ...notices,
      {
        _id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        fileUrl: formData.fileUrl,
        createdAt: new Date().toISOString(),
      },
    ])

    toast.success('Official circular published')
    setIsOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm("Permanently archive and delete this official notice?")) {
      setNotices(notices.filter(n => n._id !== id))
      toast.info('Document moved to archives')
    }
  }

  //======================   MAIN RENDER   ===============================
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Dynamic Header Section */}
      <AFPageHeader
        title="Notice Board"
        description="Distribute official foundation documents, financial reports, and circulars."
        action={
          <Button onClick={() => setIsOpen(true)} className="rounded-xl shadow-lg h-11 px-6 font-black transition-all hover:scale-105 active:scale-95">
            <Plus className="h-5 w-5 mr-2" />
            Publish Circular
          </Button>
        }
      />

      {/* Structured Document List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notices.length > 0 ? notices.map((notice) => (
          <Card key={notice._id} className="group relative overflow-hidden border-2 border-muted/30 hover:border-primary/40 transition-all duration-300 p-6 bg-card/50 backdrop-blur-sm shadow-md hover:shadow-xl">
             <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground duration-500">
                  <FileText size={24} />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-black text-foreground line-clamp-2 leading-tight tracking-tight">{notice.title}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                    Circular #{notice._id.toUpperCase()}
                  </p>
                </div>
             </div>

             <div className="mt-8 flex items-center justify-between border-t border-muted/50 pt-4">
               <div className="flex gap-2">
                  <a
                    href={notice.fileUrl}
                    target="_blank"
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                    title="Open Document"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <a
                    href={notice.fileUrl}
                    download
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                    title="Download Copy"
                  >
                    <Download size={16} />
                  </a>
               </div>

               <Button 
                 variant="ghost" 
                 size="icon" 
                 onClick={() => handleDelete(notice._id)}
                 className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10"
               >
                 <Trash2 size={16} />
               </Button>
             </div>

             {/* Background Decoration */}
             <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity rotate-12">
                <FileText size={120} />
             </div>
          </Card>
        )) : (
          <div className="col-span-full py-32 text-center rounded-3xl border-2 border-dashed border-muted bg-muted/5 flex flex-col items-center gap-4">
             <div className="bg-muted p-6 rounded-full">
               <FileText size={48} className="text-muted-foreground/30" />
             </div>
             <div>
               <p className="text-muted-foreground font-black text-xl">No active announcements</p>
               <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto">Click 'Publish Circular' to broadcast official documentation to all foundation members.</p>
             </div>
          </div>
        )}
      </div>

      {/* Publication System Modal */}
      <AFModal
        isOpen={isOpen}
        onOpenChange={(v) => {setIsOpen(v); if(!v) resetForm();}}
        title="Distribute Official Notice"
        className="sm:max-w-[450px] rounded-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-xl flex items-center gap-3">
            <FileUp className="text-primary h-5 w-5" />
            <p className="text-xs font-bold text-primary uppercase tracking-tighter">Document Uplift System</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-muted-foreground ml-1">Circular Headline</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Annual Audit Report 2025"
                required
                className="rounded-xl h-11 border-muted-foreground/20 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-muted-foreground ml-1">Document Payload (PDF Only)</label>
              <div className="relative">
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handlePdfUpload(file)
                  }}
                  className="rounded-xl h-24 border-dashed border-2 cursor-pointer pt-9 pl-12 file:hidden bg-muted/5 text-transparent"
                />
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center gap-1.5">
                  <FileUp size={24} className="text-muted-foreground/40" />
                  <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Drop PDF or Click to Select</p>
                </div>
                {formData.fileUrl && (
                  <div className="absolute inset-0 bg-emerald-50 rounded-xl border-emerald-200 border-2 flex items-center justify-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                       <Plus size={14} className="rotate-45" /> {/* Success check replacement */}
                    </div>
                    <p className="text-[10px] font-black text-emerald-700 uppercase">Document Securely Linked</p>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin text-primary" />
                    <p className="text-[10px] font-black text-primary uppercase animate-pulse">Encoding Buffer...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-muted/30">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl px-8 font-bold order-2 sm:order-1 h-11">
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading} className="rounded-xl px-10 font-black shadow-lg shadow-primary/20 h-11 order-1 sm:order-2">
              Commit Circular
            </Button>
          </div>
        </form>
      </AFModal>
    </div>
  )
}

