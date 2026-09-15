import { motion } from 'framer-motion'
import { Code, Database, Layers, Wrench, Heart } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { staggerContainer, depthReveal, VIEWPORT } from '../motion'

const iconMap = {
  'Programming Languages': Code,
  'Databases': Database,
  'Frameworks & Libraries': Layers,
  'Tools & Platforms': Wrench,
  'Soft Skills': Heart,
}

const accentMap = {
  'Programming Languages': 'from-blue-500 to-indigo-500',
  'Databases': 'from-emerald-500 to-teal-500',
  'Frameworks & Libraries': 'from-violet-500 to-purple-500',
  'Tools & Platforms': 'from-orange-500 to-amber-500',
  'Soft Skills': 'from-rose-500 to-pink-500',
}

export default function Skills() {
  const { skills } = usePortfolio()

  if (!skills || skills.length === 0) return null

  return (
    <section id="skills" className="section-padding bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Skills" title="Technologies I Work With" />
        </Reveal>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {skills.map((group, i) => {
            const Icon = iconMap[group.category] || Code
            const gradient = accentMap[group.category] || 'from-primary-500 to-accent-500'
            return (
              <motion.div key={`${group.category}-${i}`} variants={depthReveal}>
                <div className="card-hover group relative h-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700/50 hover:border-primary-200 dark:hover:border-primary-900/50 hover:shadow-xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/5 transition-all duration-300 overflow-hidden">
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary-500/20`}>
                      <Icon className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-6" />
                      <span
                        className="sweep-overlay rounded-2xl"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {group.category}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill, j) => (
                      <motion.span
                        key={j}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + Math.min(j, 8) * 0.04 }}
                        className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 hover:-translate-y-0.5 transition-colors duration-200 cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}