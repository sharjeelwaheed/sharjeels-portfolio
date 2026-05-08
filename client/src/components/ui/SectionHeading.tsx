import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { wordReveal, staggerContainer } from '@/utils/animations'

interface Props {
  label?: string
  title: string
  className?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ label, title, className = '', align = 'left' }: Props) {
  const { ref, inView } = useScrollReveal()
  const words = title.split(' ')
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div ref={ref} className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {label && (
        <motion.span
          className="text-sm font-body font-medium tracking-widest uppercase gradient-text"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight"
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
            <motion.span className="inline-block" variants={wordReveal}>
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h2>
    </div>
  )
}
