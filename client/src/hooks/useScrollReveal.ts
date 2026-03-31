import { useInView } from 'react-intersection-observer'

interface Options {
  threshold?: number
  triggerOnce?: boolean
}

export function useScrollReveal({ threshold = 0.15, triggerOnce = true }: Options = {}) {
  const { ref, inView } = useInView({ threshold, triggerOnce })
  return { ref, inView }
}
