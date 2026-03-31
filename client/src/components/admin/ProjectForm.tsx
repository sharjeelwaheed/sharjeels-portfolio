import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/utils/api'

interface ProjectData {
  title: string
  slug: string
  description: string
  techStack: string
  category: string
  liveUrl: string
  githubUrl: string
  imageUrl: string
  featured: boolean
  visible: boolean
  order: number
}

interface Props {
  project?: Record<string, unknown> | null
  onClose: () => void
  onSaved: () => void
}

const CATEGORIES = ['web', 'fullstack', 'backend', 'mobile', 'ai', 'other']

export default function ProjectForm({ project, onClose, onSaved }: Props) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProjectData>()

  useEffect(() => {
    if (project) {
      reset({
        ...project as Partial<ProjectData>,
        techStack: Array.isArray(project.techStack) ? (project.techStack as string[]).join(', ') : '',
      })
    }
  }, [project, reset])

  const onSubmit = async (data: ProjectData) => {
    const payload = {
      ...data,
      techStack: data.techStack.split(',').map((t) => t.trim()).filter(Boolean),
      order: Number(data.order) || 0,
    }
    try {
      if (project && (project as { _id?: string })._id) {
        await api.put(`/projects/${(project as { _id: string })._id}`, payload)
        toast.success('Project updated')
      } else {
        await api.post('/projects', payload)
        toast.success('Project created')
      }
      onSaved()
      onClose()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error saving project'
      toast.error(msg)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 overflow-auto max-h-[90vh]" style={{ background: '#111111' }}>
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="font-heading font-bold text-white text-lg">{project ? 'Edit Project' : 'New Project'}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-xs font-body mb-1">Title *</label>
              <input {...register('title', { required: true })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none focus:border-accent-orange" />
            </div>
            <div>
              <label className="block text-white/50 text-xs font-body mb-1">Slug *</label>
              <input {...register('slug', { required: true })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none focus:border-accent-orange" />
            </div>
          </div>
          <div>
            <label className="block text-white/50 text-xs font-body mb-1">Description *</label>
            <textarea {...register('description', { required: true })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none focus:border-accent-orange resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-xs font-body mb-1">Tech Stack (comma separated)</label>
              <input {...register('techStack')} placeholder="React, Node.js, MongoDB" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none focus:border-accent-orange" />
            </div>
            <div>
              <label className="block text-white/50 text-xs font-body mb-1">Category</label>
              <select {...register('category')} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none focus:border-accent-orange">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-xs font-body mb-1">Live URL</label>
              <input {...register('liveUrl')} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none focus:border-accent-orange" />
            </div>
            <div>
              <label className="block text-white/50 text-xs font-body mb-1">GitHub URL</label>
              <input {...register('githubUrl')} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none focus:border-accent-orange" />
            </div>
          </div>
          <div>
            <label className="block text-white/50 text-xs font-body mb-1">Image URL (from Cloudinary or any URL)</label>
            <input {...register('imageUrl')} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none focus:border-accent-orange" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-white/50 text-xs font-body mb-1">Order</label>
              <input type="number" {...register('order')} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none focus:border-accent-orange" />
            </div>
            <label className="flex items-center gap-2 text-white/60 text-sm font-body cursor-pointer mt-4">
              <input type="checkbox" {...register('featured')} className="accent-orange-500" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-white/60 text-sm font-body cursor-pointer mt-4">
              <input type="checkbox" {...register('visible')} defaultChecked className="accent-orange-500" />
              Visible
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-body text-white/40 hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-lg text-sm font-body text-white disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)' }}>
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
