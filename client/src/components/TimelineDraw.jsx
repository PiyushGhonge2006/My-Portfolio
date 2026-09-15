import { useEffect, useRef } from 'react'
import { useScroll, useSpring, useReducedMotion } from 'framer-motion'

export default function TimelineDraw({ children, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.5'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.001 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduced) {
      el.style.setProperty('--tl', '1')
      return
    }

    const onChange = (v) => {
      el.style.setProperty('--tl', Math.max(0, Math.min(1, v)).toFixed(4))
    }
    return progress.on('change', onChange)
  }, [progress, reduced])

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
    </div>
  )
}