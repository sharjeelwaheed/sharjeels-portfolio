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
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    api.get('/projects')
      .then((r: { data: Project[] }) => { setProjects(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading || projects.length === 0) return

    // small delay so DOM is fully painted
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const cards = cardsRef.current.filter(Boolean)
        const total = cards.length

        cards.forEach((card, i) => {
          const isLast = i === total - 1

          ScrollTrigger.create({
            trigger: card,
            start: 'top top',
            end: isLast ? 'bottom top' : `+=${window.innerHeight * 1.3}`,
            pin: true,
            pinSpacing: false,
            scrub: true,
          })

          if (!isLast) {
            gsap.to(card, {
              scale: 0.93,
              opacity: 0.5,
              ease: 'none',
              scrollTrigger: {
                trigger: cards[i + 1],
                start: 'top 75%',
                end: 'top top',
                scrub: 1,
              },
            })
          }

          if (i > 0) {
            gsap.fromTo(
              card,
              { yPercent: 5, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 90%',
                  end: 'top top',
                  scrub: 1,
                },
              }
            )
          }
        })

        ScrollTrigger.refresh()
      }, containerRef)

      return () => ctx.revert()
    }, 120)

    return () => clearTimeout(timer)
  }, [loading, projects])

  return (
    <section id="projects" ref={containerRef} style={{ background: '#0e0e0e' }}>
      {/* Heading */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ height: '35vh', paddingTop: '6rem' }}
      >
        <SectionHeading label="My Work" title="Selected Projects" align="center" />
      </div>

      {/* Stacked project cards */}
      {loading ? (
        <div className="flex items-center justify-center" style={{ height: '60vh' }}>
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#FF4D00', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div style={{ paddingBottom: `${projects.length * 60}px` }}>
          {projects.map((project, i) => (
            <div
              key={project._id}
              ref={(el) => { if (el) cardsRef.current[i] = el }}
              className="w-full flex items-center justify-center"
              style={{ height: '100vh', top: 0, zIndex: 10 + i, padding: '0 1.5rem' }}
            >
              <div
                className="w-full max-w-6xl rounded-3xl overflow-hidden relative"
                style={{
                  background: 'linear-gradient(135deg, #111111 0%, #181818 100%)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                  height: 'min(78vh, 560px)',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                {/* Image side */}
                <div
                  className="relative overflow-hidden flex-shrink-0"
                  style={{ width: '55%', height: '100%' }}
                >
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      style={{ transition: 'transform 0.6s ease' }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #1a0800, #2d1000)' }}
                    >
                      <span
                        className="font-heading font-black text-8xl opacity-10"
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                      >
                        {project.title[0]}
                      </span>
                    </div>
                  )}
                  {/* Gradient overlay on image */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to right, transparent 60%, #111111 100%)' }}
                  />
                  {project.featured && (
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-body"
                      style={{ background: 'rgba(255,77,0,0.15)', border: '1px solid rgba(255,77,0,0.3)', color: '#FF4D00' }}
                    >
                      Featured
                    </div>
                  )}
                </div>

                {/* Content side */}
                <div
                  className="flex flex-col justify-center flex-1 relative z-10"
                  style={{ padding: 'clamp(1.5rem, 3vw, 3rem)', paddingLeft: 'clamp(1rem, 2vw, 2rem)' }}
                >
                  {/* Project number */}
                  <span
                    className="font-heading font-black leading-none mb-4 select-none block"
                    style={{
                      fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      background: 'linear-gradient(135deg, #FF4D00 0%, #FF2D55 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.04em',
                      opacity: 0.85,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <h3
                    className="font-heading font-bold text-white leading-tight mb-3"
                    style={{
                      fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {project.title}
                  </h3>

                  <p
                    className="font-body leading-relaxed mb-5"
                    style={{
                      fontSize: 'clamp(0.82rem, 1.2vw, 0.95rem)',
                      color: 'rgba(255,255,255,0.4)',
                      maxWidth: '380px',
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Tech tags */}
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

                  {/* Links */}
                  <div className="flex gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body text-white"
                        style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)' }}
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
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <GithubIcon size={14} /> Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
