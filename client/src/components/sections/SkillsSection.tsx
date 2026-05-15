import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useInView as useInViewObs } from 'react-intersection-observer'
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

// devicon slug map for logo images
const DEVICON: Record<string, string> = {
  'React': 'react',
  'Node.js': 'nodejs',
  'MongoDB': 'mongodb',
  'TypeScript': 'typescript',
  'JavaScript': 'javascript',
  'Express.js': 'express',
  'Tailwind CSS': 'tailwindcss',
  'Framer Motion': 'framermotion',
  'Firebase': 'firebase',
  'HTML & CSS': 'html5',
  'Git & GitHub': 'github',
  'Socket.io': 'socketio',
  'Figma': 'figma',
  'Python': 'python',
  'PostgreSQL': 'postgresql',
  'Supabase': 'supabase',
  'Vite': 'vitejs',
  'Docker': 'docker',
}

function SkillIcon({ skill }: { skill: Skill }) {
  const color = TECH_COLORS[skill.name] || '#FF4D00'
  const slug = DEVICON[skill.name]
  const initials = skill.name.split(/[\s.]+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.div
      variants={scaleUp}
      whileHover={{ scale: 1.15, y: -4 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}30`,
        }}
      >
        {slug ? (
          <img
            src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`}
            alt={skill.name}
            style={{ width: 32, height: 32, objectFit: 'contain' }}
            onError={e => {
              // fallback to plain svg variant if original doesn't exist
              const img = e.currentTarget
              if (!img.src.includes('plain')) {
                img.src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-plain.svg`
              }
            }}
          />
        ) : (
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700, color }}>{initials}</span>
        )}
      </div>
      <span className="text-white/50 text-xs font-body text-center leading-tight">{skill.name}</span>
    </motion.div>
  )
}

const FALLBACK_SKILLS: Skill[] = [
  { _id: '1',  name: 'React',         category: 'frontend',  proficiency: 90 },
  { _id: '2',  name: 'TypeScript',    category: 'language',  proficiency: 85 },
  { _id: '3',  name: 'Node.js',       category: 'backend',   proficiency: 88 },
  { _id: '4',  name: 'MongoDB',       category: 'database',  proficiency: 82 },
  { _id: '5',  name: 'Tailwind CSS',  category: 'frontend',  proficiency: 92 },
  { _id: '6',  name: 'Express.js',    category: 'backend',   proficiency: 85 },
  { _id: '7',  name: 'Figma',         category: 'tools',     proficiency: 78 },
  { _id: '8',  name: 'JavaScript',    category: 'language',  proficiency: 92 },
  { _id: '9',  name: 'Git & GitHub',  category: 'tools',     proficiency: 88 },
  { _id: '10', name: 'Framer Motion', category: 'frontend',  proficiency: 80 },
  { _id: '11', name: 'Vite',          category: 'tools',     proficiency: 85 },
  { _id: '12', name: 'Firebase',      category: 'database',  proficiency: 75 },
]

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const headingRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-80px' })

  useEffect(() => {
    api.get('/skills').then((r) => {
      if (r.data?.length) setSkills(r.data)
      else setSkills(FALLBACK_SKILLS)
    }).catch(() => setSkills(FALLBACK_SKILLS))
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

        {/* Big animated heading */}
        <div ref={headingRef} className="mb-12">
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            animate={headingInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-body tracking-widest uppercase mb-4 block"
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
                color: '#ffffff',
                WebkitTextStroke: 'unset',
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
