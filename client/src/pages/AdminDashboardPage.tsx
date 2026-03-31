import { useEffect, useState } from 'react'
import { FolderKanban, Wrench, Eye, EyeOff } from 'lucide-react'
import api from '@/utils/api'

interface Stats {
  totalProjects: number
  visibleProjects: number
  hiddenProjects: number
  totalSkills: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalProjects: 0, visibleProjects: 0, hiddenProjects: 0, totalSkills: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/projects/all'),
      api.get('/skills'),
    ]).then(([projRes, skillRes]) => {
      const projects = projRes.data
      setStats({
        totalProjects: projects.length,
        visibleProjects: projects.filter((p: { visible: boolean }) => p.visible).length,
        hiddenProjects: projects.filter((p: { visible: boolean }) => !p.visible).length,
        totalSkills: skillRes.data.length,
      })
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Projects', value: stats.totalProjects, icon: FolderKanban, color: '#FF4D00' },
    { label: 'Visible', value: stats.visibleProjects, icon: Eye, color: '#22c55e' },
    { label: 'Hidden', value: stats.hiddenProjects, icon: EyeOff, color: '#6b7280' },
    { label: 'Total Skills', value: stats.totalSkills, icon: Wrench, color: '#818cf8' },
  ]

  return (
    <div className="p-8">
      <h1 className="font-heading font-bold text-white text-2xl mb-2">Dashboard</h1>
      <p className="text-white/40 font-body text-sm mb-8">Welcome back! Here's your portfolio overview.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/40 text-sm font-body">{card.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${card.color}20` }}>
                  <Icon size={16} style={{ color: card.color }} />
                </div>
              </div>
              <p className="font-heading font-bold text-white text-3xl">{card.value}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-10 glass rounded-2xl p-6">
        <h2 className="font-heading font-semibold text-white text-lg mb-3">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Manage Projects', href: '/admin/projects' },
            { label: 'Manage Skills', href: '/admin/skills' },
            { label: 'Edit About', href: '/admin/about' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white border border-white/10 hover:border-accent-orange transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
