import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SectionHeading from '@/components/ui/SectionHeading'
import GlassCard from '@/components/ui/GlassCard'
import { staggerContainer, scaleUp } from '@/utils/animations'
import { TECH_COLORS, SKILL_CATEGORIES } from '@/utils/constants'
import api from '@/utils/api'

interface Skill {
  _id: string
  name: string
  category: string
  proficiency: number
}

function SkillBar({ skill }: { skill: Skill }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 })
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

function SkillIcon({ skill }: { skill: Skill }) {
  const color = TECH_COLORS[skill.name] || '#FF4D00'
  const initials = skill.name.split(/[\s.]+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.div
      variants={scaleUp}
      whileHover={{ rotate: 8, scale: 1.12 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center font-heading font-bold text-sm"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}30`,
          color: color,
        }}
      >
        {initials}
      </div>
      <span className="text-white/50 text-xs font-body text-center leading-tight">{skill.name}</span>
    </motion.div>
  )
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])

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
    <section id="skills" className="section-padding bg-primary">
      <div className="max-w-7xl mx-auto">
        <SectionHeading label="Expertise" title="Tech Stack" className="mb-12" />

        {/* Icon Grid */}
        <motion.div
          className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-6 mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {skills.map((skill) => (
            <SkillIcon key={skill._id} skill={skill} />
          ))}
        </motion.div>

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
