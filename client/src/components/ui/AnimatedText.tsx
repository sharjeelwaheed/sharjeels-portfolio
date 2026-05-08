import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const VIEWPORT = { once: true, margin: '-60px' }

// ── AnimatedText — words fade+slide up with optional blur ─────
interface AnimatedTextProps {
  text: string
  className?: string
  blur?: boolean
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
}

export function AnimatedText({
  text,
  className = '',
  blur = false,
  delay = 0,
  as: Tag = 'p',
}: AnimatedTextProps) {
  const words = text.split(' ')

  return (
    <Tag className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 32, filter: blur ? 'blur(10px)' : 'none' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={VIEWPORT}
          transition={{
            duration: 0.7,
            ease: EASE,
            delay: delay + i * 0.06,
          }}
          style={{ display: 'inline-block' }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}

// ── SplitText — individual letters clip up ────────────────────
interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
}

export function SplitText({ text, className = '', delay = 0, as: Tag = 'span' }: SplitTextProps) {
  const letters = text.split('')

  return (
    <Tag className={className} style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
      {letters.map((letter, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden' }}>
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={VIEWPORT}
            transition={{
              duration: 0.65,
              ease: EASE,
              delay: delay + i * 0.03,
            }}
            style={{ display: 'inline-block' }}
          >
            {letter === ' ' ? ' ' : letter}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

// ── LineReveal — overflow:hidden clip-up reveal ───────────────
interface LineRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function LineReveal({ children, className = '', delay = 0 }: LineRevealProps) {
  return (
    <div style={{ overflow: 'hidden' }} className={className}>
      <motion.div
        initial={{ y: '105%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.75, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// ── FadeIn — generic block reveal ────────────────────────────
interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function FadeIn({ children, className = '', delay = 0, y = 28 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

// ── ScrollReveal — words reveal driven by scroll progress ─────
interface ScrollRevealProps {
  text: string
  className?: string
}

export function ScrollReveal({ text, className = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.4'],
  })

  const words = text.split(' ')

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em' }}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = (i + 1) / words.length

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.12, 1])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const y = useTransform(scrollYProgress, [start, end], [6, 0])

        return (
          <motion.span key={i} style={{ opacity, y, display: 'inline-block' }}>
            {word}
          </motion.span>
        )
      })}
    </p>
  )
}
