import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current
      const totalCards = cards.length

      cards.forEach((card, i) => {
        const isLast = i === totalCards - 1

        // Each card pins while the next one scrolls over it
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          end: isLast ? 'bottom top' : `+=${window.innerHeight * 1.2}`,
          pin: true,
          pinSpacing: false,
          scrub: true,
        })

        // Scale down and fade slightly as the next card overlaps
        if (!isLast) {
          gsap.to(card, {
            scale: 0.93,
            opacity: 0.6,
            filter: 'brightness(0.7)',
            ease: 'none',
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top 80%',
              end: 'top top',
              scrub: true,
            },
          })
        }

        // Card enters from below (except the first)
        if (i > 0) {
          gsap.fromTo(
            card,
            { yPercent: 8, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top top',
                scrub: 1.2,
              },
            }
          )
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="services"
      ref={containerRef}
      style={{ background: '#0b0b0b' }}
    >
      {/* Section label — scrolls away before cards begin */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ height: '35vh', paddingTop: '6rem' }}
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
            color: '#ffffff',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            letterSpacing: '-0.03em',
          }}
        >
          SERVICES
        </h2>
      </div>

      {/* Stacked cards */}
      <div style={{ paddingBottom: `${SERVICES.length * 60}px` }}>
        {SERVICES.map((service, i) => (
          <div
            key={service.number}
            ref={(el) => { if (el) cardsRef.current[i] = el }}
            className="w-full flex items-center justify-center"
            style={{
              height: '100vh',
              top: 0,
              zIndex: 10 + i,
              padding: '0 1.5rem',
            }}
          >
            <div
              className="w-full max-w-5xl rounded-3xl relative overflow-hidden"
              style={{
                background: i % 2 === 0
                  ? 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)'
                  : 'linear-gradient(135deg, #0f0f0f 0%, #161616 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                padding: 'clamp(2rem, 5vw, 4rem)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
              }}
            >
              {/* Accent glow */}
              <div
                className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255,77,0,0.06) 0%, transparent 70%)',
                  transform: 'translate(-30%, -30%)',
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
                      background: 'linear-gradient(135deg, #FF4D00 0%, #FF2D55 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.04em',
                      opacity: 0.9,
                    }}
                  >
                    {service.number}
                  </span>
                </div>

                {/* Divider */}
                <div
                  className="hidden md:block flex-shrink-0"
                  style={{
                    width: '1px',
                    height: '120px',
                    background: 'linear-gradient(to bottom, transparent, rgba(255,77,0,0.4), transparent)',
                  }}
                />

                {/* Content */}
                <div className="flex-1">
                  <h3
                    className="font-heading font-bold text-white mb-4 leading-tight"
                    style={{
                      fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="font-body leading-relaxed mb-6"
                    style={{
                      fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                      color: 'rgba(255,255,255,0.45)',
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
                          color: 'rgba(255,77,0,0.85)',
                          background: 'rgba(255,77,0,0.08)',
                          border: '1px solid rgba(255,77,0,0.15)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card number indicator */}
                <div
                  className="hidden lg:flex flex-col items-center gap-2 flex-shrink-0"
                  style={{ opacity: 0.2 }}
                >
                  {SERVICES.map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: idx === i ? '3px' : '2px',
                        height: idx === i ? '28px' : '12px',
                        borderRadius: '999px',
                        background: idx === i ? '#FF4D00' : 'rgba(255,255,255,0.4)',
                        transition: 'all 0.3s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
