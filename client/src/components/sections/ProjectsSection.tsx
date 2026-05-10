import { useEffect, useState } from 'react'
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

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    api.get('/projects')
      .then((r: { data: Project[] }) => setProjects(r.data.filter((p: Project) => p.featured)))
      .catch(() => {})
  }, [])

  if (!projects.length) return null

  return (
    <section id="projects" style={{ background: '#080808', padding: 'clamp(5rem,10vw,8rem) 0' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="mb-16">
          <span className="text-xs font-body tracking-widest uppercase mb-4 block"
            style={{ color: '#FF4D00', letterSpacing: '0.2em' }}>
            Selected Projects
          </span>
          <h2 className="font-heading font-black leading-none"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              color: '#ffffff',
              letterSpacing: '-0.03em',
            }}>
            PROJECTS
          </h2>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '1.5rem' }}>
          {projects.map((p, i) => (
            <div key={p._id}
              style={{
                borderRadius: 16,
                background: '#0f0f0f',
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg,#1a0800,#2d0a00)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontFamily: "'Bricolage Grotesque',sans-serif",
                      fontSize: '6rem', fontWeight: 900,
                      background: 'linear-gradient(135deg,#FF4D00,#FF2D55)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.2,
                    }}>{p.title[0]}</span>
                  </div>
                )}
                {/* Number overlay */}
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  fontSize: '0.7rem', fontWeight: 800,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.12em',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                {p.featured && (
                  <div style={{
                    position: 'absolute', top: 16, right: 16,
                    background: 'rgba(255,77,0,0.15)',
                    border: '1px solid rgba(255,77,0,0.3)',
                    color: '#FF4D00', fontSize: '0.7rem',
                    padding: '3px 10px', borderRadius: 999,
                    fontFamily: "'Outfit',sans-serif",
                    letterSpacing: '0.06em',
                  }}>Featured</div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  fontSize: 'clamp(1.3rem,2.2vw,1.7rem)',
                  fontWeight: 800, letterSpacing: '-0.02em',
                  color: '#ffffff', marginBottom: '0.5rem',
                }}>{p.title}</h3>

                <p style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.35)',
                  lineHeight: 1.6,
                  marginBottom: '1.1rem',
                }}>{p.description}</p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.2rem' }}>
                  {p.techStack.slice(0, 4).map(tag => (
                    <span key={tag} style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: '0.7rem',
                      color: '#FF4D00',
                      background: 'rgba(255,77,0,0.08)',
                      border: '1px solid rgba(255,77,0,0.18)',
                      padding: '2px 10px', borderRadius: 999,
                      letterSpacing: '0.04em',
                    }}>{tag}</span>
                  ))}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        background: '#ffffff', color: '#000000',
                        borderRadius: 999, padding: '0.5rem 1.1rem',
                        fontSize: '0.7rem', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        textDecoration: 'none',
                      }}>
                      Checkout ↗
                    </a>
                  )}
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                        color: 'rgba(255,255,255,0.5)',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 999, padding: '0.5rem 0.9rem',
                        fontSize: '0.7rem', textDecoration: 'none',
                      }}>
                      <GithubIcon size={12} /> Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
