import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useInView as useInViewObs } from 'react-intersection-observer'
import GlassCard from '@/components/ui/GlassCard'
import { TECH_COLORS, SKILL_CATEGORIES } from '@/utils/constants'
import api from '@/utils/api'

interface Skill {
  _id: string
  name: string
  category: string
  proficiency: number
}

function SkillBar({ skill }: { skill: Skill }) {
  const { ref, inView } = useInViewObs({ triggerOnce: true, threshold: 0.5 })
  const color = TECH_COLORS[skill.name] || '#FF4D00'

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="font-body text-sm text-white/80">{skill.name}</span>
        <span className="font-body text-xs text-white/40">{skill.proficiency}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${skill.proficiency}%` : 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </div>
    </div>
  )
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const headingRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-80px' })

  useEffect(() => {
    api.get('/skills').then((r) => setSkills(r.data)).catch(() => {})
  }, [])

  const grouped = SKILL_CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = skills.filter((s) => s.category === cat.value)
    return acc
  }, {} as Record<string, Skill[]>)

  const frontendSkills = [...(grouped['frontend'] || []), ...(grouped['language'] || [])]
  const backendSkills = [...(grouped['backend'] || []), ...(grouped['database'] || []), ...(grouped['tools'] || [])]

  return (
    <section id="skills" style={{ background: '#080808', padding: 'clamp(5rem,10vw,8rem) 0', overflow: 'hidden' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Big animated heading — inspo style */}
        <div ref={headingRef} className="mb-16">
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            animate={headingInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-body tracking-widest uppercase mb-6 block"
            style={{ color: '#FF4D00', letterSpacing: '0.2em' }}
          >
            Expertise
          </motion.span>

          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ y: '110%' }}
              animate={headingInView ? { y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 'clamp(4.5rem, 13vw, 11rem)',
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.15)',
                display: 'block',
              }}
            >
              TECH
            </motion.h2>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ y: '110%' }}
              animate={headingInView ? { y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 'clamp(4.5rem, 13vw, 11rem)',
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.4) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'block',
              }}
            >
              STACK
            </motion.h2>
          </div>
        </div>

        {/* Skill Bars */}
        <div className="grid md:grid-cols-2 gap-8">
          <GlassCard className="p-6" hover={false}>
            <h3 className="font-heading font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-orange" />
              Frontend & Languages
            </h3>
            <div className="flex flex-col gap-5">
              {frontendSkills.map((skill) => <SkillBar key={skill._id} skill={skill} />)}
            </div>
          </GlassCard>
          <GlassCard className="p-6" hover={false}>
            <h3 className="font-heading font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-red" />
              Backend, Databases & Tools
            </h3>
            <div className="flex flex-col gap-5">
              {backendSkills.map((skill) => <SkillBar key={skill._id} skill={skill} />)}
            </div>
          </GlassCard>
        </div>

      </div>
    </section>
  )
}
