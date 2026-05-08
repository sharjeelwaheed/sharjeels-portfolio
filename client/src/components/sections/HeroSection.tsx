import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'
import heroImg from '@/assets/images/sharjeel-hero.jpg'
import Lenis from '@studio-freight/lenis'

function scrollTo(href: string) {
  const lenis = (window as unknown as { lenis: Lenis }).lenis
  if (lenis) lenis.scrollTo(href, { offset: -80 })
  else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroSection({ ready = true }: { ready?: boolean }) {
  const { scrollY } = useScroll()
  const photoY = useTransform(scrollY, [0, 600], [0, -80])
  const photoScale = useTransform(scrollY, [0, 400], [1, 1.05])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-primary"
    >
      {/* Ambient glow */}
      <div
        className="absolute right-0 top-1/3 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,77,0,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center pt-28 pb-16">

        {/* ── Left: Text ── */}
        <div className="flex flex-col gap-5 relative z-10">

          {/* Top label */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={ready ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <motion.span
              className="w-10 h-[1px] inline-block"
              style={{ background: 'linear-gradient(90deg, #FF4D00, #FF2D55)' }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={ready ? { scaleX: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
            <span
              className="text-xs font-body tracking-[0.2em] uppercase"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Based in Gujranwala, Pakistan
            </span>
          </motion.div>

          {/* Hey, I'm */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.02em',
            }}
          >
            Hey, I'm
          </motion.p>

          {/* SHARJEEL */}
          <div>
            <motion.h1
              initial={{ y: '100%' }}
              animate={ready ? { y: '0%' } : {}}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 'clamp(4.5rem, 13vw, 10rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: '#ffffff',
              }}
            >
              SHARJEEL
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              fontWeight: 400,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Full Stack Developer
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 0.75rem' }}>—</span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>CS Student</span>
          </motion.p>

          {/* Divider */}
          <motion.div
            className="w-full h-[1px]"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={ready ? { scaleX: 1 } : {}}
            transition={{ delay: 1.1, duration: 0.8 }}
          />

          {/* Bio */}
          <motion.p
            className="font-body leading-relaxed max-w-md"
            style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            CS Student (Semester 6) passionate about building modern, scalable,
            and user-friendly applications. Turning complex problems into
            elegant digital solutions.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-3 pt-1"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.35, duration: 0.6 }}
          >
            <MagneticButton>
              <button
                onClick={() => scrollTo('#projects')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-body font-medium text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)', fontSize: '0.875rem' }}
              >
                View Projects <ArrowRight size={15} />
              </button>
            </MagneticButton>
            <MagneticButton>
              <button
                onClick={() => scrollTo('#contact')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-body font-medium text-sm transition-all duration-300"
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontSize: '0.875rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,77,0,0.5)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                }}
              >
                <Mail size={15} /> Get in Touch
              </button>
            </MagneticButton>
          </motion.div>

          {/* Tech tags */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.55, duration: 0.6 }}
          >
            {['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind'].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={ready ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.55 + i * 0.07, duration: 0.4 }}
                className="px-3 py-1 rounded-full text-xs font-body"
                style={{
                  color: 'rgba(255,255,255,0.35)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                  fontSize: '0.7rem',
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ── Right: Photo ── */}
        <motion.div
          className="relative flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: 40 }}
          animate={ready ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glow orb */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 55% 45%, rgba(255,77,0,0.18) 0%, transparent 65%)',
              filter: 'blur(40px)',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />

          <motion.div
            style={{ y: photoY, scale: photoScale }}
            className="relative w-full max-w-sm lg:max-w-md"
          >
            <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <img
                src={heroImg}
                alt="Sharjeel Ahmed Pawar"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  t.style.display = 'none'
                  if (t.parentElement) t.parentElement.style.background = 'linear-gradient(135deg,#1a0a00,#3d1a0a)'
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right, #0B0B0B 0%, transparent 20%, transparent 80%, #0B0B0B 100%), linear-gradient(to bottom, transparent 50%, #0B0B0B 100%)',
                }}
              />
            </div>

            {/* Floating badge — Semester */}
            <motion.div
              className="absolute -bottom-4 -left-4 rounded-xl px-4 py-3 flex flex-col"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={ready ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.0, duration: 0.6 }}
              whileHover={{ y: -4 }}
            >
              <span
                className="font-heading font-extrabold text-2xl"
                style={{ fontFamily: "'Bricolage Grotesque',sans-serif", background: 'linear-gradient(135deg,#FF4D00,#FF2D55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                6th
              </span>
              <span className="text-white/40 text-xs font-body">Semester</span>
            </motion.div>

            {/* Floating badge — Projects */}
            <motion.div
              className="absolute -top-4 -right-4 rounded-xl px-4 py-3 flex flex-col items-end"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
              initial={{ opacity: 0, x: 20 }}
              animate={ready ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ y: -4 }}
            >
              <span
                className="font-heading font-extrabold text-2xl"
                style={{ fontFamily: "'Bricolage Grotesque',sans-serif", background: 'linear-gradient(135deg,#FF4D00,#FF2D55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                15+
              </span>
              <span className="text-white/40 text-xs font-body">Projects</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.8 }}
      >
        <span
          className="text-xs font-body tracking-[0.25em] uppercase"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-10"
          style={{ background: 'linear-gradient(to bottom, rgba(255,77,0,0.6), transparent)' }}
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
