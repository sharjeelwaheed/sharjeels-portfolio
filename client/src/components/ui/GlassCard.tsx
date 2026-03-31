import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function GlassCard({ children, className = '', hover = true, ...props }: Props) {
  return (
    <motion.div
      className={`glass rounded-2xl ${className}`}
      whileHover={hover ? {
        y: -4,
        boxShadow: '0 20px 40px rgba(255,77,0,0.12)',
        borderColor: 'rgba(255,77,0,0.25)',
      } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
