// =========================================================
//  PREMIUM MOTION DESIGN SYSTEM
//  Centralized framer-motion variants + presets
// =========================================================

export const EASE = {
  cinematic: [0.19, 1, 0.22, 1],
  soft: [0.4, 0, 0.2, 1],
  spring: { type: 'spring', stiffness: 300, damping: 26, mass: 0.8 },
  gentle: { type: 'spring', stiffness: 120, damping: 20 },
  snappy: { type: 'spring', stiffness: 500, damping: 30 },
}

export const VIEWPORT = {
  once: true,
  amount: 0.18,
}

// ---- Generic scroll reveal variants ----
export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.cinematic },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export const blurReveal = {
  hidden: { opacity: 0, y: 18, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE.cinematic },
  },
}

export const clipReveal = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)', y: 16 },
  visible: {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0)',
    y: 0,
    transition: { duration: 0.9, ease: EASE.cinematic },
  },
}

export const clipRevealRight = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 0 100%)' },
  visible: {
    opacity: 1,
    clipPath: 'inset(0 0 0 0%)',
    transition: { duration: 1.1, ease: EASE.cinematic },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.cinematic },
  },
}

export const depthReveal = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE.cinematic },
  },
}

// ---- Stagger helpers ----
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
})

export const staggerChild = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.cinematic },
  },
}

// Text mask reveal (heading lines)
export const maskText = {
  hidden: { y: '110%', rotate: 2.5, opacity: 0 },
  visible: {
    y: '0%',
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: EASE.cinematic },
  },
}

export const maskLine = {
  hidden: { y: '112%' },
  visible: {
    y: '0%',
    transition: { duration: 1, ease: EASE.cinematic },
  },
}

// ---- Hero sequence (on-mount orchestration) ----
export const heroSequence = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  },
  bg: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.1, ease: 'easeOut' } },
  },
  badge: {
    hidden: { opacity: 0, y: 16, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: EASE.cinematic },
    },
  },
  heading: {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.9, ease: EASE.cinematic },
    },
  },
  subtitle: {
    hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: EASE.cinematic },
    },
  },
  desc: {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE.cinematic } },
  },
  location: {
    hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: EASE.cinematic },
    },
  },
  cta: {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: EASE.cinematic },
    },
  },
  social: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE.cinematic },
    },
  },
  visual: {
    hidden: { opacity: 0, scale: 0.82, y: 28, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.1, ease: EASE.cinematic },
    },
  },
  stat: {
    hidden: { opacity: 0, y: 20, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: EASE.cinematic },
    },
  },
}

// ---- Card / button micro-interactions ----
export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03, y: -2 },
  tap: { scale: 0.97, y: 0 },
}

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: { y: -6, scale: 1.015 },
}

export const projectCardImage = {
  rest: { scale: 1 },
  hover: {},
}

export const sectionFluidMotion = EASE.spring

// ---- Modal ----
export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
}

export const modalContent = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE.cinematic },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.97,
    transition: { duration: 0.25, ease: EASE.cinematic },
  },
}

// ---- Timeline ----
export const timelineNode = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: EASE.spring,
  },
}

// ---- Navbar ----
export const navEnter = {
  hidden: { y: -90, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.75, ease: EASE.cinematic },
  },
}

export const mobileMenu = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.45, ease: EASE.cinematic },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.35, ease: EASE.cinematic },
  },
}

// ---- Back to top ----
export const backToTop = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: EASE.gentle,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.8,
    transition: { duration: 0.3, ease: EASE.soft },
  },
}

// ---- Loading screen ----
export const loaderContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
}

export const loaderChar = {
  hidden: { opacity: 0, y: 30, rotate: 7, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE.cinematic },
  },
}

export const loaderSub = {
  hidden: { opacity: 0, y: 12, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE.cinematic },
  },
}

export const loaderScreen = {
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.6, ease: EASE.soft },
  },
}