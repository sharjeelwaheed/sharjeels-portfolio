import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion'
import { GithubIcon } from '@/components/ui/SocialIcons'
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
  visible?: boolean
}

const EASE = [0.16, 1, 0.3, 1] as const

const CAT_META: Record<string, { sub: string; bg: string }> = {
  ai:        { sub: 'AI-Powered Application',  bg: 'linear-gradient(135deg,#080010,#150025)' },
  web:       { sub: 'Web Application',          bg: 'linear-gradient(135deg,#00080f,#001520)' },
  fullstack: { sub: 'Full Stack Application',   bg: 'linear-gradient(135deg,#0f0400,#220900)' },
  backend:   { sub: 'Backend System',           bg: 'linear-gradient(135deg,#030d06,#061508)' },
  other:     { sub: 'Design & Creative Work',   bg: 'linear-gradient(135deg,#0a0608,#18090d)' },
}

function ProjectCard({ project, index, active }: { project: Project; index: number; active: boolean }) {
  const [hovered, setHovered] = useState(false)
  const meta = CAT_META[project.category] ?? CAT_META.other

  return (
    <div
      style={{ width: '100vw', height: '100vh', flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card container — not full bleed, contained with rounded corners */}
      <motion.div
        animate={{ scale: active ? 1 : 0.96, opacity: active ? 1 : 0.6 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative overflow-hidden rounded-3xl w-full"
        style={{
          maxWidth: 1100,
          height: 'min(78vh, 600px)',
          background: meta.bg,
          boxShadow: active ? '0 40px 80px rgba(0,0,0,0.6)' : '0 20px 40px rgba(0,0,0,0.3)',
        }}
      >
        {/* ── Background image ── */}
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
              opacity: 0.65,
            }}
          />
        )}

        {/* ── Gradient overlays ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.88) 100%)',
          }}
        />

        {/* ── Hover shine ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 55%)' }}
        />

        {/* ── Top row: index + checkout button ── */}
        <div className="absolute top-6 left-8 right-8 z-20 flex items-center justify-between">
          <span
            className="font-body tabular-nums"
            style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}
          >
            {String(index + 1).padStart(2, '0')} / {project.category.toUpperCase()}
          </span>

          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-body font-semibold text-black transition-transform hover:scale-105"
                style={{
                  background: '#ffffff',
                  borderRadius: 999,
                  padding: '0.5rem 1.2rem',
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
                className="flex items-center gap-1.5 font-body text-white/70 hover:text-white transition-colors"
                style={{
                  fontSize: '0.72rem',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.14)',
                }}
              >
                <GithubIcon size={12} /> Code
              </a>
            )}
          </div>
        </div>

        {/* ── Centre tags — only when active ── */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ flexWrap: 'wrap', gap: '0.4rem', padding: '0 25%' }}
        >
          {project.techStack.slice(0, 4).map((tag, ti) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={active
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 10, filter: 'blur(6px)' }
              }
              transition={{ delay: ti * 0.08 + 0.1, duration: 0.5, ease: EASE }}
              className="font-body text-xs px-3 py-1 rounded-full"
              style={{
                backdropFilter: 'blur(12px)',
                background: 'rgba(255,255,255,0.09)',
                border: '1px solid rgba(255,255,255,0.16)',
                color: 'rgba(255,255,255,0.8)',
                letterSpacing: '0.06em',
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* ── Bottom row: title + subtitle + description ── */}
        <div className="absolute bottom-8 left-8 right-8 z-20 flex items-end justify-between gap-6">
          <div className="flex flex-col gap-1.5" style={{ maxWidth: 480 }}>
            {/* Clip-up title */}
            <div style={{ overflow: 'hidden' }}>
              <motion.h3
                initial={{ y: '110%' }}
                animate={{ y: active ? '0%' : '110%' }}
                transition={{ duration: 0.72, ease: EASE, delay: 0.05 }}
                className="font-heading font-black text-white leading-none"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
                  letterSpacing: '-0.03em',
                }}
              >
                {project.title}
              </motion.h3>
            </div>

            <motion.p
              animate={{ opacity: active ? 0.45 : 0, y: active ? 0 : 6 }}
              transition={{ duration: 0.4, ease: EASE, delay: active ? 0.15 : 0 }}
              className="font-body uppercase tracking-widest"
              style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}
            >
              {meta.sub}
            </motion.p>

            <motion.p
              animate={{ opacity: active ? (hovered ? 0.85 : 0.45) : 0 }}
              transition={{ duration: 0.4, delay: active ? 0.25 : 0 }}
              className="font-body leading-relaxed"
              style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', maxWidth: 380 }}
            >
              {project.description}
            </motion.p>
          </div>

          {/* Category labels right */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {[project.category, ...(project.featured ? ['Featured'] : [])].map((cat) => (
              <motion.span
                key={cat}
                animate={{ opacity: active ? 0.4 : 0, x: active ? 0 : 12 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="font-body text-xs uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}
              >
                ● {cat}
              </motion.span>
            ))}
          </div>
        </div>

        {/* ── Active border glow ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          animate={{
            boxShadow: active
              ? 'inset 0 0 0 1px rgba(255,77,0,0.25), inset 0 0 80px rgba(255,77,0,0.06)'
              : 'inset 0 0 0 0px transparent',
          }}
          transition={{ duration: 0.6, ease: EASE }}
        />

        {/* ── Bottom gradient sweep ── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: 2,
            background: 'linear-gradient(to right, transparent, #FF4D00, #FF2D55, transparent)',
            borderRadius: '0 0 24px 24px',
          }}
          animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      </motion.div>
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
        // Show all visible projects, sorted by order
        setProjects(r.data)
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

  if (loading) {
    return (
      <section id="projects" style={{ background: '#0b0b0b', height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#FF4D00', borderTopColor: 'transparent' }} />
      </section>
    )
  }

  if (projects.length === 0) return null

  return (
    <section
      id="projects"
      ref={containerRef}
      style={{ height: `${projects.length * 100}vh`, position: 'relative', background: '#0b0b0b' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#0b0b0b' }}>

        {/* Section label */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
            className="font-body text-xs tracking-widest uppercase text-center"
            style={{ color: '#FF4D00', letterSpacing: '0.2em' }}
          >
            Selected Projects
          </motion.p>
        </div>

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

        {/* Progress dots — right centre */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
          {projects.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: activeIdx === i ? 3 : 2,
                height: activeIdx === i ? 28 : 8,
                background: activeIdx === i
                  ? 'linear-gradient(to bottom, #FF4D00, #FF2D55)'
                  : 'rgba(255,255,255,0.2)',
                opacity: activeIdx === i ? 1 : 0.4,
              }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ borderRadius: 999 }}
            />
          ))}
          <span
            className="font-body tabular-nums mt-1"
            style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}
          >
            {String(activeIdx + 1).padStart(2, '0')}/{String(projects.length).padStart(2, '0')}
          </span>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pointer-events-none"
          animate={{ opacity: activeIdx > 0 ? 0 : 0.6 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="h-px w-8 bg-white/20" animate={{ scaleX: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
          <span className="font-body text-xs tracking-widest uppercase text-white/30">Scroll</span>
          <motion.div className="h-px w-8 bg-white/20" animate={{ scaleX: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
        </motion.div>
      </div>
    </section>
  )
}
