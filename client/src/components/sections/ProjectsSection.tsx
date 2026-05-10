import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
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

const EASE = [0.16, 1, 0.3, 1] as const

const CAT_GLOW: Record<string, string> = {
  ai:        'rgba(160,60,255,0.18)',
  web:       'rgba(0,140,255,0.15)',
  fullstack: 'rgba(255,77,0,0.2)',
  backend:   'rgba(0,200,110,0.15)',
  other:     'rgba(255,77,0,0.16)',
}

function ProjectCard({ project, index, active }: { project: Project; index: number; active: boolean }) {
  const [hovered, setHovered] = useState(false)
  const glow = CAT_GLOW[project.category] ?? CAT_GLOW.other

  return (
    <div
      style={{
        width: '100vw', height: '100vh', flexShrink: 0,
        position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 2rem',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 70% 60% at 50% 48%, ${glow} 0%, transparent 70%)`,
        opacity: active ? 1 : 0,
        transition: 'opacity 0.7s ease',
      }} />

      <motion.div
        animate={{ scale: active ? 1 : 0.95, opacity: active ? 1 : 0.45 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden w-full"
        style={{
          maxWidth: 1060,
          height: 'min(74vh, 560px)',
          borderRadius: 20,
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: active
            ? '0 50px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,77,0,0.12)'
            : '0 20px 50px rgba(0,0,0,0.4)',
          display: 'flex',
          transition: 'box-shadow 0.6s ease',
        }}
      >
        {/* Image left 55% */}
        <div style={{ width: '55%', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center top',
                transform: active ? 'scale(1)' : 'scale(1.04)',
                transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)',
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
                fontSize: '7rem', fontWeight: 900,
                background: 'linear-gradient(135deg,#FF4D00,#FF2D55)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.15,
              }}>{project.title[0]}</span>
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to right, transparent 55%, #0f0f0f 100%)',
          }} />
          {project.featured && (
            <div className="absolute top-4 left-4 font-body text-xs px-3 py-1 rounded-full" style={{
              background: 'rgba(255,77,0,0.15)',
              border: '1px solid rgba(255,77,0,0.3)',
              color: '#FF4D00', letterSpacing: '0.06em',
            }}>Featured</div>
          )}
        </div>

        {/* Content right 45% */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(1.5rem,3vw,2.8rem)', paddingLeft: 'clamp(1rem,2vw,1.5rem)',
          position: 'relative', zIndex: 1,
        }}>
          <span style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontSize: 'clamp(3rem,7vw,6rem)',
            fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1,
            background: 'linear-gradient(135deg,#FF4D00,#FF2D55)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem', display: 'block',
            opacity: active ? 1 : 0.3, transition: 'opacity 0.5s ease',
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>

          <div style={{ overflow: 'hidden', marginBottom: '0.6rem' }}>
            <h3 style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontSize: 'clamp(1.4rem,2.8vw,2.4rem)',
              fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, color: '#ffffff',
              transform: active ? 'translateY(0)' : 'translateY(110%)',
              transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
            }}>
              {project.title}
            </h3>
          </div>

          <p style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 'clamp(0.8rem,1.2vw,0.92rem)',
            color: 'rgba(255,255,255,0.38)', lineHeight: 1.65,
            maxWidth: 360, marginBottom: '1.2rem',
            opacity: active ? 1 : 0, transition: 'opacity 0.5s ease 0.1s',
          }}>
            {project.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.6rem' }}>
            {project.techStack.slice(0, 4).map(tag => (
              <span key={tag} className="font-body text-xs px-2.5 py-0.5 rounded-full" style={{
                color: '#FF4D00', background: 'rgba(255,77,0,0.08)',
                border: '1px solid rgba(255,77,0,0.18)', letterSpacing: '0.04em',
                opacity: active ? 1 : 0, transition: 'opacity 0.4s ease 0.15s',
              }}>{tag}</span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  background: '#ffffff', color: '#000000',
                  borderRadius: 999, padding: '0.58rem 1.3rem',
                  fontSize: '0.72rem', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  textDecoration: 'none',
                  opacity: active ? 1 : 0,
                  transform: hovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.2s ease, opacity 0.4s ease',
                }}
                onClick={e => e.stopPropagation()}
              >
                Checkout ↗
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  color: 'rgba(255,255,255,0.5)', borderRadius: 999,
                  padding: '0.58rem 0.9rem', fontSize: '0.72rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  textDecoration: 'none',
                  opacity: active ? 1 : 0, transition: 'opacity 0.4s ease',
                }}
              >
                <GithubIcon size={13} /> Code
              </a>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
          height: 2,
          background: 'linear-gradient(to right, transparent, #FF4D00 30%, #FF2D55 70%, transparent)',
          transform: active ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          borderRadius: '0 0 20px 20px',
        }} />
      </motion.div>
    </div>
  )
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [projects, setProjects]   = useState<Project[]>([])
  const [loading, setLoading]     = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)

  const xRaw = useMotionValue(0)
  const x    = useSpring(xRaw, { stiffness: 380, damping: 38, mass: 0.6 })

  useEffect(() => {
    api.get('/projects')
      .then((r: { data: Project[] }) => {
        setProjects(r.data.filter((p: Project) => p.featured))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!projects.length) return
    const section = sectionRef.current
    if (!section) return

    const n     = projects.length
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).lenis as { stop(): void; start(): void } | undefined

    let active         = false
    let currentIdx     = 0
    let cooldown       = false
    let ignoreScroll   = false

    // Absolute document top of the section element
    const getSectionTop = () => section.getBoundingClientRect().top + window.scrollY

    // Snap the page scroll position to match the current project
    // so the scrollbar stays meaningful and lenis resumes from the right spot
    const snapPageTo = (idx: number) => {
      ignoreScroll = true
      window.scrollTo({ top: getSectionTop() + idx * window.innerHeight, behavior: 'instant' as ScrollBehavior })
      setTimeout(() => { ignoreScroll = false }, 80)
    }

    const goTo = (idx: number) => {
      currentIdx = idx
      setActiveIdx(idx)
      xRaw.set(-idx * window.innerWidth)
      snapPageTo(idx)
    }

    // Called when section enters sticky state — always show project 0 first
    const enter = () => {
      if (active) return
      active = true
      lenis?.stop()
      goTo(0)
    }

    // Called when leaving the section (last project scrolled past, or scrolled back above)
    const exit = () => {
      if (!active) return
      active = false
      lenis?.start()
    }

    // Detect sticky state via scroll position
    const onScroll = () => {
      if (ignoreScroll) return
      const rect   = section.getBoundingClientRect()
      const pinned = rect.top <= 1 && rect.bottom > window.innerHeight - 1
      if (pinned && !active) enter()
      if (!pinned && active) exit()
    }

    // Intercept wheel — advance one project per gesture
    const onWheel = (e: WheelEvent) => {
      if (!active) return
      e.preventDefault()
      if (cooldown) return

      if (e.deltaY > 0) {
        // Scroll down
        if (currentIdx < n - 1) {
          cooldown = true
          setTimeout(() => { cooldown = false }, 720)
          goTo(currentIdx + 1)
        } else {
          // Past the last project — release control to Lenis
          exit()
        }
      } else if (e.deltaY < 0) {
        // Scroll up
        if (currentIdx > 0) {
          cooldown = true
          setTimeout(() => { cooldown = false }, 720)
          goTo(currentIdx - 1)
        } else {
          // Before the first project — release control back (go to Services)
          exit()
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel',  onWheel,  { passive: false })

    // Fire once to handle the case where page loaded already inside the section
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel',  onWheel)
      lenis?.start()
    }
  }, [projects, xRaw])

  if (loading) return (
    <section id="projects" style={{ background: '#080808', height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#FF4D00', borderTopColor: 'transparent' }} />
    </section>
  )
  if (!projects.length) return null

  const n = projects.length

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        // n+1 so there's a full viewport of "exit" scroll space at the end
        height: `${(n + 1) * 100}vh`,
        position: 'relative',
        background: '#080808',
      }}
    >
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden', background: '#080808',
      }}>
        {/* Section label */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <p className="font-body text-xs tracking-widest uppercase text-center" style={{ color: '#FF4D00', letterSpacing: '0.22em' }}>
            Selected Projects
          </p>
        </div>

        {/* Horizontal track */}
        <motion.div style={{
          x,
          display: 'flex',
          width: `${n * 100}vw`,
          height: '100%',
          position: 'absolute', top: 0, left: 0,
          willChange: 'transform',
        }}>
          {projects.map((p, i) => (
            <ProjectCard key={p._id} project={p} index={i} active={activeIdx === i} />
          ))}
        </motion.div>

        {/* Progress dots */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
          {projects.map((_, i) => (
            <motion.div key={i}
              animate={{
                height: activeIdx === i ? 28 : 8,
                width:  activeIdx === i ? 3 : 2,
                background: activeIdx === i
                  ? 'linear-gradient(to bottom,#FF4D00,#FF2D55)'
                  : 'rgba(255,255,255,0.2)',
                opacity: activeIdx === i ? 1 : 0.35,
              }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ borderRadius: 999 }}
            />
          ))}
          <span className="font-body tabular-nums mt-1" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>
            {String(activeIdx + 1).padStart(2, '0')}/{String(n).padStart(2, '0')}
          </span>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pointer-events-none"
          animate={{ opacity: activeIdx > 0 ? 0 : 0.55 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="h-px w-8 bg-white/20" animate={{ scaleX: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          <span className="font-body text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>Scroll</span>
          <motion.div className="h-px w-8 bg-white/20" animate={{ scaleX: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
        </motion.div>
      </div>
    </section>
  )
}
