import { motion } from 'framer-motion'
import { Briefcase, MapPin, Calendar, Wifi } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { staggerContainer, clipRevealRight, VIEWPORT } from '../motion'

export default function Experience() {
  const { experience } = usePortfolio()

  if (!experience || experience.length === 0) {
    return (
      <section id="experience" className="section-padding bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <SectionHeading eyebrow="Experience" title="Professional Experience" />
          <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700/50">
            <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Experience details coming soon. Stay tuned!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="section-padding bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Experience" title="Professional Experience" />
        </Reveal>

        <motion.div
          className="space-y-6"
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {experience.map((exp, i) => (
            <motion.div key={`${exp.position}-${i}`} variants={clipRevealRight}>
              <div className="card-hover group relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700/50">
                <span
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 pointer-events-none"
                  aria-hidden="true"
                />
                <span
                  className="sweep-overlay rounded-2xl"
                  style={{ ['--sweep-delay']: `${5 + i * 3}s` }}
                  aria-hidden="true"
                />
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                    <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {exp.position}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-medium">
                      {exp.organization}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Wifi size={14} /> {exp.mode}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                      {exp.description}
                    </p>
                    {exp.technologies && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.technologies.map((tech, j) => (
                          <span
                            key={j}
                            className="px-2.5 py-1 text-xs rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}