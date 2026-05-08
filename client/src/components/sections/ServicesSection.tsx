import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SERVICES = [
  {
    number: '01',
    title: 'Full Stack Development',
    description:
      'End-to-end web applications built with React, Node.js, and MongoDB. From polished frontends to robust REST APIs — production-ready and scalable.',
    tags: ['React', 'Node.js', 'MongoDB', 'REST API'],
  },
  {
    number: '02',
    title: 'UI / UX Design',
    description:
      'Clean, purposeful interfaces crafted in Figma and brought to life with Framer Motion. Every interaction is intentional, every pixel earns its place.',
    tags: ['Figma', 'Framer Motion', 'Tailwind CSS', 'Responsive'],
  },
  {
    number: '03',
    title: 'AI Integration',
    description:
      'Embedding real intelligence into products — LLM-powered features, voice interfaces, smart routing, and multi-modal AI pipelines using Groq, OpenAI, and more.',
    tags: ['Groq', 'OpenAI', 'LLM', 'Voice AI'],
  },
  {
    number: '04',
    title: 'Backend & API Engineering',
    description:
      'Secure, well-structured backend systems with JWT auth, role-based access, database design, and cloud deployment on Vercel, Firebase, or custom servers.',
    tags: ['Express.js', 'JWT', 'Supabase', 'Firebase'],
  },
  {
    number: '05',
    title: 'Performance & Optimization',
    description:
      'Auditing and rebuilding slow apps — code splitting, lazy loading, caching strategies, and image pipelines that make sites feel instant.',
    tags: ['Vite', 'Lighthouse', 'CDN', 'Web Vitals'],
  },
]

export default function ServicesSection() {
  // sectionRef = the tall scrollable area that drives the animation
  const sectionRef = useRef<HTMLDivElement>(null)
  // cardsRef = the absolutely-positioned card layers inside the sticky viewport
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean)
      const vh = window.innerHeight

      cards.forEach((card, i) => {
        if (i === 0) return

        // Pixel offset into the section where this card starts sliding in
        const scrollStart = (i - 1) * vh
        const scrollEnd   = scrollStart + vh * 0.65 // card fully arrives after 65vh of scroll

        // ── Incoming card slides up from below (scrubbed) ──
        gsap.fromTo(
          card,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${scrollStart}px top`,
              end:   `top+=${scrollEnd}px top`,
              scrub: 1.5,   // ← adjust for faster (lower) / smoother (higher) feel
            },
          }
        )

        // ── Previous card scales down + dims as new one arrives ──
        gsap.to(cards[i - 1], {
          scale:   0.92,
          opacity: 0.45,
          ease:    'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top+=${scrollStart}px top`,
            end:   `top+=${scrollEnd}px top`,
            scrub: 1.5,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="services" style={{ background: '#ffffff' }}>

      {/* ── Section heading — scrolls normally before sticky kicks in ── */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ height: '40vh', paddingTop: '5rem' }}
      >
        <span
          className="text-xs font-body tracking-widest uppercase mb-4"
          style={{ color: '#FF4D00', letterSpacing: '0.2em' }}
        >
          What I Do
        </span>
        <h2
          className="font-heading font-black text-center leading-none"
          style={{
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            color: '#0a0a0a',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            letterSpacing: '-0.03em',
          }}
        >
          SERVICES
        </h2>
      </div>

      {/* ── Scrollable driver — height = N cards × 100vh ── */}
      {/* This div provides the scroll distance; the sticky inner pins at top:0 */}
      <div
        ref={sectionRef}
        style={{ height: `${SERVICES.length * 100}vh`, position: 'relative' }}
      >
        {/* ── Single sticky viewport — cards stack inside here ── */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          {SERVICES.map((service, i) => (
            <div
              key={service.number}
              ref={(el) => { if (el) cardsRef.current[i] = el }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 1.5rem',
              }}
            >
              <div
                className="w-full max-w-5xl rounded-3xl relative overflow-hidden"
                style={{
                  background: i % 2 === 0 ? '#f7f7f7' : '#efefef',
                  border: '1px solid rgba(0,0,0,0.07)',
                  padding: 'clamp(2rem, 5vw, 4rem)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                }}
              >
                {/* Accent glow */}
                <div
                  className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,77,0,0.05) 0%, transparent 70%)',
                    transform: 'translate(-30%,-30%)',
                  }}
                />

                <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 relative z-10">

                  {/* Number */}
                  <div className="flex-shrink-0">
                    <span
                      className="font-heading font-black leading-none select-none"
                      style={{
                        fontSize: 'clamp(4rem, 10vw, 9rem)',
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        background: 'linear-gradient(135deg,#FF4D00,#FF2D55)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {service.number}
                    </span>
                  </div>

                  {/* Vertical divider */}
                  <div
                    className="hidden md:block flex-shrink-0"
                    style={{
                      width: '1px',
                      height: '120px',
                      background: 'linear-gradient(to bottom, transparent, rgba(255,77,0,0.3), transparent)',
                    }}
                  />

                  {/* Content */}
                  <div className="flex-1">
                    <h3
                      className="font-heading font-bold mb-4 leading-tight"
                      style={{
                        fontSize: 'clamp(1.6rem,3.5vw,2.8rem)',
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        letterSpacing: '-0.02em',
                        color: '#0a0a0a',
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="font-body leading-relaxed mb-6"
                      style={{
                        fontSize: 'clamp(0.9rem,1.5vw,1.1rem)',
                        color: 'rgba(0,0,0,0.5)',
                        maxWidth: '540px',
                      }}
                    >
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-body text-xs px-3 py-1 rounded-full"
                          style={{
                            color: '#FF4D00',
                            background: 'rgba(255,77,0,0.08)',
                            border: '1px solid rgba(255,77,0,0.18)',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress dots */}
                  <div
                    className="hidden lg:flex flex-col items-center gap-2 flex-shrink-0"
                    style={{ opacity: 0.2 }}
                  >
                    {SERVICES.map((_, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: idx === i ? '3px' : '2px',
                          height: idx === i ? '28px' : '10px',
                          borderRadius: '999px',
                          background: idx === i ? '#FF4D00' : 'rgba(0,0,0,0.3)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
