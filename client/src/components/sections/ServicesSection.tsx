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
  const cardInnerRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardInnerRefs.current.filter(Boolean).forEach((inner, i) => {
        const total = cardInnerRefs.current.length
        if (i === total - 1) return

        // Scale + dim current card as the next one scrolls over it
        gsap.to(inner, {
          scale: 0.93,
          opacity: 0.45,
          ease: 'none',
          scrollTrigger: {
            trigger: inner,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="services" style={{ background: '#ffffff' }}>
      {/* Heading */}
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

      {/* Each card wrapper is 100vh — CSS sticky does the stacking */}
      {SERVICES.map((service, i) => (
        <div key={service.number} style={{ height: '100vh' }}>
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
              className="w-full max-w-5xl rounded-3xl relative overflow-hidden"
              style={{
                background: i % 2 === 0 ? '#f7f7f7' : '#efefef',
                border: '1px solid rgba(0,0,0,0.07)',
                padding: 'clamp(2rem, 5vw, 4rem)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.07)',
              }}
            >
              <div
                className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255,77,0,0.05) 0%, transparent 70%)',
                  transform: 'translate(-30%,-30%)',
                }}
              />

              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 relative z-10">
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

                <div
                  className="hidden md:block flex-shrink-0"
                  style={{
                    width: '1px',
                    height: '120px',
                    background: 'linear-gradient(to bottom,transparent,rgba(255,77,0,0.3),transparent)',
                  }}
                />

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
        </div>
      ))}
    </section>
  )
}
