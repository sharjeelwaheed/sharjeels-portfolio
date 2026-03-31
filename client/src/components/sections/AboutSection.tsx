import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Code2, Lightbulb, Layers } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import GlassCard from '@/components/ui/GlassCard'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { fadeUp, staggerContainer } from '@/utils/animations'
import api from '@/utils/api'

interface AboutData {
  bio?: string
  tagline?: string
  stats?: { label: string; value: string }[]
  highlights?: { icon: string; text: string }[]
}

const DEFAULT_HIGHLIGHTS = [
  { icon: 'code', text: 'Full Stack Developer', desc: 'React · Node.js · MongoDB' },
  { icon: 'lightbulb', text: 'Problem Solver', desc: 'Algorithms & Clean Architecture' },
  { icon: 'layers', text: 'UI/UX Enthusiast', desc: 'Figma · Framer Motion · Tailwind' },
]

const IconMap: Record<string, typeof Code2> = {
  code: Code2,
  lightbulb: Lightbulb,
  layers: Layers,
  '🚀': Layers,
  '💡': Lightbulb,
  '🎨': Code2,
}

export default function AboutSection() {
  const [about, setAbout] = useState<AboutData>({})
  const { ref, inView } = useScrollReveal()

  useEffect(() => {
    api.get('/about').then((r) => setAbout(r.data)).catch(() => {})
  }, [])

  const bio = about.bio || "I'm a passionate Computer Science student (Semester 6) from Gujranwala, Pakistan, focused on building modern, scalable, and user-friendly applications. I love turning complex problems into elegant digital solutions."
  const stats = about.stats || [
    { label: 'Projects Built', value: '15+' },
    { label: 'Technologies', value: '10+' },
    { label: 'Semester', value: '6th' },
  ]

  return (
    <section id="about" className="section-padding bg-primary">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div className="flex flex-col gap-8">
            <SectionHeading label="About Me" title="Behind the Code" />

            <motion.p
              className="text-white/60 font-body leading-relaxed text-lg"
              ref={ref}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={fadeUp}
            >
              {bio}
            </motion.p>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-8 pt-4 border-t border-white/5">
              {stats.map((stat) => (
                <AnimatedCounter key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>

          {/* Right — highlight cards */}
          <motion.div
            className="flex flex-col gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {DEFAULT_HIGHLIGHTS.map((item, i) => {
              const Icon = IconMap[item.icon] || Code2
              return (
                <motion.div key={i} variants={fadeUp}>
                  <GlassCard className="p-5 flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, rgba(255,77,0,0.2), rgba(255,45,85,0.1))' }}
                    >
                      <Icon size={20} className="text-accent-orange" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-white text-lg">{item.text}</h3>
                      <p className="text-white/40 font-body text-sm mt-1">{item.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
