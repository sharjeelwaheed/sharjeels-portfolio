import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function NeonWaveSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const archRef    = useRef<HTMLDivElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const arch    = archRef.current
    const glow    = glowRef.current
    if (!section || !arch || !glow) return

    // Arch rises from hidden-below to its resting position as you scroll through the section.
    // "none" ease + scrub = 1:1 with scroll speed (cinematic feel).
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',   // animation begins when section enters viewport
        end:   'bottom top',   // ends when section exits viewport top
        scrub: 2,
      },
    })

    // Arch: starts far below, rises to natural position
    tl.fromTo(arch, { y: '48vh' }, { y: '0vh', ease: 'none' }, 0)
    // Glow: slightly slower parallax for depth
    tl.fromTo(glow, { y: '60vh' }, { y: '0vh', ease: 'none' }, 0)

    return () => { tl.scrollTrigger?.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '150vh',
        background: '#000000',
        // Clip bottom half of ellipse so only the top arch is ever visible
        overflow: 'hidden',
      }}
    >
      {/* Outer ambient glow — wider, softer, slower scroll */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          // Wider and taller than the arch for a bleed-out bloom effect
          width: '200vw',
          height: '110vh',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 60%, rgba(255,80,210,0.18) 0%, rgba(200,0,200,0.08) 50%, transparent 75%)',
          filter: 'blur(40px)',
          // Center the glow at section bottom (overflow clips the bottom half)
          bottom: '-55vh',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main neon arch — ellipse wider than viewport, shorter in height */}
      <div
        ref={archRef}
        style={{
          position: 'absolute',
          // Wide so the arch sweeps across the full viewport width
          width: '160vw',
          // Short enough that the arch shows only 35-40% of the viewport
          height: '90vh',
          borderRadius: '50%',
          // Hot pink center fading to deep magenta at edges
          background: [
            'radial-gradient(',
            '  ellipse at 50% 40%,',
            '  #ffb0ec 0%,',
            '  #ff4fd8 20%,',
            '  #e000a0 45%,',
            '  rgba(130,0,90,0.6) 68%,',
            '  transparent 85%',
            ')',
          ].join(''),
          boxShadow: [
            '0 0  60px rgba(255,  0,180,0.5)',
            '0 0 140px rgba(230,  0,240,0.25)',
            '0 0 280px rgba(180,  0,200,0.12)',
          ].join(','),
          // Center the ellipse at the section's bottom edge;
          // overflow:hidden clips the bottom half so only the top arch shows.
          bottom: '-45vh',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />
    </section>
  )
}
