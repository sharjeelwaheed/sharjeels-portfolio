'use client'
import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion'
import { GithubIcon } from '@/components/ui/SocialIcons'
import SectionHeading from '@/components/ui/SectionHeading'
import api from '@/utils/api'

interface Project {
  _id: string
  title: string
  description: string
  imageUrl?: string
  techStack: string[]
  category: string
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
}

const EASE = [0.16, 1, 0.3, 1] as const

const CAT_META: Record<string, { sub: string; bg: string; glow: string }> = {
  ai:        { sub: 'AI-Powered Application',  bg: 'linear-gradient(135deg,#080010,#120020)', glow: 'rgba(150,50,255,0.22)' },
  web:       { sub: 'Web Application',          bg: 'linear-gradient(135deg,#00080f,#001018)', glow: 'rgba(0,120,255,0.18)' },
  fullstack: { sub: 'Full Stack Application',   bg: 'linear-gradient(135deg,#0f0400,#1e0800)', glow: 'rgba(255,77,0,0.28)' },
  backend:   { sub: 'Backend System',           bg: 'linear-gradient(135deg,#030d06,#051508)', glow: 'rgba(0,200,100,0.18)' },
  other:     { sub: 'Design & Creative Work',   bg: 'linear-gradient(135deg,#080608,#160d10)', glow: 'rgba(255,77,0,0.18)' },
}

function ProjectCard({
  project,
  index,
  active,
}: {
  project: Project
  index: number
  active: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const meta = CAT_META[project.category] ?? CAT_META.other

  return (
    <div
      style={{ width: '100vw', height: '100vh', flexShrink: 0, position: 'relative', overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Layer 1: Background ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: active ? 1 : 1.04 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ background: meta.bg }}
      >
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
            style={{ opacity: 0.72 }}
          />
        )}
      </motion.div>

      {/* ── Layer 2: Gradient overlays ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 35%, rgba(0,0,0,0.92) 100%),
                       radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.45) 100%)`,
        }}
      />

      {/* ── Layer 3: Hover shine ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 60%)' }}
      />

      {/* ── Layer 4: Top row ── */}
      <div className="absolute top-8 left-10 right-10 z-20 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="font-body tabular-nums"
            style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className="font-body"
            style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)' }}
          >
            {project.category.toUpperCase()}
          </span>
        </div>

        {/* VIEW PROJECT — hover only */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex gap-3 items-center"
        >
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-body font-semibold text-white"
              style={{
                background: '#0a0a0a',
                borderRadius: 999,
                padding: '0.55rem 1.2rem',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Checkout ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-body text-white/60 hover:text-white transition-colors"
              style={{
                fontSize: '0.75rem',
                padding: '0.55rem 1rem',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <GithubIcon size={13} /> Code
            </a>
          )}
        </motion.div>
      </div>

      {/* ── Layer 5: Centre tags ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        style={{ gap: '0.5rem', display: 'flex', flexWrap: 'wrap', padding: '0 20%' }}
      >
        {project.techStack.slice(0, 4).map((tag, ti) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={
              active
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 12, filter: 'blur(6px)' }
            }
            transition={{ delay: ti * 0.08 + 0.1, duration: 0.55, ease: EASE }}
            className="font-body text-xs px-3 py-1 rounded-full"
            style={{
              backdropFilter: 'blur(12px)',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.06em',
            }}
          >
            {tag}
          </motion.span>
        ))}
      </div>

      {/* ── Layer 6: Bottom row ── */}
      <div className="absolute bottom-10 left-10 right-10 z-20 flex items-end justify-between gap-8">

        {/* LEFT — title + subtitle + description */}
        <div className="flex flex-col gap-2 max-w-lg">
          <div style={{ overflow: 'hidden' }}>
            <motion.h3
              initial={{ y: '110%' }}
              animate={{ y: active ? '0%' : '110%' }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.05 }}
              className="font-heading font-black leading-none text-white"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                letterSpacing: '-0.03em',
              }}
            >
              {project.title}
            </motion.h3>
          </div>

          <motion.p
            animate={{ opacity: active ? 0.5 : 0, y: active ? 0 : 6 }}
            transition={{ duration: 0.45, ease: EASE, delay: active ? 0.15 : 0 }}
            className="font-body"
            style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            {meta.sub}
          </motion.p>

          <motion.p
            animate={{ opacity: active ? (hovered ? 0.85 : 0.45) : 0 }}
            transition={{ duration: 0.4, delay: active ? 0.25 : 0 }}
            className="font-body leading-relaxed"
            style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', maxWidth: 420 }}
          >
            {project.description}
          </motion.p>
        </div>

        {/* RIGHT — category labels */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {[project.category, ...(project.featured ? ['Featured'] : [])].map((cat) => (
            <motion.span
              key={cat}
              animate={{ opacity: active ? 1 : 0, x: active ? 0 : 14 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="font-body text-xs"
              style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              ● {cat}
            </motion.span>
          ))}
        </div>
      </div>

      {/* ── Layer 7: Active border glow ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          boxShadow: active
            ? 'inset 0 0 0 1px rgba(255,77,0,0.2), inset 0 0 120px rgba(255,77,0,0.05)'
            : 'inset 0 0 0 0px transparent',
        }}
        transition={{ duration: 0.6, ease: EASE }}
      />

      {/* ── Layer 8: Bottom gradient sweep ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 1,
          background: 'linear-gradient(to right, transparent, #FF4D00, #FF2D55, transparent)',
        }}
        animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      />
    </div>
  )
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)
  const [winW, setWinW] = useState(1440)

  useEffect(() => {
    api.get('/projects')
      .then((r: { data: Project[] }) => {
        setProjects(r.data.filter((p) => p.featured))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    setWinW(window.innerWidth)
    const h = () => setWinW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const xPx = useMotionValue(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (projects.length === 0) return
    setActiveIdx(Math.min(Math.round(v * (projects.length - 1)), projects.length - 1))
    xPx.set(-v * (projects.length - 1) * winW)
  })

  const x = useSpring(xPx, { stiffness: 72, damping: 20, mass: 1 })

  if (loading || projects.length === 0) {
    return (
      <section id="projects" style={{ background: '#0e0e0e', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#FF4D00', borderTopColor: 'transparent' }} />
      </section>
    )
  }

  return (
    <section
      id="projects"
      ref={containerRef}
      style={{ height: `${projects.length * 100}vh`, position: 'relative' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Horizontal track */}
        <motion.div
          style={{
            x,
            width: `${projects.length * 100}vw`,
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            height: '100%',
          }}
        >
          {projects.map((p, i) => (
            <ProjectCard key={p._id} project={p} index={i} active={activeIdx === i} />
          ))}
        </motion.div>

        {/* Section label — top left overlay */}
        <div className="absolute top-8 left-10 z-30 pointer-events-none">
          <motion.p
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: EASE }}
            className="font-body text-xs tracking-widest uppercase"
            style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}
          >
            Selected Projects
          </motion.p>
        </div>

        {/* Progress dots — right centre */}
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2"
          style={{ pointerEvents: 'none' }}
        >
          {projects.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: activeIdx === i ? 3 : 2,
                height: activeIdx === i ? 28 : 8,
                background: activeIdx === i
                  ? 'linear-gradient(to bottom, #FF4D00, #FF2D55)'
                  : 'rgba(255,255,255,0.18)',
                opacity: activeIdx === i ? 1 : 0.45,
              }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ borderRadius: 999 }}
            />
          ))}
          <motion.span
            className="font-body tabular-nums mt-2"
            style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}
          >
            {String(activeIdx + 1).padStart(2, '0')}/{String(projects.length).padStart(2, '0')}
          </motion.span>
        </div>

        {/* Scroll hint — bottom centre */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pointer-events-none"
          animate={{ opacity: activeIdx > 0 ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="h-[1px] w-8"
            style={{ background: 'rgba(255,255,255,0.2)' }}
            animate={{ scaleX: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="font-body text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Scroll
          </span>
          <motion.div
            className="h-[1px] w-8"
            style={{ background: 'rgba(255,255,255,0.2)' }}
            animate={{ scaleX: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </motion.div>
      </div>
    </section>
  )
}
