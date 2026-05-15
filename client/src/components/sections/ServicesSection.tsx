import { useState, useRef, useEffect } from 'react'
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
  const [hovered, setHovered]           = useState<number | null>(null)
  const [scrollActive, setScrollActive] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const itemRefs   = useRef<(HTMLDivElement | null)[]>([])

  // The index that drives everything — hover wins over scroll
  const activeIndex = hovered !== null ? hovered : scrollActive

  // Scroll-driven: whichever item's center is closest to viewport center
  useEffect(() => {
    const update = () => {
      const section = sectionRef.current
      if (!section) return
      const sr = section.getBoundingClientRect()
      // Only active while section is on screen
      if (sr.bottom < 0 || sr.top > window.innerHeight) {
        setScrollActive(null)
        return
      }
      const mid = window.innerHeight / 2
      let best = -1, bestDist = Infinity
      itemRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const dist = Math.abs(r.top + r.height / 2 - mid)
        if (dist < bestDist) { bestDist = dist; best = i }
      })
      setScrollActive(best >= 0 ? best : null)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        position: 'relative',
        background: '#ffffff',
        padding: 'clamp(5rem,10vw,8rem) 0',
        overflow: 'hidden',
      }}
    >
      {/* ── Full-screen background image — no white overlay ─────────── */}
      <AnimatePresence mode="wait">
        {activeIndex !== null && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, zIndex: 0 }}
          >
            {/* Image — full brightness, no filter */}
            <img
              src={SERVICES[activeIndex].thumb}
              alt=""
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: SERVICES[activeIndex].objectPosition,
              }}
            />
            {/* Left-side gradient so text stays readable */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.1) 100%)',
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content — sits above background ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6" style={{ position: 'relative', zIndex: 1 }}>

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

        {/* Two-col layout */}
        <div className="relative flex gap-16 items-start">

          {/* Service list */}
          <div className="flex-1">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.number}
                ref={el => { itemRefs.current[i] = el }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className="group relative cursor-default"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
                animate={{ opacity: activeIndex === null || activeIndex === i ? 1 : 0.3 }}
                transition={{ duration: 0.35 }}
              >
                {/* Hover fill bg */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ opacity: activeIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ background: 'rgba(255,77,0,0.03)' }}
                />

                <div className="relative flex items-center gap-6 py-7 px-2">
                  {/* Number */}
                  <motion.span
                    animate={{ color: activeIndex === i ? '#FF4D00' : 'rgba(0,0,0,0.25)' }}
                    transition={{ duration: 0.3 }}
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      flexShrink: 0,
                    }}
                  >
                    {service.number}
                  </motion.span>

                  {/* Title */}
                  <motion.h3
                    animate={{
                      color: activeIndex === i ? '#FF4D00' : '#0a0a0a',
                      scale: activeIndex === i ? 1.03 : 1,
                      x: activeIndex === i ? 6 : 0,
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      flex: 1,
                      lineHeight: 1,
                      originX: 0,
                    }}
                  >
                    {service.title}
                  </motion.h3>

                  {/* Tags */}
                  <motion.div
                    className="hidden md:flex gap-2 flex-shrink-0"
                    animate={{ opacity: activeIndex === i ? 1 : 0, x: activeIndex === i ? 0 : 12 }}
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
                          border: '1px solid rgba(255,77,0,0.18)',
                          padding: '3px 12px',
                          borderRadius: 999,
                          letterSpacing: '0.05em',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>

                  {/* Arrow */}
                  <motion.span
                    animate={{
                      opacity: activeIndex === i ? 1 : 0,
                      rotate: activeIndex === i ? 0 : -45,
                    }}
                    transition={{ duration: 0.2 }}
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
            ))}
          </div>

          {/* Sticky thumbnail panel — same as original */}
          <div
            className="hidden lg:block flex-shrink-0"
            style={{ width: 280, position: 'sticky', top: '20vh' }}
          >
            <div style={{ position: 'relative', width: 280, height: 340 }}>
              <AnimatePresence mode="wait">
                {activeIndex !== null && (
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 24, rotate: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
                    exit={{ opacity: 0, y: -16, rotate: 2, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: 'absolute', inset: 0,
                      borderRadius: 20, overflow: 'hidden',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.18)',
                    }}
                  >
                    <img
                      src={SERVICES[activeIndex].thumb}
                      alt={SERVICES[activeIndex].title}
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        objectPosition: SERVICES[activeIndex].objectPosition,
                      }}
                    />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '1.5rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    }}>
                      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>
                        {SERVICES[activeIndex].title}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {activeIndex === null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute', inset: 0,
                      borderRadius: 20,
                      border: '2px dashed rgba(0,0,0,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.875rem', color: 'rgba(0,0,0,0.2)', letterSpacing: '0.05em' }}>
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
