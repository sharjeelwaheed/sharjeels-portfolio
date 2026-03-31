import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, MapPin, Calendar } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import GlassCard from '@/components/ui/GlassCard'
import { timelineLeft, timelineRight } from '@/utils/animations'
import api from '@/utils/api'

interface Experience {
  _id: string
  type: 'work' | 'education'
  title: string
  organization: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
  order: number
}

function TimelineEntry({ exp, index }: { exp: Experience; index: number }) {
  const isLeft = index % 2 === 0
  const variant = isLeft ? timelineLeft : timelineRight

  return (
    <div className={`relative flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:items-start gap-0`}>
      {/* Card side */}
      <div className="md:w-[calc(50%-2rem)] w-full">
        <motion.div
          variants={variant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <GlassCard className="p-5" hover={false}>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: exp.type === 'education' ? 'rgba(99,102,241,0.15)' : 'rgba(255,77,0,0.15)' }}
              >
                {exp.type === 'education'
                  ? <GraduationCap size={14} className="text-indigo-400" />
                  : <Briefcase size={14} className="text-accent-orange" />
                }
              </div>
              <span
                className="text-xs font-body px-2 py-0.5 rounded-full"
                style={{
                  background: exp.type === 'education' ? 'rgba(99,102,241,0.1)' : 'rgba(255,77,0,0.1)',
                  color: exp.type === 'education' ? '#818cf8' : '#FF4D00',
                }}
              >
                {exp.type === 'education' ? 'Education' : 'Work'}
              </span>
            </div>
            <h3 className="font-heading font-bold text-white text-lg mb-1">{exp.title}</h3>
            <p className="font-body text-white/60 font-medium mb-3">{exp.organization}</p>
            <div className="flex flex-wrap gap-3 mb-3">
              <span className="flex items-center gap-1 text-white/40 text-xs font-body">
                <Calendar size={12} />
                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
              </span>
              {exp.location && (
                <span className="flex items-center gap-1 text-white/40 text-xs font-body">
                  <MapPin size={12} /> {exp.location}
                </span>
              )}
            </div>
            {exp.description && (
              <p className="text-white/40 font-body text-sm leading-relaxed">{exp.description}</p>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex items-start justify-center w-16 pt-5 flex-shrink-0">
        <div className="relative">
          <div className="w-4 h-4 rounded-full" style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)', boxShadow: '0 0 12px rgba(255,77,0,0.6)' }} />
        </div>
      </div>

      {/* Empty side */}
      <div className="hidden md:block md:w-[calc(50%-2rem)]" />
    </div>
  )
}

export default function TimelineSection() {
  const [experiences, setExperiences] = useState<Experience[]>([])

  useEffect(() => {
    api.get('/experience').then((r) => setExperiences(r.data)).catch(() => {})
  }, [])

  return (
    <section id="experience" className="section-padding" style={{ background: '#0e0e0e' }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading label="Journey" title="Experience & Education" className="mb-16" />

        {/* Center line */}
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 -translate-x-1/2" />

          <div className="flex flex-col gap-10">
            {experiences.map((exp, i) => (
              <TimelineEntry key={exp._id} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
