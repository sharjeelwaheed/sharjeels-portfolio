import { useEffect, useRef } from 'react'
import { useMotionValue, useInView, animate } from 'framer-motion'

export function useAnimatedCounter(target: number, duration = 2) {
  const count = useMotionValue(0)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      const controls = animate(count, target, { duration, ease: 'easeOut' })
      return controls.stop
    }
  }, [inView, count, target, duration])

  return { count, ref }
}
