import { LineReveal, FadeIn } from '@/components/ui/AnimatedText'

interface Props {
  label?: string
  title: string
  className?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ label, title, className = '', align = 'left' }: Props) {
  const words = title.split(' ')
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {label && (
        <FadeIn delay={0}>
          <span className="text-sm font-body font-medium tracking-widest uppercase gradient-text">
            {label}
          </span>
        </FadeIn>
      )}
      <h2
        className={`font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight`}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.3em',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
        }}
      >
        {words.map((word, i) => (
          <LineReveal key={i} delay={0.1 + i * 0.08}>
            <span>{word}</span>
          </LineReveal>
        ))}
      </h2>
    </div>
  )
}
