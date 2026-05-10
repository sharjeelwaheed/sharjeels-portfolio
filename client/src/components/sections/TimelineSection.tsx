import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { GraduationCap, Briefcase, MapPin } from 'lucide-react'
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
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isWork = exp.type === 'work'
  const year = exp.startDate.split(' ').pop() ?? exp.startDate

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="group relative grid"
      style={{ gridTemplateColumns: '5rem 1px 1fr', gap: '0 0' }}
    >
      {/* Year column */}
      <div className="flex flex-col items-end pr-5 pt-1 select-none">
        <span
          className="font-heading font-black leading-none tabular-nums"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
            color: isWork ? 'rgba(255,77,0,0.5)' : 'rgba(129,140,248,0.5)',
            letterSpacing: '0.05em',
          }}
        >
          {year}
        </span>
      </div>

      {/* Line + dot column */}
      <div className="relative flex flex-col items-center">
        {/* Dot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.08 + 0.2, duration: 0.3, type: 'spring' }}
          className="relative z-10 flex-shrink-0"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            marginTop: 6,
            background: isWork
              ? 'linear-gradient(135deg, #FF4D00, #FF2D55)'
              : 'linear-gradient(135deg, #818cf8, #6366f1)',
            boxShadow: isWork
              ? '0 0 10px rgba(255,77,0,0.5)'
              : '0 0 10px rgba(129,140,248,0.5)',
          }}
        />
        {/* Connecting line to next */}
        <div
          className="flex-1 w-[1px] mt-2"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)' }}
        />
      </div>

      {/* Card column */}
      <div className="pl-6 pb-12">
        {/* Type tag */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-body tracking-widest uppercase px-2.5 py-1 rounded-full"
            style={{
              color: isWork ? '#FF4D00' : '#818cf8',
              background: isWork ? 'rgba(255,77,0,0.08)' : 'rgba(129,140,248,0.08)',
              border: `1px solid ${isWork ? 'rgba(255,77,0,0.2)' : 'rgba(129,140,248,0.2)'}`,
              letterSpacing: '0.12em',
            }}
          >
            {isWork ? <Briefcase size={10} /> : <GraduationCap size={10} />}
            {isWork ? 'Work' : 'Education'}
          </span>
          {exp.current && (
            <span
              className="inline-flex items-center gap-1 text-xs font-body"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              <span
                className="rounded-full"
                style={{ width: 5, height: 5, background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }}
              />
              Present
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-heading font-bold leading-tight mb-1.5"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          {exp.title}
        </h3>

        {/* Org + meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
          <span
            className="font-body font-medium"
            style={{
              fontSize: '0.9rem',
              color: isWork ? 'rgba(255,77,0,0.8)' : 'rgba(129,140,248,0.8)',
            }}
          >
            {exp.organization}
          </span>
          <span className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {exp.startDate} — {exp.current ? 'Present' : (exp.endDate || '—')}
          </span>
          {exp.location && (
            <span className="font-body text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
              <MapPin size={10} /> {exp.location}
            </span>
          )}
        </div>

        {/* Description */}
        {exp.description && (
          <p
            className="font-body leading-relaxed"
            style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.35)',
              maxWidth: '560px',
            }}
          >
            {exp.description}
          </p>
        )}

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: index * 0.08 + 0.35, duration: 0.5, ease: 'easeOut' }}
          className="mt-6 h-[1px] origin-left"
          style={{
            maxWidth: 320,
            background: isWork
              ? 'linear-gradient(to right, rgba(255,77,0,0.2), transparent)'
              : 'linear-gradient(to right, rgba(129,140,248,0.2), transparent)',
          }}
        />
      </div>
    </motion.div>
  )
}

export default function TimelineSection() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const headingRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-60px' })

  useEffect(() => {
    api.get('/experience').then((r) => setExperiences(r.data)).catch(() => {})
  }, [])

  const sorted = [...experiences].sort((a, b) => a.order - b.order)

  return (
    <section id="experience" style={{ background: '#0b0b0b', padding: 'clamp(5rem,10vw,8rem) 0' }}>
      <div className="max-w-4xl mx-auto px-6">

        {/* Heading */}
        <div ref={headingRef} className="mb-16">
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            animate={headingInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-body tracking-widest uppercase mb-4 block"
            style={{ color: '#FF4D00', letterSpacing: '0.2em' }}
          >
            Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-black leading-none"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              color: '#ffffff',
              letterSpacing: '-0.03em',
            }}
          >
            Experience &<br />
            <span style={{ background: 'linear-gradient(135deg,#FF4D00,#FF2D55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Education
            </span>
          </motion.h2>
        </div>

        {/* Timeline entries */}
        <div>
          {sorted.map((exp, i) => (
            <TimelineEntry key={exp._id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
