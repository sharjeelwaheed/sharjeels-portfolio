import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function NeonWaveSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const archRef    = useRef<HTMLDivElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)
  const innerRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const arch    = archRef.current
    const glow    = glowRef.current
    const inner   = innerRef.current
    if (!section || !arch || !glow || !inner) return

    // Set initial states explicitly before creating timeline
    gsap.set(arch,  { y: '60vh', scaleX: 0.7, scaleY: 0.55, filter: 'blur(20px) brightness(0.5)', opacity: 0 })
    gsap.set(glow,  { y: '80vh', opacity: 0, scale: 0.65, filter: 'blur(70px)' })
    gsap.set(inner, { y: '45vh', opacity: 0, scaleX: 0.75 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end:   'bottom top',
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    })

    // ── ARCH ─────────────────────────────────────────────────────────────
    // Phase 1 (0→45%): emerge from below, blurry & compressed → sharp & full
    tl.to(arch,
      {
        y: '0vh',
        scaleX: 1,
        scaleY: 1,
        filter: 'blur(0px) brightness(1.1)',
        opacity: 1,
        ease: 'power2.out',
        duration: 0.45,
      },
      0,
    )

    // Phase 2 (45→100%): drift upward, compress vertically, fade out
    tl.to(arch, {
      y: '-42vh',
      scaleX: 1.1,
      scaleY: 0.65,
      filter: 'blur(10px) brightness(0.65)',
      opacity: 0.4,
      ease: 'power1.in',
      duration: 0.55,
    })

    // ── GLOW — slowest parallax ──────────────────────────────────────────
    tl.to(glow,
      {
        y: '-25vh',
        opacity: 1,
        scale: 1.3,
        filter: 'blur(38px)',
        ease: 'none',
        duration: 1,
      },
      0,
    )

    // ── INNER — fastest layer (strongest depth pop) ──────────────────────
    tl.to(inner,
      { y: '-12vh', opacity: 1, scaleX: 1, ease: 'none', duration: 0.75 },
      0.05,
    )

    // Ensure ScrollTrigger recalculates after paint
    ScrollTrigger.refresh()

    return () => { tl.scrollTrigger?.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '200vh',
        background: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* Layer 1 — wide ambient bloom */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          width: '240vw',
          height: '130vh',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 55%, rgba(255,60,200,0.18) 0%, rgba(180,0,200,0.08) 55%, transparent 80%)',
          filter: 'blur(55px)',
          bottom: '-65vh',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Layer 2 — main neon arch ellipse */}
      <div
        ref={archRef}
        style={{
          position: 'absolute',
          width: '160vw',
          height: '96vh',
          borderRadius: '50%',
          background: [
            'radial-gradient(',
            '  ellipse at 50% 36%,',
            '  #ffcaf0 0%,',
            '  #ff50da 16%,',
            '  #e200a5 40%,',
            '  rgba(120,0,85,0.5) 65%,',
            '  transparent 83%',
            ')',
          ].join(''),
          boxShadow: [
            '0 0  60px rgba(255,  0,185,0.6)',
            '0 0 140px rgba(220,  0,240,0.3)',
            '0 0 280px rgba(170,  0,210,0.14)',
          ].join(','),
          bottom: '-48vh',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          willChange: 'transform, filter, opacity',
        }}
      />

      {/* Layer 3 — inner bright highlight core */}
      <div
        ref={innerRef}
        style={{
          position: 'absolute',
          width: '90vw',
          height: '50vh',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(255,200,245,0.6) 0%, rgba(255,80,210,0.28) 45%, transparent 75%)',
          filter: 'blur(18px)',
          bottom: '-25vh',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />
    </section>
  )
}
