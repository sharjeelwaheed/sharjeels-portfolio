import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ExternalLink, ArrowUpRight } from 'lucide-react'
import { GithubIcon } from '@/components/ui/SocialIcons'
import SectionHeading from '@/components/ui/SectionHeading'
import { PROJECT_CATEGORIES, TECH_COLORS } from '@/utils/constants'
import api from '@/utils/api'

interface Project {
  _id: string
  title: string
  description: string
  imageUrl?: string
  techStack: string[]
  category: string
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
}

// Card animates in with a clip-path reveal — the way premium agencies do it
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    clipPath: 'inset(100% 0% 0% 0%)',
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      delay: i * 0.08,
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="rounded-2xl overflow-hidden cursor-pointer relative"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        y: -10,
        borderColor: 'rgba(255,77,0,0.3)',
        boxShadow: '0 30px 60px rgba(255,77,0,0.1)',
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {project.imageUrl ? (
          <motion.img
            src={project.imageUrl}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1a0800, #2d1000)' }}
          >
            <span
              className="font-heading font-bold text-6xl opacity-20"
              style={{ background: 'linear-gradient(135deg,#FF4D00,#FF2D55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {project.title[0]}
            </span>
          </div>
        )}

        {/* Dark overlay on hover with action links */}
        <motion.div
          className="absolute inset-0 flex items-end justify-between p-4"
          style={{ background: 'linear-gradient(to top, rgba(11,11,11,0.95) 0%, transparent 60%)' }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body text-white"
                style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)' }}
              >
                Live <ArrowUpRight size={12} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body text-white/80 hover:text-white"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
              >
                <GithubIcon size={12} /> Code
              </a>
            )}
          </div>
          {project.featured && (
            <span className="px-2 py-0.5 rounded-full text-xs font-body text-white/60" style={{ background: 'rgba(255,255,255,0.08)' }}>
              Featured
            </span>
          )}
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-heading font-bold text-white text-xl leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {project.title}
          </h3>
          <motion.div
            animate={{ rotate: hovered ? 45 : 0, color: hovered ? '#FF4D00' : 'rgba(255,255,255,0.2)' }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 mt-1"
          >
            <ExternalLink size={16} />
          </motion.div>
        </div>

        <p className="text-white/40 font-body text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-xs font-body"
              style={{
                color: TECH_COLORS[tech] || 'rgba(255,255,255,0.5)',
                background: `${TECH_COLORS[tech] || '#ffffff'}10`,
                border: `1px solid ${TECH_COLORS[tech] || '#ffffff'}20`,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    api.get('/projects')
      .then((r: { data: Project[] }) => { setProjects(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <section id="projects" className="section-padding" style={{ background: '#0e0e0e' }}>
      <div className="max-w-7xl mx-auto" ref={ref}>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading label="My Work" title="Selected Projects" />

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="relative px-4 py-1.5 rounded-full text-sm font-body transition-colors duration-200"
                style={{
                  color: activeCategory === cat.value ? '#ffffff' : 'rgba(255,255,255,0.35)',
                }}
              >
                {activeCategory === cat.value && (
                  <motion.span
                    layoutId="pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', aspectRatio: '4/3' }} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {filtered.length > 0 ? (
                filtered.map((project, i) => (
                  <ProjectCard key={project._id} project={project} index={i} />
                ))
              ) : (
                <motion.p
                  className="col-span-2 text-center text-white/30 font-body py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No projects in this category yet.
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}
