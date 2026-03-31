import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Trash2, Pencil, X, GraduationCap, Briefcase } from 'lucide-react'
import api from '@/utils/api'

interface Experience {
  _id: string
  type: 'work' | 'education'
  title: string
  organization: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  order: number
}

type FormData = Omit<Experience, '_id'>

const EMPTY: FormData = {
  type: 'education',
  title: '',
  organization: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  order: 0,
}

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body outline-none focus:border-accent-orange transition-colors'
const labelCls = 'block text-white/50 text-xs font-body mb-1.5 uppercase tracking-wide'

export default function AdminTimelinePage() {
  const [items, setItems] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<FormData>({ defaultValues: EMPTY })
  const isCurrent = watch('current')

  const load = async () => {
    try {
      const res = await api.get('/experience')
      setItems(res.data)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditId(null)
    reset(EMPTY)
    setShowForm(true)
  }

  const openEdit = (item: Experience) => {
    setEditId(item._id)
    reset({
      type: item.type,
      title: item.title,
      organization: item.organization,
      location: item.location,
      startDate: item.startDate,
      endDate: item.endDate,
      current: item.current,
      description: item.description,
      order: item.order,
    })
    setShowForm(true)
  }

  const onSubmit = async (data: FormData) => {
    if (data.current) data.endDate = ''
    try {
      if (editId) {
        await api.put(`/experience/${editId}`, data)
        toast.success('Updated')
      } else {
        await api.post('/experience', data)
        toast.success('Added')
      }
      setShowForm(false)
      setEditId(null)
      reset(EMPTY)
      load()
    } catch { toast.error('Error saving') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return
    try {
      await api.delete(`/experience/${id}`)
      toast.success('Deleted')
      load()
    } catch { toast.error('Error deleting') }
  }

  const education = items.filter(i => i.type === 'education').sort((a, b) => a.order - b.order)
  const work = items.filter(i => i.type === 'work').sort((a, b) => a.order - b.order)

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-white text-2xl">Education & Work</h1>
          <p className="text-white/40 text-sm font-body mt-1">Manage your timeline entries</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body text-white"
          style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)' }}
        >
          <Plus size={15} /> Add Entry
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg glass rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-white text-lg">{editId ? 'Edit Entry' : 'Add Entry'}</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Type */}
              <div>
                <label className={labelCls}>Type</label>
                <div className="flex gap-3">
                  {(['education', 'work'] as const).map(t => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value={t} {...register('type')} className="accent-orange-500" />
                      <span className="text-white/70 text-sm font-body capitalize flex items-center gap-1">
                        {t === 'education' ? <GraduationCap size={14} /> : <Briefcase size={14} />} {t}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Title *</label>
                <input {...register('title', { required: true })} placeholder="e.g. BS Computer Science" className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Organization *</label>
                <input {...register('organization', { required: true })} placeholder="e.g. University of Gujranwala" className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Location</label>
                <input {...register('location')} placeholder="e.g. Gujranwala, Pakistan" className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Start Date *</label>
                  <input {...register('startDate', { required: true })} placeholder="e.g. Sep 2022" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>End Date</label>
                  <input {...register('endDate')} placeholder="e.g. Jul 2026" disabled={isCurrent} className={inputCls + (isCurrent ? ' opacity-40 cursor-not-allowed' : '')} />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('current')} className="accent-orange-500 w-4 h-4" />
                <span className="text-white/60 text-sm font-body">Currently ongoing</span>
              </label>

              <div>
                <label className={labelCls}>Description</label>
                <textarea {...register('description')} rows={3} placeholder="Brief description..." className={inputCls + ' resize-none'} />
              </div>

              <div>
                <label className={labelCls}>Order (lower = first)</label>
                <input type="number" {...register('order', { valueAsNumber: true })} className={inputCls} />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl text-sm font-body text-white disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)' }}
                >
                  {isSubmitting ? 'Saving...' : editId ? 'Save Changes' : 'Add Entry'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 rounded-xl text-sm font-body text-white/50 border border-white/10 hover:text-white">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-white/30 text-sm font-body">Loading...</p>
      ) : (
        <div className="flex flex-col gap-10">
          {/* Education */}
          <Section title="Education" icon={<GraduationCap size={16} />} items={education} onEdit={openEdit} onDelete={handleDelete} />
          {/* Work */}
          <Section title="Work Experience" icon={<Briefcase size={16} />} items={work} onEdit={openEdit} onDelete={handleDelete} />
        </div>
      )}
    </div>
  )
}

function Section({ title, icon, items, onEdit, onDelete }: {
  title: string
  icon: React.ReactNode
  items: Experience[]
  onEdit: (item: Experience) => void
  onDelete: (id: string) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-white/50">{icon}</span>
        <h2 className="font-heading font-semibold text-white text-base">{title}</h2>
        <span className="text-white/20 text-xs font-body">{items.length} entries</span>
      </div>

      {items.length === 0 ? (
        <p className="text-white/20 text-sm font-body py-6 glass rounded-xl text-center">No entries yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item._id} className="glass rounded-xl p-4 flex items-start justify-between gap-4 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-body font-medium text-sm">{item.title}</p>
                  {item.current && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-body" style={{ background: 'rgba(255,77,0,0.15)', color: '#FF4D00' }}>
                      Current
                    </span>
                  )}
                </div>
                <p className="text-white/50 text-xs font-body mt-0.5">{item.organization} · {item.location}</p>
                <p className="text-white/30 text-xs font-body mt-0.5">
                  {item.startDate} — {item.current ? 'Present' : item.endDate || '—'}
                </p>
                {item.description && (
                  <p className="text-white/35 text-xs font-body mt-1.5 line-clamp-2">{item.description}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => onEdit(item)} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all">
                  <Pencil size={14} />
                </button>
                <button onClick={() => onDelete(item._id)} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
