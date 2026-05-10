import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function NeonWaveSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const waveRef    = useRef<HTMLDivElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const wave    = waveRef.current
    const glow    = glowRef.current
    if (!section || !wave || !glow) return

    // Main arch rises from below as user scrolls through the section
    gsap.fromTo(wave,
      { yPercent: 55 },
      {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.8,
        },
      }
    )

    // Ambient glow layer moves slightly faster — depth illusion
    gsap.fromTo(glow,
      { yPercent: 70 },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2.4,
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '130vh',
        background: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* Outer ambient glow — wide, blurry, slower */}
      <div ref={glowRef} style={{
        position: 'absolute',
        width: '200vw',
        height: '200vw',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(255,60,200,0.22) 0%, rgba(200,0,255,0.12) 40%, transparent 70%)',
        left: '50%',
        bottom: '-110vw',
        transform: 'translateX(-50%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Main neon arch */}
      <div ref={waveRef} style={{
        position: 'absolute',
        width: '160vw',
        height: '160vw',
        borderRadius: '50%',
        // Radial: bright hot-pink centre → deep magenta → fades to black
        background: 'radial-gradient(ellipse at 50% 38%, #ffb3f0 0%, #ff4fd8 18%, #e800a8 42%, #8b0066 65%, #3a0030 82%, transparent 100%)',
        boxShadow: [
          '0 0  80px rgba(255,  0,180,0.55)',
          '0 0 180px rgba(230,  0,255,0.30)',
          '0 0 340px rgba(180,  0,200,0.18)',
          '0 0 500px rgba(140,  0,170,0.10)',
        ].join(','),
        left: '50%',
        bottom: '-92vw',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }} />
    </section>
  )
}
