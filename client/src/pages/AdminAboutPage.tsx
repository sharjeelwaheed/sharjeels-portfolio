import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import api from '@/utils/api'

interface AboutForm {
  bio: string
  tagline: string
  photoUrl: string
  resumeUrl: string
}

interface Stat { label: string; value: string }
interface Highlight { icon: string; text: string }

export default function AdminAboutPage() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<AboutForm>()
  const [stats, setStats] = useState<Stat[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])

  useEffect(() => {
    api.get('/about').then((r: { data: { bio?: string; tagline?: string; photoUrl?: string; resumeUrl?: string; stats?: Stat[]; highlights?: Highlight[] } }) => {
      const data = r.data
      if (data) {
        reset({ bio: data.bio, tagline: data.tagline, photoUrl: data.photoUrl, resumeUrl: data.resumeUrl })
        setStats(data.stats || [])
        setHighlights(data.highlights || [])
      }
    }).catch(() => {})
  }, [reset])

  const onSubmit = async (data: AboutForm) => {
    try {
      await api.put('/about', { ...data, stats, highlights })
      toast.success('About updated')
    } catch { toast.error('Error saving') }
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-heading font-bold text-white text-2xl mb-8">Edit About</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div>
          <label className="block text-white/50 text-sm font-body mb-2">Bio *</label>
          <textarea {...register('bio', { required: true })} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body outline-none focus:border-accent-orange resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/50 text-sm font-body mb-2">Tagline</label>
            <input {...register('tagline')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body outline-none focus:border-accent-orange" />
          </div>
          <div>
            <label className="block text-white/50 text-sm font-body mb-2">Photo URL</label>
            <input {...register('photoUrl')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body outline-none focus:border-accent-orange" />
          </div>
        </div>
        <div>
          <label className="block text-white/50 text-sm font-body mb-2">Resume URL</label>
          <input {...register('resumeUrl')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body outline-none focus:border-accent-orange" />
        </div>

        {/* Stats */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-white/50 text-sm font-body">Stats</label>
            <button type="button" onClick={() => setStats([...stats, { label: '', value: '' }])} className="flex items-center gap-1 text-xs font-body text-accent-orange"><Plus size={12} /> Add</button>
          </div>
          <div className="flex flex-col gap-2">
            {stats.map((stat, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={stat.label} onChange={(e) => { const s = [...stats]; s[i].label = e.target.value; setStats(s) }} placeholder="Label" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none" />
                <input value={stat.value} onChange={(e) => { const s = [...stats]; s[i].value = e.target.value; setStats(s) }} placeholder="Value" className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none" />
                <button type="button" onClick={() => setStats(stats.filter((_, j) => j !== i))} className="text-white/30 hover:text-accent-red"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-white/50 text-sm font-body">Highlights</label>
            <button type="button" onClick={() => setHighlights([...highlights, { icon: '🚀', text: '' }])} className="flex items-center gap-1 text-xs font-body text-accent-orange"><Plus size={12} /> Add</button>
          </div>
          <div className="flex flex-col gap-2">
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={h.icon} onChange={(e) => { const hs = [...highlights]; hs[i].icon = e.target.value; setHighlights(hs) }} placeholder="Icon (emoji)" className="w-16 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none" />
                <input value={h.text} onChange={(e) => { const hs = [...highlights]; hs[i].text = e.target.value; setHighlights(hs) }} placeholder="Text" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-body outline-none" />
                <button type="button" onClick={() => setHighlights(highlights.filter((_, j) => j !== i))} className="text-white/30 hover:text-accent-red"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="self-start px-6 py-3 rounded-xl text-sm font-body text-white disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)' }}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
