import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { letterReveal, letterContainer } from '@/utils/animations'

const LETTERS = 'SHARJEEL'.split('')

interface Props {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: Props) {
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const alreadyVisited = sessionStorage.getItem('visited')
    if (alreadyVisited) {
      setVisible(false)
      onComplete()
      return
    }
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => {
        setVisible(false)
        sessionStorage.setItem('visited', '1')
        onComplete()
      }, 700)
    }, 2200)
    return () => clearTimeout(timer)
  }, [onComplete])

  if (!visible) return null

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-primary"
          initial={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{ transformOrigin: 'top' }}
        >
          {/* Glow orb behind */}
          <div
            className="absolute w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,77,0,0.3) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Letters */}
          <motion.div
            className="flex gap-1 md:gap-2 relative z-10"
            variants={letterContainer}
            initial="hidden"
            animate="visible"
          >
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                variants={letterReveal}
                className="font-heading font-extrabold text-5xl md:text-7xl lg:text-8xl text-white"
                style={{ display: 'inline-block', fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em' }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            className="text-white/40 text-sm font-body tracking-widest mt-4 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Creative Developer
          </motion.p>
        </motion.div>
      )}
      {exiting && (
        <motion.div
          key="exit"
          className="fixed inset-0 z-[99999] bg-primary"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{ transformOrigin: 'top' }}
        />
      )}
    </AnimatePresence>
  )
}
