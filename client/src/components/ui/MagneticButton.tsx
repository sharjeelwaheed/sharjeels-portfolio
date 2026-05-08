import { useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface Props {
  children: ReactNode
  strength?: number
  className?: string
}

export default function MagneticButton({ children, strength = 0.2, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spec: cubic-bezier(0.16,1,0.3,1) spring feel
  const springX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.6 })

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    // 20% of cursor offset from center
    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
  }

  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  )
}
