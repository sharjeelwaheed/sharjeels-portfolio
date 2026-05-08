import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  { id: 'hero',       label: 'Home',       num: '01' },
  { id: 'about',      label: 'About',      num: '02' },
  { id: 'services',   label: 'Services',   num: '03' },
  { id: 'projects',   label: 'Projects',   num: '04' },
  { id: 'skills',     label: 'Skills',     num: '05' },
  { id: 'experience', label: 'Experience', num: '06' },
  { id: 'contact',    label: 'Contact',    num: '07' },
]

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [activeIdx, setActiveIdx] = useState(0)
  const prevIdx = useRef(0)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }, i) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIdx(i) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const direction = activeIdx > prevIdx.current ? 1 : -1
  useEffect(() => { prevIdx.current = activeIdx }, [activeIdx])

  const active = SECTIONS[activeIdx]

  return (
    <>
      {/* Vertical progress line — right edge */}
      <div
        className="fixed right-0 top-0 w-[2px] h-full z-[9996] pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <motion.div
          className="w-full origin-top"
          style={{
            scaleY,
            height: '100%',
            background: 'linear-gradient(to bottom, #FF4D00, #FF2D55)',
          }}
        />
      </div>

      {/* Section label — bottom right, desktop only */}
      <div className="fixed bottom-8 right-6 z-[9996] hidden md:flex flex-col items-end gap-1 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={active.num}
            className="font-heading font-bold text-sm"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              background: 'linear-gradient(135deg, #FF4D00, #FF2D55)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            initial={{ y: direction * 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: direction * -8, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {active.num}
          </motion.span>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.span
            key={active.label}
            className="font-body text-xs tracking-widest uppercase"
            style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}
            initial={{ y: direction * 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: direction * -8, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
          >
            {active.label}
          </motion.span>
        </AnimatePresence>
      </div>
    </>
  )
}
