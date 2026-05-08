import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

type CursorState = 'default' | 'hover' | 'click'

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false)
  const [state, setState] = useState<CursorState>('default')

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Dot — very tight follower
  const dotX = useSpring(mouseX, { stiffness: 600, damping: 32, mass: 0.4 })
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 32, mass: 0.4 })

  // Ring — lags behind
  const ringX = useSpring(mouseX, { stiffness: 160, damping: 22, mass: 0.6 })
  const ringY = useSpring(mouseY, { stiffness: 160, damping: 22, mass: 0.6 })

  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
      return
    }

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const onDown = () => setState('click')
    const onUp   = () => setState(stateRef.current === 'click' ? 'default' : stateRef.current)

    const onEnter = (e: MouseEvent) => {
      const el = (e.target as Element).closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]'
      )
      if (el) setState('hover')
    }

    const onLeave = (e: MouseEvent) => {
      const el = (e.target as Element).closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]'
      )
      if (el) setState('default')
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
    }
  }, [mouseX, mouseY])

  if (isTouch) return null

  const dotSize   = state === 'hover' ? 0  : state === 'click' ? 4  : 7
  const ringSize  = state === 'hover' ? 52 : state === 'click' ? 22 : 36
  const ringBorder = state === 'hover'
    ? '2px solid #FF4D00'
    : state === 'click'
    ? '2px solid #06b6d4'
    : '1.5px solid rgba(240,240,255,0.4)'
  const ringBg = state === 'hover' ? 'rgba(255,77,0,0.06)' : 'transparent'

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-white"
        style={{
          x: dotX, y: dotY,
          translateX: '-50%', translateY: '-50%',
          width: dotSize, height: dotSize,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          x: ringX, y: ringY,
          translateX: '-50%', translateY: '-50%',
          width: ringSize, height: ringSize,
          border: ringBorder,
          background: ringBg,
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Glow layer — only on hover */}
      {state === 'hover' && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full"
          style={{
            x: ringX, y: ringY,
            translateX: '-50%', translateY: '-50%',
            width: 80, height: 80,
            background: 'radial-gradient(circle, rgba(255,77,0,0.18) 0%, transparent 70%)',
            filter: 'blur(4px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </>
  )
}
