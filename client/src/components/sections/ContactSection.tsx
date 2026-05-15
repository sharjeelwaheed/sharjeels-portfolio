import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { motion, useInView } from 'framer-motion'
import { Mail, Send, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/ui/SocialIcons'
import { SOCIAL_LINKS } from '@/utils/constants'

interface FormData {
  name: string
  email: string
  message: string
}

const SOCIALS = [
  { icon: GithubIcon,   href: SOCIAL_LINKS.github,                  label: 'GitHub',    color: '#0a0a0a' },
  { icon: LinkedinIcon, href: `https://${SOCIAL_LINKS.linkedin}`,    label: 'LinkedIn',  color: '#0A66C2' },
  { icon: InstagramIcon,href: `https://${SOCIAL_LINKS.instagram}`,   label: 'Instagram', color: '#E1306C' },
  { icon: Mail,         href: `mailto:${SOCIAL_LINKS.email}`,        label: 'Email',     color: '#FF4D00' },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#f9f9f9',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: 12,
  padding: '0.85rem 1.1rem',
  fontFamily: "'Outfit', sans-serif",
  fontSize: '0.9rem',
  color: '#0a0a0a',
  outline: 'none',
  transition: 'border-color 0.2s',
}

export default function ContactSection() {
  const headingRef = useRef(null)
  const inView = useInView(headingRef, { once: true, margin: '-60px' })
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    console.log('Contact form:', data)
    await new Promise((r) => setTimeout(r, 800))
    toast.success("Message sent! I'll get back to you soon.")
    reset()
  }

  return (
    <section id="contact" style={{ background: '#ffffff', padding: 'clamp(5rem,10vw,8rem) 0' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div ref={headingRef} className="mb-16">
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-body tracking-widest uppercase mb-4 block"
            style={{ color: '#FF4D00', letterSpacing: '0.2em' }}
          >
            Get In Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-black leading-none"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              color: '#0a0a0a',
              letterSpacing: '-0.03em',
            }}
          >
            LET'S BUILD<br />
            <span style={{ background: 'linear-gradient(135deg,#FF4D00,#FF2D55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SOMETHING
            </span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8"
          >
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem', color: 'rgba(0,0,0,0.45)', lineHeight: 1.7, maxWidth: 400 }}>
              Have a project in mind or want to collaborate? I'm always open to discussing new
              opportunities, creative ideas, and interesting problems to solve.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.875rem', color: 'rgba(0,0,0,0.5)' }}>
                <MapPin size={15} color="#FF4D00" />
                Gujranwala, Pakistan
              </div>
              <div className="flex items-center gap-3" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.875rem', color: 'rgba(0,0,0,0.5)' }}>
                <Mail size={15} color="#FF4D00" />
                <a href={`mailto:${SOCIAL_LINKS.email}`} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FF4D00')}
                  onMouseLeave={e => (e.currentTarget.style.color = '')}>
                  {SOCIAL_LINKS.email}
                </a>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 44, height: 44,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%',
                    border: '1px solid rgba(0,0,0,0.1)',
                    color: 'rgba(0,0,0,0.4)',
                    textDecoration: 'none',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = color
                    e.currentTarget.style.borderColor = `${color}50`
                    e.currentTarget.style.boxShadow = `0 0 14px ${color}30`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(0,0,0,0.4)'
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem', color: 'rgba(0,0,0,0.45)', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
                  Your Name
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Sharjeel Pawar"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#FF4D00')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)')}
                />
                {errors.name && <p style={{ color: '#FF2D55', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name.message}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem', color: 'rgba(0,0,0,0.45)', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
                  Email Address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                  })}
                  placeholder="you@example.com"
                  type="email"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#FF4D00')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)')}
                />
                {errors.email && <p style={{ color: '#FF2D55', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email.message}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem', color: 'rgba(0,0,0,0.45)', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
                  Message
                </label>
                <textarea
                  {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Too short' } })}
                  placeholder="Tell me about your project..."
                  rows={5}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#FF4D00')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)')}
                />
                {errors.message && <p style={{ color: '#FF2D55', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  padding: '0.9rem',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #FF4D00, #FF2D55)',
                  color: '#ffffff',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: 'opacity 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.transform = 'scale(1.01)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = '' }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send size={15} />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
