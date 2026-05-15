import { useState, useRef } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'

const SERVICES = [
  {
    number: '01',
    title: 'Full Stack Development',
    tags: ['React', 'Node.js', 'MongoDB'],
    thumb: '/images/fullstack_cover.png',
    objectPosition: 'center center',
    description: 'End-to-end web applications built with modern frameworks, scalable APIs, and production-ready deployment pipelines.',
    category: 'Development',
  },
  {
    number: '02',
    title: 'UI / UX Design',
    tags: ['Figma', 'Framer Motion', 'Tailwind'],
    thumb: '/images/uiux-cover.jpeg',
    objectPosition: 'center top',
    description: 'Pixel-perfect interfaces with intentional interactions, clean layouts, and delightful micro-animations.',
    category: 'Design',
  },
  {
    number: '03',
    title: 'AI Integration',
    tags: ['Groq', 'OpenAI', 'LLM'],
    thumb: '/images/haqooqi-cover.png',
    objectPosition: 'center center',
    description: 'Intelligent features powered by large language models — chatbots, smart search, and automation pipelines.',
    category: 'AI & ML',
  },
  {
    number: '04',
    title: 'Backend & API Engineering',
    tags: ['Express.js', 'JWT', 'Supabase'],
    thumb: '/images/backend_engineering.png',
    objectPosition: 'center center',
    description: 'Robust REST APIs, authentication systems, and database architecture that scales gracefully under load.',
    category: 'Engineering',
  },
  {
    number: '05',
    title: 'Performance & Optimization',
    tags: ['Vite', 'Lighthouse', 'Web Vitals'],
    thumb: '/images/performance_optimization.png',
    objectPosition: 'center center',
    description: 'Sub-second load times, Lighthouse 100 scores, and silky 60fps animations across every device.',
    category: 'Optimization',
  },
]

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollActive, setScrollActive] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)

  const activeIndex = hovered !== null ? hovered : scrollActive

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(SERVICES.length - 1, Math.floor(v * SERVICES.length))
    setScrollActive(idx)
  })

  const active = SERVICES[activeIndex]

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{ height: `${(SERVICES.length + 1) * 100}vh`, position: 'relative' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* ── Background image crossfade ─────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <img
              src={active.thumb}
              alt=""
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: active.objectPosition,
                filter: 'brightness(0.45) saturate(0.8)',
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlays */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.25) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.55) 100%)',
        }} />

        {/* Active color glow accent */}
        <motion.div
          key={`glow-${activeIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(255,77,0,0.07), transparent)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Main content layout ────────────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center',
        }}>
          <div
            className="max-w-7xl mx-auto px-6 w-full"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '5rem', alignItems: 'center' }}
          >

            {/* Left column — heading + active description */}
            <div>
              <span
                className="text-xs font-body tracking-widest uppercase mb-5 block"
                style={{ color: '#FF4D00', letterSpacing: '0.2em' }}
              >
                What I Do
              </span>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: '2rem',
                }}
              >
                SERVICES
              </h2>

              {/* Active service detail */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span
                    className="font-body text-xs tracking-widest uppercase block mb-3"
                    style={{ color: '#FF4D00', letterSpacing: '0.15em' }}
                  >
                    {active.category}
                  </span>
                  <p
                    className="font-body leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', maxWidth: 360 }}
                  >
                    {active.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.4rem' }}>
                    {active.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '0.72rem',
                          color: '#FF4D00',
                          background: 'rgba(255,77,0,0.1)',
                          border: '1px solid rgba(255,77,0,0.25)',
                          padding: '4px 14px',
                          borderRadius: 999,
                          letterSpacing: '0.05em',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right column — service list */}
            <div>
              {SERVICES.map((service, i) => {
                const isActive = i === activeIndex
                return (
                  <motion.div
                    key={service.number}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    animate={{
                      opacity: isActive ? 1 : 0.28,
                      x: isActive ? 8 : 0,
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      cursor: 'default',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.2rem',
                      padding: '1.25rem 0',
                    }}>
                      {/* Number */}
                      <motion.span
                        animate={{ color: isActive ? '#FF4D00' : 'rgba(255,255,255,0.2)' }}
                        transition={{ duration: 0.35 }}
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '0.72rem',
                          letterSpacing: '0.12em',
                          flexShrink: 0,
                          width: '2rem',
                        }}
                      >
                        {service.number}
                      </motion.span>

                      {/* Title */}
                      <motion.h3
                        animate={{
                          fontSize: isActive ? 'clamp(1.6rem, 3.2vw, 2.8rem)' : 'clamp(1.2rem, 2.4vw, 2rem)',
                        }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontWeight: 900,
                          letterSpacing: '-0.025em',
                          color: '#ffffff',
                          flex: 1,
                          lineHeight: 1,
                        }}
                      >
                        {service.title}
                      </motion.h3>

                      {/* Arrow */}
                      <motion.span
                        animate={{
                          opacity: isActive ? 1 : 0,
                          x: isActive ? 0 : -10,
                          rotate: isActive ? 0 : -45,
                        }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: '1.5rem',
                          fontWeight: 900,
                          color: '#FF4D00',
                          flexShrink: 0,
                        }}
                      >
                        ↗
                      </motion.span>
                    </div>
                  </motion.div>
                )
              })}
            </div>

          </div>
        </div>

        {/* Scroll hint — fades out after first item */}
        <motion.div
          animate={{ opacity: scrollActive === 0 && hovered === null ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(255,77,0,0.6), transparent)' }}
          />
        </motion.div>

      </div>
    </section>
  )
}
