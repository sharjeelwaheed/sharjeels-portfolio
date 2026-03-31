import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'

interface Props {
  value: string
  label: string
}

export default function AnimatedCounter({ value, label }: Props) {
  const numericMatch = value.match(/\d+/)
  const numeric = numericMatch ? parseInt(numericMatch[0], 10) : 0
  const suffix = value.replace(/\d+/, '')

  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      const ctrl = animate(count, numeric, { duration: 2, ease: 'easeOut' })
      return ctrl.stop
    }
  }, [inView, count, numeric])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <div className="font-heading font-bold text-4xl md:text-5xl gradient-text">
        <motion.span>{rounded}</motion.span>
        <span>{suffix}</span>
      </div>
      <p className="text-white/50 text-sm font-body">{label}</p>
    </div>
  )
}
