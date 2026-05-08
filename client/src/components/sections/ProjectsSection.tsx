import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { GithubIcon } from '@/components/ui/SocialIcons'
import SectionHeading from '@/components/ui/SectionHeading'
import { TECH_COLORS } from '@/utils/constants'
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

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const cardInnerRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    api.get('/projects')
      .then((r: { data: Project[] }) => { setProjects(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading || projects.length === 0) return

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const cards = cardInnerRefs.current.filter(Boolean)

        cards.forEach((inner, i) => {
          if (i === cards.length - 1) return

          // Scale + dim as the next card scrolls over
          gsap.to(inner, {
            scale: 0.93,
            opacity: 0.4,
            ease: 'none',
            scrollTrigger: {
              trigger: inner,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          })
        })

        ScrollTrigger.refresh()
      })

      return () => ctx.revert()
    }, 100)

    return () => clearTimeout(timer)
  }, [loading, projects])

  return (
    <section id="projects" style={{ background: '#0e0e0e' }}>
      {/* Heading */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ height: '40vh', paddingTop: '5rem' }}
      >
        <SectionHeading label="My Work" title="Selected Projects" align="center" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center" style={{ height: '60vh' }}>
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{ borderColor: '#FF4D00', borderTopColor: 'transparent' }}
          />
        </div>
      ) : (
        /* Each wrapper is 100vh — CSS sticky stacks the cards */
        projects.map((project, i) => (
          <div key={project._id} style={{ height: '100vh' }}>
            <div
              ref={(el) => { if (el) cardInnerRefs.current[i] = el }}
              className="w-full flex items-center justify-center"
              style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                zIndex: 10 + i,
                padding: '0 1.5rem',
              }}
            >
              <div
                className="w-full max-w-6xl rounded-3xl overflow-hidden relative flex"
                style={{
                  background: 'linear-gradient(135deg,#111111 0%,#181818 100%)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                  height: 'min(78vh, 560px)',
                }}
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden flex-shrink-0"
                  style={{ width: '55%', height: '100%' }}
                >
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,#1a0800,#2d1000)' }}
                    >
                      <span
                        className="font-heading font-black text-8xl"
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          background: 'linear-gradient(135deg,#FF4D00,#FF2D55)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          opacity: 0.2,
                        }}
                      >
                        {project.title[0]}
                      </span>
                    </div>
                  )}
                  {/* Fade image into card */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to right,transparent 50%,#141414 100%)' }}
                  />
                  {project.featured && (
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-body"
                      style={{
                        background: 'rgba(255,77,0,0.15)',
                        border: '1px solid rgba(255,77,0,0.3)',
                        color: '#FF4D00',
                      }}
                    >
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div
                  className="flex flex-col justify-center flex-1 relative z-10"
                  style={{ padding: 'clamp(1.5rem,3vw,3rem)', paddingLeft: 'clamp(1rem,2vw,1.5rem)' }}
                >
                  <span
                    className="font-heading font-black leading-none mb-4 select-none block"
                    style={{
                      fontSize: 'clamp(3rem,6vw,5.5rem)',
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      background: 'linear-gradient(135deg,#FF4D00,#FF2D55)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <h3
                    className="font-heading font-bold text-white leading-tight mb-3"
                    style={{
                      fontSize: 'clamp(1.4rem,2.5vw,2.2rem)',
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {project.title}
                  </h3>

                  <p
                    className="font-body leading-relaxed mb-5"
                    style={{
                      fontSize: 'clamp(0.82rem,1.2vw,0.95rem)',
                      color: 'rgba(255,255,255,0.4)',
                      maxWidth: '380px',
                    }}
                  >
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-xs font-body"
                        style={{
                          color: TECH_COLORS[tech] || 'rgba(255,255,255,0.5)',
                          background: `${TECH_COLORS[tech] || '#ffffff'}10`,
                          border: `1px solid ${TECH_COLORS[tech] || '#ffffff'}20`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body text-white"
                        style={{ background: 'linear-gradient(135deg,#FF4D00,#FF2D55)' }}
                      >
                        Live <ArrowUpRight size={14} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body text-white/70 hover:text-white"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        <GithubIcon size={14} /> Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </section>
  )
}
