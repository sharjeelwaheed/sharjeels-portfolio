import type { Variants } from 'framer-motion'

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1]

// ── Fade Up ─────────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
}

// ── Fade In ──────────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

// ── Slide In Left ────────────────────────────────────────────
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
}

// ── Slide In Right ───────────────────────────────────────────
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
}

// ── Stagger Container ────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

// ── Word Reveal (for SectionHeading) ────────────────────────
export const wordReveal: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
}

// ── Letter Reveal (for LoadingScreen) ───────────────────────
export const letterReveal: Variants = {
  hidden: {
    y: 80,
    clipPath: 'inset(100% 0 0 0)',
    opacity: 0,
  },
  visible: {
    y: 0,
    clipPath: 'inset(0% 0 0 0)',
    opacity: 1,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
}

export const letterContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

// ── Card Hover ────────────────────────────────────────────────
export const cardHover = {
  rest: { y: 0, boxShadow: '0 0 0px rgba(255,77,0,0)' },
  hover: {
    y: -8,
    boxShadow: '0 20px 40px rgba(255,77,0,0.15)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

// ── Scale Up ──────────────────────────────────────────────────
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
}

// ── Timeline Entry ───────────────────────────────────────────
export const timelineLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
}

export const timelineRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
}
