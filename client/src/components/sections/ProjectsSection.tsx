import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from 'framer-motion'
import { GithubIcon } from '@/components/ui/SocialIcons'
import { useEffect, useState } from 'react'
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

// Per-category: accent glow color
const CAT_GLOW: Record<string, string> = {
  ai:        'rgba(160,60,255,0.22)',
  web:       'rgba(0,140,255,0.18)',
  fullstack: 'rgba(255,77,0,0.28)',
  backend:   'rgba(0,210,110,0.18)',
  other:     'rgba(255,77,0,0.2)',
}
const CAT_SUB: Record<string, string> = {
  ai:        'AI · Machine Learning',
  web:       'Web Application',
  fullstack: 'Full Stack',
  backend:   'Backend · API',
  other:     'Design · Creative',
}

// ─── One cinematic scene per project ───────────────────────────────────────
function ProjectScene({
  project,
  index,
  total,
  scrollYProgress,
}: {
  project: Project
  index: number
  total: number
  scrollYProgress: MotionValue<number>
}) {
  const s0 = index / total          // scene starts
  const s1 = (index + 1) / total    // scene ends
  const entryEnd  = s0 + (s1 - s0) * 0.28
  const exitStart = s0 + (s1 - s0) * 0.72

  // Scene-level motion values — scroll drives everything
  const rawOpacity = useTransform(scrollYProgress,
    [s0, entryEnd, exitStart, s1],
    [0,   1,        1,         0 ])
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 24 })

  const portalScale = useTransform(scrollYProgress,
    [s0, entryEnd, exitStart, s1],
    [0.86, 1, 1, 0.94])

  const portalY = useTransform(scrollYProgress,
    [s0, entryEnd, exitStart, s1],
    [60,  0,       0,        -30])

  const portalBlur = useTransform(scrollYProgress,
    [s0, entryEnd],
    [12, 0])

  // Image parallax inside the portal (moves slower than the card)
  const imgY = useTransform(scrollYProgress,
    [s0, s1],
    ['8%', '-8%'])

  // Background number drifts up (slowest layer)
  const numY = useTransform(scrollYProgress,
    [s0, s1],
    ['5%', '-5%'])

  // Title drifts up slightly faster than portal
  const titleY = useTransform(scrollYProgress,
    [s0, entryEnd, exitStart, s1],
    [80, 0, 0, -20])
  const titleOpacity = useTransform(scrollYProgress,
    [s0, entryEnd, exitStart, s1],
    [0, 1, 1, 0])

  // Tags/subtitle come in a bit later
  const metaOpacity = useTransform(scrollYProgress,
    [s0 + (s1-s0)*0.1, entryEnd + 0.02, exitStart, s1],
    [0, 1, 1, 0])
  const metaY = useTransform(scrollYProgress,
    [s0, entryEnd, s1],
    [40, 0, -15])

  const glow = CAT_GLOW[project.category] ?? CAT_GLOW.other
  const sub  = CAT_SUB[project.category]  ?? CAT_SUB.other
  const num  = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      style={{ opacity, position: 'absolute', inset: 0 }}
      className="flex flex-col items-center justify-center"
    >
      {/* ── LAYER 0: atmospheric radial glow ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '70vw', height: '70vw',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-55%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glow} 0%, transparent 68%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* ── LAYER 1: huge background project number (slowest parallax) ── */}
      <motion.div
        style={{ y: numY }}
        className="absolute pointer-events-none select-none"
        aria-hidden
      >
        <span
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 'clamp(12rem, 28vw, 22rem)',
            fontWeight: 900,
            letterSpacing: '-0.06em',
            lineHeight: 1,
            color: 'rgba(255,255,255,0.028)',
          }}
        >
          {num}
        </span>
      </motion.div>

      {/* ── LAYER 2: the portal card (mid-ground) ── */}
      <motion.div
        style={{
          scale: portalScale,
          y: portalY,
          filter: useTransform(portalBlur, (v) => `blur(${v}px)`),
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 'min(68vw, 860px)',
            height: 'min(58vh, 500px)',
            borderRadius: 20,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Cover image with inner parallax */}
          {project.imageUrl ? (
            <motion.img
              src={project.imageUrl}
              alt={project.title}
              style={{
                y: imgY,
                width: '100%',
                height: '116%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(135deg,#1a0800,#2d0a00)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: '8rem', fontWeight: 900,
                background: 'linear-gradient(135deg,#FF4D00,#FF2D55)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                opacity: 0.18,
              }}>
                {project.title[0]}
              </span>
            </div>
          )}

          {/* Portal gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)',
            }}
          />

          {/* Animated orange border glow */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(255,77,0,0.18)' }}
          />

          {/* Bottom sweep line */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: 2,
              background: 'linear-gradient(to right, transparent, #FF4D00, #FF2D55, transparent)',
            }}
          />
        </div>
      </motion.div>

      {/* ── LAYER 3: title — overlaps bottom edge of portal ── */}
      <motion.div
        style={{
          y: titleY,
          opacity: titleOpacity,
          position: 'absolute',
          bottom: 'calc(18% - 2rem)',
          left: 0, right: 0,
          zIndex: 3,
          padding: '0 max(2rem, calc((100% - min(68vw,860px))/2))',
        }}
      >
        <h3
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 'clamp(2.2rem, 5.5vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: '#ffffff',
          }}
        >
          {project.title}
        </h3>
      </motion.div>

      {/* ── LAYER 4: subtitle + tags + buttons (foremost text, fastest) ── */}
      <motion.div
        style={{
          y: metaY,
          opacity: metaOpacity,
          position: 'absolute',
          bottom: 'calc(8% + 0.5rem)',
          left: 0, right: 0,
          zIndex: 4,
          padding: '0 max(2rem, calc((100% - min(68vw,860px))/2))',
        }}
      >
        <div className="flex items-end justify-between gap-4 flex-wrap">
          {/* Left: sub + description + tags */}
          <div className="flex flex-col gap-2">
            <p
              className="font-body uppercase tracking-widest"
              style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em' }}
            >
              {sub}
            </p>
            <p
              className="font-body leading-relaxed"
              style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', maxWidth: 380 }}
            >
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {project.techStack.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="font-body text-xs px-2.5 py-0.5 rounded-full"
                  style={{
                    color: '#FF4D00',
                    background: 'rgba(255,77,0,0.1)',
                    border: '1px solid rgba(255,77,0,0.2)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body font-semibold text-black hover:scale-105 transition-transform"
                style={{
                  background: '#ffffff',
                  borderRadius: 999,
                  padding: '0.55rem 1.3rem',
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
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
                  fontSize: '0.72rem',
                  padding: '0.55rem 1rem',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <GithubIcon size={12} /> Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Progress dots (right edge, fixed to sticky container) ────────────────
function ProgressDots({ total, scrollYProgress }: { total: number; scrollYProgress: MotionValue<number> }) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      setActive(Math.min(Math.round(v * (total - 1)), total - 1))
    })
    return unsub
  }, [total, scrollYProgress])

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: active === i ? 28 : 8,
            width: active === i ? 3 : 2,
            background: active === i
              ? 'linear-gradient(to bottom, #FF4D00, #FF2D55)'
              : 'rgba(255,255,255,0.2)',
            opacity: active === i ? 1 : 0.4,
          }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{ borderRadius: 999 }}
        />
      ))}
      <span className="font-body tabular-nums mt-1" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>
        {String(active + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
      </span>
    </div>
  )
}

// ─── Main section ──────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/projects')
      .then((r: { data: Project[] }) => { setProjects(r.data.filter((p) => p.featured)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  if (loading) {
    return (
      <section id="projects" style={{ background: '#080808', height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#FF4D00', borderTopColor: 'transparent' }} />
      </section>
    )
  }
  if (!projects.length) return null

  // 180vh per project so each scene has breathing room
  const SCENE_VH = 180
  const totalHeight = projects.length * SCENE_VH

  return (
    <section
      id="projects"
      ref={containerRef}
      style={{ height: `${totalHeight}vh`, position: 'relative', background: '#080808' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#080808' }}>

        {/* Section label */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <p
            className="font-body text-xs tracking-widest uppercase text-center"
            style={{ color: '#FF4D00', letterSpacing: '0.22em' }}
          >
            Selected Projects
          </p>
        </div>

        {/* All scenes stacked — each fades in/out via scroll */}
        {projects.map((p, i) => (
          <ProjectScene
            key={p._id}
            project={p}
            index={i}
            total={projects.length}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* Progress dots */}
        <ProgressDots total={projects.length} scrollYProgress={scrollYProgress} />

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
          style={{
            opacity: useTransform(scrollYProgress, [0, 1 / projects.length], [0.6, 0]),
          }}
        >
          <span className="font-body text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>Scroll</span>
          <motion.div
            className="w-px bg-white/20"
            style={{ height: 32 }}
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
