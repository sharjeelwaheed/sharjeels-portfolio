import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import api from '@/utils/api'

interface Skill {
  _id: string
  name: string
  category: string
  proficiency: number
}

// Fixed positions for pills scattered around the big text (percent-based, relative to container)
const PILL_POSITIONS = [
  { top: '6%',  left: '4%',   rotate: -8 },
  { top: '3%',  left: '28%',  rotate: 4  },
  { top: '8%',  right: '22%', rotate: -5 },
  { top: '5%',  right: '4%',  rotate: 7  },
  { top: '28%', left: '2%',   rotate: -4 },
  { top: '30%', right: '3%',  rotate: 6  },
  { top: '50%', left: '3%',   rotate: 3  },
  { top: '52%', right: '2%',  rotate: -7 },
  { top: '70%', left: '5%',   rotate: -3 },
  { top: '68%', left: '30%',  rotate: 5  },
  { top: '72%', right: '20%', rotate: -4 },
  { top: '70%', right: '5%',  rotate: 6  },
  { top: '88%', left: '12%',  rotate: -6 },
  { top: '90%', left: '42%',  rotate: 3  },
  { top: '87%', right: '10%', rotate: -5 },
]

const CATEGORY_COLORS: Record<string, string> = {
  frontend: '#FF4D00',
  backend: '#818cf8',
  database: '#22c55e',
  language: '#f59e0b',
  tools: '#06b6d4',
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    api.get('/skills').then((r) => setSkills(r.data)).catch(() => {})
  }, [])

  const displayed = skills.slice(0, PILL_POSITIONS.length)

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{ background: '#080808', padding: 'clamp(5rem,10vw,8rem) 0', overflow: 'hidden' }}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Label */}
        <motion.span
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-body tracking-widest uppercase mb-6 block"
          style={{ color: '#FF4D00', letterSpacing: '0.2em' }}
        >
          Expertise
        </motion.span>

        {/* Big text + floating pills container */}
        <div style={{ position: 'relative', minHeight: '42vw' }}>

          {/* Floating skill pills */}
          {displayed.map((skill, i) => {
            const pos = PILL_POSITIONS[i]
            const color = CATEGORY_COLORS[skill.category] || '#FF4D00'
            return (
              <motion.span
                key={skill._id}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                style={{
                  position: 'absolute',
                  ...pos,
                  rotate: `${pos.rotate}deg`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 1.1rem',
                  borderRadius: 999,
                  background: `${color}12`,
                  border: `1px solid ${color}35`,
                  color: color,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  zIndex: 2,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: color, display: 'inline-block',
                  boxShadow: `0 0 6px ${color}`,
                }} />
                {skill.name}
              </motion.span>
            )
          })}

          {/* Huge TECH STACK text */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            pointerEvents: 'none',
          }}>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 'clamp(4rem, 14vw, 13rem)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                textAlign: 'center',
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.12)',
                userSelect: 'none',
              }}
            >
              TECH
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 'clamp(4rem, 14vw, 13rem)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #ffffff 30%, rgba(255,255,255,0.35) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                userSelect: 'none',
              }}
            >
              STACK
            </motion.h2>
          </div>
        </div>

      </div>
    </section>
  )
}
