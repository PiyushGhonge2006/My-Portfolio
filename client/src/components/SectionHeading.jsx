import { motion, useReducedMotion } from 'framer-motion'
import { maskLine, staggerContainer, VIEWPORT, EASE } from '../motion'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const reduced = useReducedMotion()

  const alignCls = align === 'left' ? 'text-left' : 'text-center'
  const ruleCls = align === 'left' ? '' : 'md:justify-center'

  return (
    <motion.div
      className={`${alignCls} mb-14`}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={reduced
        ? { hidden: {}, visible: {} }
        : staggerContainer(0.12, 0.05)}
    >
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 14 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE.cinematic } },
        }}
        className={`inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium text-sm uppercase tracking-widest mb-3 ${ruleCls}`}
      >
        <span className="h-px w-8 bg-primary-500/60 hidden sm:block" />
        {eyebrow}
        <span className="h-px w-8 bg-primary-500/60 hidden sm:block" />
      </motion.p>

      <h2 className="section-heading text-slate-900 dark:text-white">
        <span className="sh-line block overflow-hidden pb-[0.08em] -mb-[0.06em]">
          <motion.span
            className="sh-line-inner block will-change-transform"
            variants={reduced ? { hidden: { y: 0 }, visible: { y: 0 } } : maskLine}
          >
            {title}
          </motion.span>
        </span>
      </h2>

      {subtitle && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE.cinematic } },
          }}
          className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-4"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}