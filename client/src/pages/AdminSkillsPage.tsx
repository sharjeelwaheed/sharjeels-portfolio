import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/utils/api'

interface Skill {
  _id: string
  name: string
  category: string
  proficiency: number
  order: number
}

interface SkillForm {
  name: string
  category: string
  proficiency: number
  order: number
}

const CATS = ['frontend', 'backend', 'database', 'tools', 'mobile', 'language']

function SkillModal({ skill, onClose, onSaved }: { skill?: Skill | null; onClose: () => void; onSaved: () => void }) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<SkillForm>()

  useEffect(() => {
    if (skill) reset(skill)
    else reset({ category: 'frontend', proficiency: 80, order: 0 })
  }, [skill, reset])

  const onSubmit = async (data: SkillForm) => {
    try {
      if (skill?._id) {
        await api.put(`/skills/${skill._id}`, data)
        toast.success('Skill updated')
      } else {
        await api.post('/skills', data)
        toast.success('Skill created')
      }
      onSaved(); onClose()
    } catch { toast.error('Error saving skill') }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="w-full max-w-md rounded-2xl border border-white/10" style={{ background: '#111111' }}>
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-heading font-bold text-white">{skill ? 'Edit Skill' : 'New Skill'}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-white/50 text-xs font-body mb-1">Name *</label>
            <input {...register('name', { required: true })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none focus:border-accent-orange" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-xs font-body mb-1">Category</label>
              <select {...register('category')} className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none">
                {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-white/50 text-xs font-body mb-1">Proficiency (0–100)</label>
              <input type="number" min={0} max={100} {...register('proficiency')} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none focus:border-accent-orange" />
            </div>
          </div>
          <div>
            <label className="block text-white/50 text-xs font-body mb-1">Order</label>
            <input type="number" {...register('order')} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none focus:border-accent-orange" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-body text-white/40 hover:text-white">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg text-sm font-body text-white disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)' }}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)

  const load = () => api.get('/skills').then((r: { data: Skill[] }) => setSkills(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    try { await api.delete(`/skills/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Error') }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-white text-2xl mb-1">Skills</h1>
          <p className="text-white/40 font-body text-sm">{skills.length} skills</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true) }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body text-white" style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)' }}>
          <Plus size={16} /> New Skill
        </button>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {skills.map((skill) => (
          <div key={skill._id} className="glass rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-heading font-semibold text-white text-sm">{skill.name}</p>
                <p className="text-white/30 text-xs font-body">{skill.category}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(skill); setFormOpen(true) }} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white transition-colors">
                  <Pencil size={12} />
                </button>
                <button onClick={() => del(skill._id, skill.name)} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-accent-red transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-accent" style={{ width: `${skill.proficiency}%` }} />
            </div>
            <p className="text-white/30 text-xs font-body text-right">{skill.proficiency}%</p>
          </div>
        ))}
      </div>

      {formOpen && (
        <SkillModal skill={editing} onClose={() => { setFormOpen(false); setEditing(null) }} onSaved={load} />
      )}
    </div>
  )
}
