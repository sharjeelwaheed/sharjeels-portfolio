import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'
import api from '@/utils/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'What projects have you built?',
  'What services do you offer?',
  'Are you available for hire?',
]

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey! I'm Sharjeel's AI assistant. Ask me anything about his work, skills, or projects 👋" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const { data } = await api.post('/chat', {
        messages: next.map((m) => ({ role: m.role, content: m.content })),
      })
      setMessages([...next, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Sorry, something went wrong. Try again!' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[9998] flex items-center justify-center rounded-full shadow-2xl"
        style={{
          width: 56,
          height: 56,
          background: 'linear-gradient(135deg, #FF4D00, #FF2D55)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} color="#fff" />
            </motion.span>
          ) : (
            <motion.span key="spark" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="white" />
                <path d="M19 16L19.9 18.1L22 19L19.9 19.9L19 22L18.1 19.9L16 19L18.1 18.1L19 16Z" fill="rgba(255,255,255,0.7)" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-6 z-[9997] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: 'min(380px, calc(100vw - 2rem))',
              height: 'min(520px, calc(100vh - 120px))',
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#FF4D00,#FF2D55)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="white" />
                  <path d="M19 16L19.9 18.1L22 19L19.9 19.9L19 22L18.1 19.9L16 19L18.1 18.1L19 16Z" fill="rgba(255,255,255,0.7)" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium leading-none mb-0.5" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Sharjeel's Assistant
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Ask me anything</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="rounded-full" style={{ width: 6, height: 6, background: '#22c55e', display: 'inline-block' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      maxWidth: '82%',
                      fontFamily: "'Outfit', sans-serif",
                      ...(msg.role === 'user'
                        ? { background: 'linear-gradient(135deg,#FF4D00,#FF2D55)', color: '#fff', borderBottomRightRadius: 4 }
                        : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', borderBottomLeftRadius: 4 }),
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 flex gap-1.5" style={{ background: 'rgba(255,255,255,0.06)', borderBottomLeftRadius: 4 }}>
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="rounded-full"
                        style={{ width: 6, height: 6, background: 'rgba(255,77,0,0.7)', display: 'inline-block' }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions (show only at start) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2 flex-shrink-0">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full transition-all duration-200"
                    style={{
                      color: '#FF4D00',
                      background: 'rgba(255,77,0,0.08)',
                      border: '1px solid rgba(255,77,0,0.2)',
                      fontFamily: "'Outfit', sans-serif",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,77,0,0.15)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,77,0,0.08)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: 'rgba(255,255,255,0.85)', fontFamily: "'Outfit', sans-serif" }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-200"
                style={{
                  width: 34,
                  height: 34,
                  background: input.trim() && !loading ? 'linear-gradient(135deg,#FF4D00,#FF2D55)' : 'rgba(255,255,255,0.06)',
                }}
              >
                <Send size={15} color={input.trim() && !loading ? '#fff' : 'rgba(255,255,255,0.2)'} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
