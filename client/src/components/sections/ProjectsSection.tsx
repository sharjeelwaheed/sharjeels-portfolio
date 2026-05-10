import { useRef, useEffect, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
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
}

const CAT_GLOW: Record<string, string> = {
  ai:        '160,60,255',
  web:       '0,140,255',
  fullstack: '255,77,0',
  backend:   '0,200,110',
  other:     '255,77,0',
}
const CAT_SUB: Record<string, string> = {
  ai:        'AI · Machine Learning',
  web:       'Web Application',
  fullstack: 'Full Stack',
  backend:   'Backend · API',
  other:     'Design · Creative',
}

// ─── One cinematic scene — all hooks at top, no early returns ─────────────
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
  const s0  = index / total
  const s1  = (index + 1) / total
  const dur = s1 - s0

  // ── ALL hooks at the top — no conditions, no JSX calls ──
  const rawOpacity = useTransform(scrollYProgress,
    [s0, s0 + dur * 0.22, s0 + dur * 0.78, s1],
    [0, 1, 1, 0])
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 24 })

  const numY = useTransform(scrollYProgress, [s0, s1], ['4%', '-4%'])

  const portalScale = useTransform(scrollYProgress,
    [s0, s0 + dur * 0.25, s0 + dur * 0.75, s1],
    [0.84, 1, 1, 0.95])
  const portalY = useTransform(scrollYProgress,
    [s0, s0 + dur * 0.25, s0 + dur * 0.75, s1],
    [70, 0, 0, -28])
  const rawBlur = useTransform(scrollYProgress, [s0, s0 + dur * 0.22], [14, 0])
  const portalFilter = useTransform(rawBlur, v => `blur(${v}px)`)

  const imgParallax = useTransform(scrollYProgress, [s0, s1], ['6%', '-6%'])

  const titleY = useTransform(scrollYProgress,
    [s0, s0 + dur * 0.25, s0 + dur * 0.75, s1],
    [90, 0, 0, -35])
  const titleOpacity = useTransform(scrollYProgress,
    [s0, s0 + dur * 0.2, s0 + dur * 0.8, s1],
    [0, 1, 1, 0])

  const fgY = useTransform(scrollYProgress,
    [s0, s0 + dur * 0.25, s0 + dur * 0.75, s1],
    [110, 0, 0, -45])
  const fgOpacity = useTransform(scrollYProgress,
    [s0, s0 + dur * 0.18, s0 + dur * 0.82, s1],
    [0, 1, 1, 0])

  const metaY = useTransform(scrollYProgress,
    [s0, s0 + dur * 0.3, s1],
    [40, 0, -18])
  const metaOpacity = useTransform(scrollYProgress,
    [s0 + dur * 0.15, s0 + dur * 0.32, s0 + dur * 0.78, s1],
    [0, 1, 1, 0])

  const glowRgb = CAT_GLOW[project.category] ?? CAT_GLOW.other
  const sub     = CAT_SUB[project.category]  ?? CAT_SUB.other

  return (
    <motion.div style={{ opacity, position: 'absolute', inset: 0, zIndex: 1 }}>

      {/* LAYER 0 — atmospheric glow */}
      <div className="absolute pointer-events-none" style={{
        width: '85vw', height: '85vw',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-55%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${glowRgb},0.18) 0%, transparent 65%)`,
        filter: 'blur(70px)',
      }} />
      <div className="absolute pointer-events-none" style={{
        width: '40vw', height: '40vw',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-52%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${glowRgb},0.12) 0%, transparent 70%)`,
        filter: 'blur(30px)',
      }} />

      {/* LAYER 1 — giant ghost number (slowest) */}
      <motion.div
        style={{ y: numY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 'clamp(14rem, 32vw, 26rem)',
          fontWeight: 900,
          letterSpacing: '-0.07em',
          lineHeight: 1,
          color: 'rgba(255,255,255,0.025)',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </motion.div>

      {/* LAYER 2 — portal card (mid-ground) */}
      <motion.div
        style={{ scale: portalScale, y: portalY, filter: portalFilter }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div style={{
          width: 'min(72vw, 920px)',
          height: 'min(60vh, 520px)',
          borderRadius: 18,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 50px 120px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05)',
        }}>
          {project.imageUrl ? (
            <motion.img
              src={project.imageUrl}
              alt={project.title}
              style={{
                y: imgParallax,
                width: '100%',
                height: '118%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
                marginTop: '-9%',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg,#1a0800,#2d0a00)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: '8rem', fontWeight: 900,
                background: 'linear-gradient(135deg,#FF4D00,#FF2D55)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                opacity: 0.18,
              }}>{project.title[0]}</span>
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 35%, rgba(0,0,0,0.65) 100%)',
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            boxShadow: `inset 0 0 0 1px rgba(${glowRgb},0.25)`,
            borderRadius: 18,
          }} />
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
            height: 2,
            background: 'linear-gradient(to right, transparent, #FF4D00 30%, #FF2D55 70%, transparent)',
          }} />
        </div>
      </motion.div>

      {/* LAYER 3 — title overlapping portal bottom */}
      <motion.div style={{
        y: titleY,
        opacity: titleOpacity,
        position: 'absolute',
        bottom: '22%',
        left: 0, right: 0,
        zIndex: 3,
        padding: '0 max(2.5rem, calc((100% - min(72vw,920px))/2))',
        pointerEvents: 'none',
      }}>
        <h3 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          color: '#ffffff',
          textShadow: '0 4px 40px rgba(0,0,0,0.6)',
        }}>
          {project.title}
        </h3>
      </motion.div>

      {/* LAYER 4 — foreground silhouette (fastest, closest) */}
      <motion.div style={{
        y: fgY,
        opacity: fgOpacity,
        position: 'absolute',
        bottom: '-4%',
        left: '50%',
        x: '-50%',
        zIndex: 4,
        width: 'min(65vw, 800px)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        <img
          src="/images/scene-foreground.png"
          alt=""
          aria-hidden
          style={{
            width: '100%',
            display: 'block',
            filter: 'invert(1) brightness(0.9)',
            mixBlendMode: 'screen',
          }}
        />
      </motion.div>

      {/* LAYER 5 — meta + buttons */}
      <motion.div style={{
        y: metaY,
        opacity: metaOpacity,
        position: 'absolute',
        bottom: '6%',
        left: 0, right: 0,
        zIndex: 5,
        padding: '0 max(2.5rem, calc((100% - min(72vw,920px))/2))',
      }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <p className="font-body uppercase tracking-widest" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>
              {sub}
            </p>
            <p className="font-body leading-relaxed" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.38)', maxWidth: 360 }}>
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              {project.techStack.slice(0, 4).map(tag => (
                <span key={tag} className="font-body text-xs px-2.5 py-0.5 rounded-full" style={{
                  color: '#FF4D00',
                  background: 'rgba(255,77,0,0.1)',
                  border: '1px solid rgba(255,77,0,0.2)',
                  letterSpacing: '0.04em',
                }}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="font-body font-bold text-black hover:scale-105 active:scale-95 transition-transform"
                style={{
                  background: '#ffffff', borderRadius: 999,
                  padding: '0.6rem 1.4rem', fontSize: '0.72rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                }}>
                Checkout ↗
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-body text-white/50 hover:text-white transition-colors"
                style={{
                  fontSize: '0.72rem', padding: '0.6rem 1rem',
                  borderRadius: 999, background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                <GithubIcon size={12} /> Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Progress dots ────────────────────────────────────────────────────────
function ProgressDots({ total, scrollYProgress }: { total: number; scrollYProgress: MotionValue<number> }) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    return scrollYProgress.on('change', v => {
      setActive(Math.min(Math.round(v * (total - 1)), total - 1))
    })
  }, [total, scrollYProgress])

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div key={i}
          animate={{
            height: active === i ? 28 : 8,
            width: active === i ? 3 : 2,
            background: active === i ? 'linear-gradient(to bottom,#FF4D00,#FF2D55)' : 'rgba(255,255,255,0.2)',
            opacity: active === i ? 1 : 0.35,
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ borderRadius: 999 }}
        />
      ))}
      <span className="font-body tabular-nums mt-1" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>
        {String(active + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
      </span>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // useScroll must be at top — always called, even during loading
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Scroll hint opacity — must be at top before any returns
  const hintOpacity = useTransform(scrollYProgress, [0, 0.25], [0.55, 0])

  useEffect(() => {
    api.get('/projects')
      .then((r: { data: Project[] }) => {
        setProjects(r.data.filter(p => p.featured))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <section id="projects" style={{ background: '#080808', height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#FF4D00', borderTopColor: 'transparent' }} />
    </section>
  )

  if (!projects.length) return null

  return (
    <section
      id="projects"
      ref={containerRef}
      style={{ height: `${projects.length * 180}vh`, position: 'relative', background: '#080808' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#080808' }}>

        {/* Section label */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <p className="font-body text-xs tracking-widest uppercase text-center" style={{ color: '#FF4D00', letterSpacing: '0.22em' }}>
            Selected Projects
          </p>
        </div>

        {/* Cinematic scenes */}
        {projects.map((p, i) => (
          <ProjectScene
            key={p._id}
            project={p}
            index={i}
            total={projects.length}
            scrollYProgress={scrollYProgress}
          />
        ))}

        <ProgressDots total={projects.length} scrollYProgress={scrollYProgress} />

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pointer-events-none"
          style={{ opacity: hintOpacity }}
        >
          <span className="font-body text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>Scroll</span>
          <motion.div className="w-px bg-white/15" style={{ height: 28 }}
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
