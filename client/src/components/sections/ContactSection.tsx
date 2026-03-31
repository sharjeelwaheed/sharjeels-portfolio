import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Mail, Send, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import SectionHeading from '@/components/ui/SectionHeading'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/ui/SocialIcons'
import { fadeUp, staggerContainer } from '@/utils/animations'
import { SOCIAL_LINKS } from '@/utils/constants'

interface FormData {
  name: string
  email: string
  message: string
}

const SOCIALS = [
  { icon: GithubIcon, href: SOCIAL_LINKS.github, label: 'GitHub', color: '#ffffff' },
  { icon: LinkedinIcon, href: `https://${SOCIAL_LINKS.linkedin}`, label: 'LinkedIn', color: '#0A66C2' },
  { icon: InstagramIcon, href: `https://${SOCIAL_LINKS.instagram}`, label: 'Instagram', color: '#E1306C' },
  { icon: Mail, href: `mailto:${SOCIAL_LINKS.email}`, label: 'Email', color: '#FF4D00' },
]

export default function ContactSection() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    // For now, log and show success. Wire up to a backend endpoint or EmailJS later.
    console.log('Contact form:', data)
    await new Promise((r) => setTimeout(r, 800))
    toast.success("Message sent! I'll get back to you soon.")
    reset()
  }

  return (
    <section id="contact" className="section-padding bg-primary">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="flex flex-col gap-8">
            <SectionHeading label="Get In Touch" title="Let's Build Something Great" />
            <motion.p
              className="text-white/50 font-body leading-relaxed"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Have a project in mind or want to collaborate? I'm always open to discussing new
              opportunities, creative ideas, and interesting problems to solve.
            </motion.p>

            <motion.div
              className="flex items-center gap-3 text-white/60 font-body text-sm"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <MapPin size={16} className="text-accent-orange" />
              Gujranwala, Pakistan
            </motion.div>

            <motion.div
              className="flex items-center gap-3 text-white/60 font-body text-sm"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <Mail size={16} className="text-accent-orange" />
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="hover:text-accent-orange transition-colors">
                {SOCIAL_LINKS.email}
              </a>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              className="flex gap-3 mt-2"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {SOCIALS.map(({ icon: Icon, href, label, color }) => (
                <motion.div key={label} variants={fadeUp}>
                  <MagneticButton>
                    <a
                      href={href}
                      target={href.startsWith('mailto') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-12 h-12 flex items-center justify-center rounded-full glass text-white/50 transition-all duration-300"
                      style={{ '--hover-color': color } as React.CSSProperties}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget
                        el.style.color = color
                        el.style.borderColor = `${color}50`
                        el.style.boxShadow = `0 0 16px ${color}40`
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget
                        el.style.color = ''
                        el.style.borderColor = ''
                        el.style.boxShadow = ''
                      }}
                    >
                      <Icon size={18} />
                    </a>
                  </MagneticButton>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <GlassCard className="p-8" hover={false}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div>
                  <label className="block text-white/60 text-sm font-body mb-2">Your Name</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Sharjeel Pawar"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-accent-orange transition-colors placeholder:text-white/20"
                  />
                  {errors.name && <p className="text-accent-red text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-white/60 text-sm font-body mb-2">Email Address</label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                    })}
                    placeholder="you@example.com"
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-accent-orange transition-colors placeholder:text-white/20"
                  />
                  {errors.email && <p className="text-accent-red text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-white/60 text-sm font-body mb-2">Message</label>
                  <textarea
                    {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Too short' } })}
                    placeholder="Tell me about your project..."
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-accent-orange transition-colors placeholder:text-white/20 resize-none"
                  />
                  {errors.message && <p className="text-accent-red text-xs mt-1">{errors.message.message}</p>}
                </div>

                <MagneticButton>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-medium text-white text-sm disabled:opacity-60 transition-all"
                    style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)' }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send size={16} />
                  </button>
                </MagneticButton>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
