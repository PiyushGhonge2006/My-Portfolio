import { motion } from 'framer-motion'
import { Trophy, ExternalLink } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { staggerContainer, blurReveal, VIEWPORT } from '../motion'

export default function Achievements() {
  const { achievements } = usePortfolio()

  return (
    <section id="achievements" className="section-padding bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Achievements" title="Milestones & Recognition" />
        </Reveal>

        {(!achievements || achievements.length === 0) ? (
          <div className="text-center p-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
            <Trophy className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Achievements will be displayed here soon.
            </p>
          </div>
        ) : (
          <motion.div
            className="space-y-6"
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {achievements.map((ach, i) => (
              <motion.div key={`${ach.title}-${i}`} variants={blurReveal}>
                <div
                  className="card-hover group relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50"
                >
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-yellow-400 via-primary-500 to-accent-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500 pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center flex-shrink-0"
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                    >
                      <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {ach.title}
                          </h3>
                          {ach.organization && (
                            <p className="text-primary-600 dark:text-primary-400 font-medium text-sm mt-1">
                              {ach.organization}
                            </p>
                          )}
                        </div>
                        {ach.rank && (
                          <motion.span
                            className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 flex-shrink-0 shadow-sm"
                            whileHover={{ scale: 1.08, y: -2 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                          >
                            {ach.rank}
                          </motion.span>
                        )}
                      </div>
                      {ach.description && (
                        <p className="text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                          {ach.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        {ach.date && (
                          <span className="text-sm text-slate-400 dark:text-slate-500">
                            {ach.date}
                          </span>
                        )}
                        {ach.link && (
                          <a
                            href={ach.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline group/link"
                          >
                            <ExternalLink size={14} className="transition-transform duration-200 group-hover/link:translate-x-0.5" />
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}