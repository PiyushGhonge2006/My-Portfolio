import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, fadeIn, blurReveal, clipReveal, VIEWPORT } from '../motion'

const variantMap = {
  up: fadeUp,
  fade: fadeIn,
  blur: blurReveal,
  clip: clipReveal,
}

function withDelay(variant, delay) {
  if (!delay) return variant
  return {
    hidden: variant.hidden,
    visible: {
      ...variant.visible,
      transition: {
        ...variant.visible.transition,
        delay,
      },
    },
  }
}

export default function Reveal({ children, delay = 0, className = '', variant = 'up', as: Tag = 'div' }) {
  const reduced = useReducedMotion()
  const MotionTag = motion[Tag]

  const staticVariant = {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={reduced ? staticVariant : withDelay(variantMap[variant] || fadeUp, delay)}
    >
      {children}
    </MotionTag>
  )
}