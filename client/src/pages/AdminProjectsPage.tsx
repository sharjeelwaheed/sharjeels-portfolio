import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import ProjectForm from '@/components/admin/ProjectForm'
import api from '@/utils/api'

interface Project {
  _id: string
  title: string
  category: string
  techStack: string[]
  visible: boolean
  featured: boolean
  order: number
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)

  const load = () => {
    api.get('/projects/all').then((r: { data: Project[] }) => { setProjects(r.data); setLoading(false) }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggle = async (id: string) => {
    try {
      await api.patch(`/projects/${id}/toggle`)
      toast.success('Visibility updated')
      load()
    } catch { toast.error('Error') }
  }

  const del = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await api.delete(`/projects/${id}`)
      toast.success('Project deleted')
      load()
    } catch { toast.error('Error deleting') }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-white text-2xl mb-1">Projects</h1>
          <p className="text-white/40 font-body text-sm">{projects.length} total</p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body text-white"
          style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)' }}
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((n) => <div key={n} className="glass rounded-xl h-16 animate-pulse" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => (
            <div key={project._id} className="glass rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-semibold text-white truncate">{project.title}</h3>
                  {project.featured && <span className="px-2 py-0.5 rounded-full text-xs font-body text-orange-300" style={{ background: 'rgba(255,77,0,0.15)' }}>Featured</span>}
                  {!project.visible && <span className="px-2 py-0.5 rounded-full text-xs font-body text-white/30" style={{ background: 'rgba(255,255,255,0.05)' }}>Hidden</span>}
                </div>
                <p className="text-white/30 text-xs font-body mt-0.5">
                  {project.category} · {project.techStack.slice(0, 3).join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggle(project._id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white glass transition-colors" title={project.visible ? 'Hide' : 'Show'}>
                  {project.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => { setEditing(project as unknown as Record<string, unknown>); setFormOpen(true) }} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white glass transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => del(project._id, project.title)} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-accent-red glass transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <ProjectForm
          project={editing}
          onClose={() => { setFormOpen(false); setEditing(null) }}
          onSaved={load}
        />
      )}
    </div>
  )
}
