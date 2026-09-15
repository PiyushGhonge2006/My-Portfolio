import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

export default function Magnetic({ children, strength = 6, radius = 140, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 200, damping: 16, mass: 0.4 })

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const small = window.matchMedia('(max-width: 1023px)').matches
    if (!fine || small) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      const dist = Math.hypot(dx, dy)
      if (dist > radius) {
        x.set(0)
        y.set(0)
        return
      }
      const pull = 1 - dist / radius
      let px = dx * 0.28 * pull
      let py = dy * 0.28 * pull
      const len = Math.hypot(px, py)
      if (len > strength) {
        px = (px / len) * strength
        py = (py / len) * strength
      }
      x.set(px)
      y.set(py)
    }

    const onLeave = () => {
      x.set(0)
      y.set(0)
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave, { passive: true })
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [radius, strength, reduced, x, y])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ display: 'inline-block', x: sx, y: sy, willChange: 'transform' }}
    >
      {children}
    </motion.div>
  )
}