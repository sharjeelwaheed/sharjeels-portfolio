import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'
import { LineReveal, FadeIn } from '@/components/ui/AnimatedText'
import heroImg from '@/assets/images/sharjeel-hero.jpg'
import Lenis from '@studio-freight/lenis'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

function scrollTo(href: string) {
  const lenis = (window as unknown as { lenis: Lenis }).lenis
  if (lenis) lenis.scrollTo(href, { offset: -80 })
  else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroSection({ ready = true }: { ready?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)

  // Scroll-driven exit — tied to the hero section scrolling away
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 })

  // Photo parallax
  const photoY     = useTransform(smoothProgress, [0, 1], ['0%', '20%'])
  // Content fade-out
  const contentOpacity = useTransform(smoothProgress, [0, 0.6], [1, 0])
  const contentScale   = useTransform(smoothProgress, [0, 0.6], [1, 0.94])
  const contentY       = useTransform(smoothProgress, [0, 0.6], [0, -40])
  // Ambient overlay darkens on scroll
  const overlayOpacity = useTransform(smoothProgress, [0, 1], [0, 0.4])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#0B0B0B' }}
    >
      {/* Ambient glow orb */}
      <div
        className="glow-orb"
        style={{
          right: '-5%',
          top: '20%',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(255,77,0,0.09) 0%, transparent 70%)',
        }}
      />
      <div
        className="glow-orb"
        style={{
          left: '10%',
          bottom: '10%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(255,45,85,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Scroll-driven dark overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ background: '#0B0B0B', opacity: overlayOpacity }}
      />

      {/* All hero content fades out on scroll */}
      <motion.div
        className="relative z-20 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center pt-28 pb-16"
        style={{ opacity: contentOpacity, scale: contentScale, y: contentY }}
      >
        {/* ── Left: Text ── */}
        <div className="flex flex-col gap-5">

          {/* Eyebrow */}
          <FadeIn delay={0.2}>
            <div className="flex items-center gap-3">
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
            </div>
          </FadeIn>

          {/* Hey, I'm */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
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

          {/* SHARJEEL — LineReveal */}
          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              initial={{ y: '105%' }}
              animate={ready ? { y: '0%' } : {}}
              transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
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
          <div style={{ overflow: 'hidden' }}>
            <motion.p
              initial={{ y: '105%', opacity: 0 }}
              animate={ready ? { y: '0%', opacity: 1 } : {}}
              transition={{ delay: 0.65, duration: 0.75, ease: EASE }}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                fontWeight: 400,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ background: 'linear-gradient(135deg,#FF4D00,#FF2D55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Full Stack Developer
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 0.75rem' }}>—</span>
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>CS Student</span>
            </motion.p>
          </div>

          {/* Divider */}
          <motion.div
            className="w-full h-[1px]"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={ready ? { scaleX: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
          />

          {/* Bio + CTAs — single FadeIn block per spec */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.65, ease: EASE }}
            className="flex flex-col gap-5"
          >
            <p
              className="font-body leading-relaxed max-w-md"
              style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}
            >
              CS Student (Semester 6) passionate about building modern, scalable,
              and user-friendly applications. Turning complex problems into
              elegant digital solutions.
            </p>

            {/* CTAs — magnetic */}
            <div className="flex flex-wrap gap-3">
              <MagneticButton>
                <motion.button
                  onClick={() => scrollTo('#projects')}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full font-body font-medium text-white text-sm"
                  style={{ background: 'linear-gradient(135deg,#FF4D00,#FF2D55)', fontSize: '0.875rem' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  View Projects <ArrowRight size={15} />
                </motion.button>
              </MagneticButton>
              <MagneticButton>
                <motion.button
                  onClick={() => scrollTo('#contact')}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full font-body font-medium text-sm"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: '0.875rem',
                  }}
                  whileHover={{
                    scale: 1.02,
                    borderColor: 'rgba(255,77,0,0.5)',
                    color: '#fff',
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail size={15} /> Get in Touch
                </motion.button>
              </MagneticButton>
            </div>
          </motion.div>

          {/* Tech tags */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            {['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind'].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={ready ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.1 + i * 0.07, duration: 0.4 }}
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
          transition={{ delay: 0.4, duration: 1.0, ease: EASE }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 55% 45%, rgba(255,77,0,0.18) 0%, transparent 65%)',
              filter: 'blur(40px)',
            }}
          />

          <motion.div
            style={{ y: photoY }}
            className="relative w-full max-w-sm lg:max-w-md"
          >
            <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <img
                src={heroImg}
                alt="Sharjeel Ahmed Pawar"
                className="w-full h-full object-cover object-top"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right,#0B0B0B 0%,transparent 20%,transparent 80%,#0B0B0B 100%), linear-gradient(to bottom,transparent 50%,#0B0B0B 100%)',
                }}
              />
            </div>

            {/* Floating badge — Semester */}
            <motion.div
              className="absolute -bottom-4 -left-4 rounded-xl px-4 py-3 flex flex-col animate-float"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={ready ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.0, duration: 0.6 }}
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
              className="absolute -top-4 -right-4 rounded-xl px-4 py-3 flex flex-col items-end animate-float"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', animationDelay: '1.2s' }}
              initial={{ opacity: 0, x: 20 }}
              animate={ready ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.6 }}
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
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.8 }}
        style={{ opacity: contentOpacity }}
      >
        <span className="text-xs font-body tracking-[0.25em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-10"
          style={{ background: 'linear-gradient(to bottom,rgba(255,77,0,0.6),transparent)' }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
