import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SERVICES = [
  {
    number: '01',
    title: 'Full Stack Development',
    tags: ['React', 'Node.js', 'MongoDB'],
    thumb: '/images/fullstack_cover.png',
    objectPosition: 'center center',
  },
  {
    number: '02',
    title: 'UI / UX Design',
    tags: ['Figma', 'Framer Motion', 'Tailwind'],
    thumb: '/images/uiux-cover.jpeg',
    objectPosition: 'center top',
  },
  {
    number: '03',
    title: 'AI Integration',
    tags: ['Groq', 'OpenAI', 'LLM'],
    thumb: '/images/haqooqi-cover.png',
    objectPosition: 'center center',
  },
  {
    number: '04',
    title: 'Backend & API Engineering',
    tags: ['Express.js', 'JWT', 'Supabase'],
    thumb: '/images/backend_engineering.png',
    objectPosition: 'center center',
  },
  {
    number: '05',
    title: 'Performance & Optimization',
    tags: ['Vite', 'Lighthouse', 'Web Vitals'],
    thumb: '/images/performance_optimization.png',
    objectPosition: 'center center',
  },
]

export default function ServicesSection() {
  const [hovered, setHovered] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        background: '#0a0a0a',
        padding: 'clamp(5rem,10vw,8rem) 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        className="max-w-7xl mx-auto px-6"
        style={{ display: 'grid', gridTemplateColumns: '1fr 42%', gap: '4rem', alignItems: 'start' }}
      >

        {/* Left — heading + service list */}
        <div>
          {/* Heading */}
          <div className="mb-14">
            <span
              className="text-xs font-body tracking-widest uppercase mb-4 block"
              style={{ color: '#FF4D00', letterSpacing: '0.2em' }}
            >
              What I Do
            </span>
            <h2
              className="font-heading font-black leading-none"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                color: '#ffffff',
                letterSpacing: '-0.03em',
              }}
            >
              SERVICES
            </h2>
          </div>

          {/* Service list */}
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.number}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              className="cursor-default"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              animate={{ opacity: hovered === null || hovered === i ? 1 : 0.25 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-6 py-6 px-2">
                {/* Number */}
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    color: hovered === i ? '#FF4D00' : 'rgba(255,255,255,0.2)',
                    flexShrink: 0,
                    transition: 'color 0.3s',
                  }}
                >
                  {service.number}
                </span>

                {/* Arrow — only active */}
                <motion.span
                  animate={{ opacity: hovered === i ? 1 : 0, x: hovered === i ? 0 : -8 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 'clamp(1.6rem, 3.5vw, 3rem)',
                    fontWeight: 900,
                    color: '#ffffff',
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  →
                </motion.span>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.025em',
                    color: '#ffffff',
                    flex: 1,
                    lineHeight: 1,
                  }}
                >
                  {service.title}
                </h3>

                {/* Tags — slide in on hover */}
                <motion.div
                  className="hidden md:flex gap-2 flex-shrink-0"
                  animate={{ opacity: hovered === i ? 1 : 0, x: hovered === i ? 0 : 12 }}
                  transition={{ duration: 0.25 }}
                >
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '0.7rem',
                        color: '#FF4D00',
                        background: 'rgba(255,77,0,0.08)',
                        border: '1px solid rgba(255,77,0,0.2)',
                        padding: '3px 12px',
                        borderRadius: 999,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right — full image panel, no card, no opacity */}
        <div
          className="hidden lg:block"
          style={{ position: 'sticky', top: '15vh', height: '60vh', borderRadius: 12, overflow: 'hidden' }}
        >
          <AnimatePresence mode="wait">
            {hovered !== null ? (
              <motion.img
                key={hovered}
                src={SERVICES[hovered].thumb}
                alt={SERVICES[hovered].title}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: SERVICES[hovered].objectPosition,
                  display: 'block',
                }}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#111111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                }}
              >
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.08em' }}>
                  hover a service
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
