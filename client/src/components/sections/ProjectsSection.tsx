import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
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

function ProjectScene({
  project,
  index,
  total,
  active,
  scrollYProgress,
}: {
  project: Project
  index: number
  total: number
  active: boolean
  scrollYProgress: MotionValue<number>
}) {
  const s0   = index / total
  const s1   = (index + 1) / total
  const dur  = s1 - s0
  const is0  = index === 0

  // Crossfade opacity — scene 0 starts visible, others fade in before their range
  const fadeIn  = is0 ? 0 : Math.max(0, s0 - dur * 0.2)
  const peakIn  = is0 ? 0 : s0 + dur * 0.15
  const peakOut = s1 - dur * 0.2
  const fadeOut = s1

  const opacity = useTransform(scrollYProgress,
    [fadeIn, peakIn, peakOut, fadeOut],
    [is0 ? 1 : 0, 1, 1, 0])

  // Portal entry — spring-smoothed for buttery feel
  const rawPortalY = useTransform(scrollYProgress,
    [s0, s0 + dur * 0.3, peakOut, fadeOut],
    [is0 ? 0 : 60, 0, 0, -24])
  const portalY = useSpring(rawPortalY, { stiffness: 55, damping: 18, mass: 1 })

  const rawPortalScale = useTransform(scrollYProgress,
    [s0, s0 + dur * 0.3, peakOut, fadeOut],
    [is0 ? 1 : 0.86, 1, 1, 0.96])
  const portalScale = useSpring(rawPortalScale, { stiffness: 55, damping: 18, mass: 1 })

  const rawBlur = useTransform(scrollYProgress, [s0, s0 + dur * 0.25], [is0 ? 0 : 12, 0])
  const portalFilter = useTransform(rawBlur, v => `blur(${v}px)`)

  // Image parallax inside portal
  const imgY = useTransform(scrollYProgress, [s0, s1], ['5%', '-5%'])

  // Title — slightly faster than portal
  const rawTitleY = useTransform(scrollYProgress,
    [fadeIn, peakIn, peakOut, fadeOut],
    [is0 ? 0 : 70, 0, 0, -30])
  const titleY = useSpring(rawTitleY, { stiffness: 60, damping: 20, mass: 0.9 })
  const titleOpacity = useTransform(scrollYProgress,
    [fadeIn, peakIn + dur * 0.06, peakOut, fadeOut],
    [is0 ? 1 : 0, 1, 1, 0])

  // Meta row
  const rawMetaY = useTransform(scrollYProgress,
    [fadeIn, peakIn + dur * 0.05, peakOut, fadeOut],
    [is0 ? 0 : 50, 0, 0, -22])
  const metaY = useSpring(rawMetaY, { stiffness: 65, damping: 20, mass: 0.85 })
  const metaOpacity = useTransform(scrollYProgress,
    [fadeIn, peakIn + dur * 0.1, peakOut, fadeOut],
    [is0 ? 1 : 0, 1, 1, 0])

  // Atmospheric glow pulse — slow, subtle
  const glowScale = useTransform(scrollYProgress, [s0, s0 + dur * 0.5, s1], [0.9, 1.08, 0.95])
  const rawGlow = useSpring(glowScale, { stiffness: 20, damping: 14 })

  const glowRgb = CAT_GLOW[project.category] ?? CAT_GLOW.other
  const sub     = CAT_SUB[project.category]  ?? CAT_SUB.other

  return (
    <motion.div
      style={{ opacity, position: 'absolute', inset: 0, zIndex: 1 }}
      // Only the active scene captures pointer events — inactive scenes never block clicks
      animate={{ pointerEvents: active ? 'auto' : 'none' }}
    >
      {/* LAYER 0 — wide atmospheric glow */}
      <motion.div
        style={{ scale: rawGlow }}
        className="absolute pointer-events-none"
        aria-hidden
        css-layer="glow-wide"
      >
        <div style={{
          position: 'absolute',
          width: '90vw', height: '90vw',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-58%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${glowRgb},0.15) 0%, transparent 60%)`,
          filter: 'blur(80px)',
        }} />
      </motion.div>
      {/* tight inner glow */}
      <div className="absolute pointer-events-none" aria-hidden style={{
        width: '38vw', height: '38vw',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-54%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${glowRgb},0.1) 0%, transparent 70%)`,
        filter: 'blur(28px)',
      }} />

      {/* Decorative ring behind portal */}
      <div className="absolute pointer-events-none" aria-hidden style={{
        width: 'min(78vw, 980px)',
        height: 'min(68vh, 560px)',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-52%)',
        borderRadius: 24,
        border: `1px solid rgba(${glowRgb},0.08)`,
        boxShadow: `0 0 80px rgba(${glowRgb},0.06)`,
      }} />

      {/* LAYER 1 — ghost number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
        <span style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 'clamp(14rem, 30vw, 24rem)',
          fontWeight: 900,
          letterSpacing: '-0.07em',
          lineHeight: 1,
          color: 'rgba(255,255,255,0.022)',
          transform: 'translateY(-4%)',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* LAYER 2 — portal card */}
      <motion.div
        style={{ y: portalY, scale: portalScale, filter: portalFilter }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div style={{
          width: 'min(70vw, 900px)',
          height: 'min(58vh, 510px)',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 60px 140px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)',
        }}>
          {project.imageUrl ? (
            <motion.img
              src={project.imageUrl}
              alt={project.title}
              style={{
                y: imgY,
                width: '100%',
                height: '115%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
                marginTop: '-7.5%',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg,#1a0800,#2d0a00)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '8rem', fontWeight: 900,
                background: 'linear-gradient(135deg,#FF4D00,#FF2D55)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.18,
              }}>{project.title[0]}</span>
            </div>
          )}
          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 30%, rgba(0,0,0,0.6) 100%)',
          }} />
          {/* Glow border */}
          <div className="absolute inset-0 pointer-events-none" style={{
            borderRadius: 20,
            boxShadow: `inset 0 0 0 1px rgba(${glowRgb},0.22)`,
          }} />
          {/* Bottom line */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
            height: 2,
            background: 'linear-gradient(to right, transparent, #FF4D00 28%, #FF2D55 72%, transparent)',
          }} />
        </div>
      </motion.div>

      {/* LAYER 3 — title overlapping portal */}
      <motion.div style={{
        y: titleY, opacity: titleOpacity,
        position: 'absolute', bottom: '21%', left: 0, right: 0, zIndex: 3,
        padding: '0 max(2.5rem, calc((100% - min(70vw,900px))/2))',
        pointerEvents: 'none',
      }}>
        <h3 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 'clamp(2.2rem, 5.5vw, 5rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          color: '#ffffff',
          textShadow: '0 2px 30px rgba(0,0,0,0.5)',
        }}>
          {project.title}
        </h3>
      </motion.div>

      {/* LAYER 4 — meta + buttons */}
      <motion.div style={{
        y: metaY, opacity: metaOpacity,
        position: 'absolute', bottom: '7%', left: 0, right: 0, zIndex: 4,
        padding: '0 max(2.5rem, calc((100% - min(70vw,900px))/2))',
      }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <p className="font-body uppercase" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em' }}>
              {sub}
            </p>
            <p className="font-body leading-relaxed" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.36)', maxWidth: 360 }}>
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              {project.techStack.slice(0, 4).map(tag => (
                <span key={tag} className="font-body text-xs px-2.5 py-0.5 rounded-full" style={{
                  color: '#FF4D00', background: 'rgba(255,77,0,0.1)', border: '1px solid rgba(255,77,0,0.2)', letterSpacing: '0.04em',
                }}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body font-bold text-black hover:scale-105 active:scale-95 transition-transform"
                style={{
                  background: '#ffffff', borderRadius: 999,
                  padding: '0.62rem 1.4rem', fontSize: '0.72rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  cursor: 'pointer',
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
                className="flex items-center gap-1.5 font-body text-white/50 hover:text-white transition-colors"
                style={{
                  fontSize: '0.72rem', padding: '0.62rem 1rem',
                  borderRadius: 999, background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
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
            height: active === i ? 28 : 8, width: active === i ? 3 : 2,
            background: active === i ? 'linear-gradient(to bottom,#FF4D00,#FF2D55)' : 'rgba(255,255,255,0.18)',
            opacity: active === i ? 1 : 0.35,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ borderRadius: 999 }}
        />
      ))}
      <span className="font-body tabular-nums mt-1" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>
        {String(active + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
      </span>
    </div>
  )
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [projects, setProjects]   = useState<Project[]>([])
  const [loading, setLoading]     = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const hintOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 0])

  useEffect(() => {
    return scrollYProgress.on('change', v => {
      setActiveIdx(prev => {
        const next = Math.min(Math.round(v * (projects.length - 1)), Math.max(0, projects.length - 1))
        return prev === next ? prev : next
      })
    })
  }, [scrollYProgress, projects.length])

  useEffect(() => {
    api.get('/projects')
      .then((r: { data: Project[] }) => { setProjects(r.data.filter(p => p.featured)); setLoading(false) })
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

        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <p className="font-body text-xs tracking-widest uppercase text-center" style={{ color: '#FF4D00', letterSpacing: '0.22em' }}>
            Selected Projects
          </p>
        </div>

        {projects.map((p, i) => (
          <ProjectScene
            key={p._id}
            project={p}
            index={i}
            total={projects.length}
            active={activeIdx === i}
            scrollYProgress={scrollYProgress}
          />
        ))}

        <ProgressDots total={projects.length} scrollYProgress={scrollYProgress} />

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pointer-events-none"
          style={{ opacity: hintOpacity }}
        >
          <span className="font-body text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>Scroll</span>
          <motion.div className="w-px bg-white/10" style={{ height: 28 }}
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
