import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loaderContainer, loaderChar, loaderSub, loaderScreen, EASE } from '../motion'

export default function LoadingScreen({ done }) {
  const [unmount, setUnmount] = useState(false)

  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setUnmount(true), 650)
    return () => clearTimeout(t)
  }, [done])

  const name = 'PIYUSH GHONGE'
  const letters = name.split('')

  return (
    <AnimatePresence>
      {!unmount && (
        <motion.div
          key="loader"
          className="loader-screen"
          aria-hidden="true"
          variants={loaderScreen}
          initial="visible"
          exit="exit"
          animate={done ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.55, ease: EASE.soft }}
        >
          <div className="loader-grid" />
          <motion.div
            className="loader-orb"
            style={{ top: '-12%', left: '-10%', width: 420, height: 420, background: 'rgba(59,130,246,0.18)' }}
            animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="loader-orb"
            style={{ bottom: '-16%', right: '-8%', width: 460, height: 460, background: 'rgba(139,92,246,0.16)' }}
            animate={{ scale: [1.1, 1, 1.1], y: [0, -16, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="loader-badge"
            variants={loaderContainer}
            initial="hidden"
            animate="visible"
          >
            <p className="text-3xl sm:text-4xl font-bold tracking-[0.28em] text-white">
              {letters.map((ch, i) =>
                ch === ' ' ? (
                  <span key={i} className="inline-block w-3" />
                ) : (
                  <motion.span key={i} className="inline-block" variants={loaderChar}>
                    {ch}
                  </motion.span>
                )
              )}
            </p>
            <motion.p
              variants={loaderSub}
              className="loader-sub mt-4 text-sm uppercase tracking-[0.5em] text-slate-400"
            >
              Developer Portfolio
            </motion.p>
          </motion.div>

          <div className="loader-progress-track">
            <motion.div
              className="loader-progress"
              initial={{ width: '0%' }}
              animate={{ width: done ? '100%' : '88%' }}
              transition={{ duration: 1.15, ease: EASE.cinematic }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}