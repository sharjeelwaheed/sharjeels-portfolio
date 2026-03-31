import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { LogIn } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import api from '@/utils/api'

interface LoginForm {
  username: string
  password: string
}

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginForm>()

  useEffect(() => {
    document.body.style.cursor = 'auto'
    if (isAuthenticated) navigate('/admin', { replace: true })
    return () => { document.body.style.cursor = '' }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post('/auth/login', data)
      login(res.data.token)
      navigate('/admin')
    } catch {
      toast.error('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6" style={{ cursor: 'auto' }}>
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,77,0,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass rounded-2xl p-8 border border-white/8">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-white mb-2">
              Admin <span className="gradient-text">Portal</span>
            </h1>
            <p className="text-white/40 font-body text-sm">Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label className="block text-white/50 text-sm font-body mb-2">Username</label>
              <input
                {...register('username', { required: true })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-accent-orange transition-colors"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm font-body mb-2">Password</label>
              <input
                {...register('password', { required: true })}
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-accent-orange transition-colors"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-medium text-white text-sm mt-2 disabled:opacity-60 transition-all"
              style={{ background: 'linear-gradient(135deg, #FF4D00, #FF2D55)' }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
              <LogIn size={16} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
