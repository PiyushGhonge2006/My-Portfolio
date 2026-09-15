import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import TimelineDraw from './TimelineDraw'
import { timelineNode } from '../motion'

export default function Education() {
  const { education } = usePortfolio()

  return (
    <section id="education" className="section-padding bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Education" title="Academic Background" />
        </Reveal>

        {(!education || education.length === 0) ? (
          <div className="text-center p-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
            <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Education details coming soon.
            </p>
          </div>
        ) : (
          <TimelineDraw>
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 -translate-x-1/2" />
            <div
              className="tl-fill left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-400 to-accent-500 -translate-x-1/2"
              aria-hidden="true"
            />

            {education.map((edu, i) => (
              <Reveal key={`${edu.degree}-${i}`} delay={(i % 2) * 100}>
                <div
                  className={`relative flex items-start mb-12 last:mb-0 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <motion.div
                    variants={timelineNode}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ delay: i * 0.15 }}
                    className="absolute left-6 md:left-1/2 -ml-[6px] w-3 h-3 bg-primary-500 rounded-full z-10 ring-4 ring-white dark:ring-slate-900"
                    aria-hidden="true"
                  />

                  <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                    i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
                  }`}>
                    <div className="card-hover relative overflow-hidden p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                      <span
                        className="sweep-overlay rounded-2xl"
                        style={{ ['--sweep-delay']: `${3 + i}s` }}
                        aria-hidden="true"
                      />
                      <div className={`flex items-start gap-3 ${i % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''}`}>
                        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          {edu.period && (
                            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1 rounded-full">
                              {edu.period}
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                            {edu.degree}
                            {edu.field && <span className="text-primary-600 dark:text-primary-400"> — {edu.field}</span>}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">
                            {edu.institution}
                          </p>
                          {edu.grade && (
                            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-2">
                              {edu.grade}
                            </p>
                          )}
                          {edu.description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </TimelineDraw>
        )}
      </div>
    </section>
  )
}