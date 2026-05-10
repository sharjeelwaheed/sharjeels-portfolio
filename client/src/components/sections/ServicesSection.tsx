import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SERVICES = [
  {
    number: '01',
    title: 'Full Stack Development',
    tags: ['React', 'Node.js', 'MongoDB'],
    thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80',
  },
  {
    number: '02',
    title: 'UI / UX Design',
    tags: ['Figma', 'Framer Motion', 'Tailwind'],
    thumb: 'https://sharjeels-portfolio-7irb.vercel.app/images/uiux-cover.jpeg',
  },
  {
    number: '03',
    title: 'AI Integration',
    tags: ['Groq', 'OpenAI', 'LLM'],
    thumb: 'https://sharjeels-portfolio-7irb.vercel.app/images/haqooqi-cover.png',
  },
  {
    number: '04',
    title: 'Backend & API Engineering',
    tags: ['Express.js', 'JWT', 'Supabase'],
    thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80',
  },
  {
    number: '05',
    title: 'Performance & Optimization',
    tags: ['Vite', 'Lighthouse', 'Web Vitals'],
    thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80',
  },
]

export default function ServicesSection() {
  const [hovered, setHovered] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section id="services" ref={sectionRef} style={{ background: '#ffffff', padding: 'clamp(5rem,10vw,8rem) 0' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="mb-16">
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
              color: '#0a0a0a',
              letterSpacing: '-0.03em',
            }}
          >
            SERVICES
          </h2>
        </div>

        {/* Two-col layout: list left, thumbnail right */}
        <div className="relative flex gap-16 items-start">

          {/* Service list */}
          <div className="flex-1">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.number}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className="group relative cursor-default"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
              >
                {/* Hover fill bg */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={false}
                  animate={{ opacity: hovered === i ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ background: 'rgba(255,77,0,0.03)' }}
                />

                <div className="relative flex items-center gap-6 py-7 px-2">
                  {/* Number */}
                  <span
                    className="font-body tabular-nums flex-shrink-0 transition-colors duration-300"
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      color: hovered === i ? '#FF4D00' : 'rgba(0,0,0,0.25)',
                    }}
                  >
                    {service.number}
                  </span>

                  {/* Title */}
                  <motion.h3
                    className="font-heading font-black leading-none flex-1 transition-colors duration-300"
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                      letterSpacing: '-0.02em',
                      color: hovered === i ? '#FF4D00' : '#0a0a0a',
                    }}
                  >
                    {service.title}
                  </motion.h3>

                  {/* Tags — slide in on hover */}
                  <motion.div
                    className="hidden md:flex gap-2 flex-shrink-0"
                    initial={false}
                    animate={{ opacity: hovered === i ? 1 : 0, x: hovered === i ? 0 : 12 }}
                    transition={{ duration: 0.25 }}
                  >
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
                  </motion.div>

                  {/* Arrow */}
                  <motion.span
                    className="flex-shrink-0 text-2xl font-heading font-black leading-none"
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#FF4D00' }}
                    initial={false}
                    animate={{
                      opacity: hovered === i ? 1 : 0,
                      rotate: hovered === i ? 0 : -45,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    ↗
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sticky thumbnail panel */}
          <div
            className="hidden lg:block flex-shrink-0"
            style={{ width: 280, position: 'sticky', top: '20vh' }}
          >
            <div style={{ position: 'relative', width: 280, height: 340 }}>
              <AnimatePresence mode="wait">
                {hovered !== null && (
                  <motion.div
                    key={hovered}
                    initial={{ opacity: 0, y: 24, rotate: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
                    exit={{ opacity: 0, y: -16, rotate: 2, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 20,
                      overflow: 'hidden',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.18)',
                    }}
                  >
                    <img
                      src={SERVICES[hovered].thumb}
                      alt={SERVICES[hovered].title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* Overlay with service name */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '1.5rem',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                      }}
                    >
                      <p
                        className="text-white font-heading font-bold text-sm"
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                      >
                        {SERVICES[hovered].title}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Placeholder when nothing hovered */}
              <AnimatePresence>
                {hovered === null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 20,
                      border: '2px dashed rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      className="font-body text-sm"
                      style={{ color: 'rgba(0,0,0,0.2)', letterSpacing: '0.05em' }}
                    >
                      hover a service
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
