import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'

gsap.registerPlugin(ScrollTrigger)

// Initialize Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
})

// Expose lenis globally so Navbar can call lenis.scrollTo
;(window as unknown as { lenis: Lenis }).lenis = lenis

// Drive Lenis via GSAP ticker so ScrollTrigger stays in sync
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
lenis.on('scroll', ScrollTrigger.update)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
