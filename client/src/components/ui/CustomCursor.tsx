import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const { x, y } = useMousePosition()

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
  const ringX = useSpring(x, springConfig)
  const ringY = useSpring(y, springConfig)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
      return
    }

    const addHover = () => setIsHovering(true)
    const removeHover = () => setIsHovering(false)

    const interactives = document.querySelectorAll('a, button, [data-cursor-hover]')
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    const observer = new MutationObserver(() => {
      const els = document.querySelectorAll('a, button, [data-cursor-hover]')
      els.forEach((el) => {
        el.addEventListener('mouseenter', addHover)
        el.addEventListener('mouseleave', removeHover)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', addHover)
        el.removeEventListener('mouseleave', removeHover)
      })
      observer.disconnect()
    }
  }, [])

  if (isTouch) return null

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
        }}
      />
      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          opacity: isHovering ? 0.8 : 0.5,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="w-full h-full rounded-full border-2"
          style={{
            borderColor: isHovering ? '#FF4D00' : 'rgba(255,255,255,0.5)',
            boxShadow: isHovering ? '0 0 12px rgba(255,77,0,0.6)' : 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        />
      </motion.div>
    </>
  )
}
