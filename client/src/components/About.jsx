import { motion } from 'framer-motion'
import { GraduationCap, Code, Lightbulb, BookOpen } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { staggerContainer, staggerChild, VIEWPORT } from '../motion'

export default function About() {
  const { about } = usePortfolio()

  const highlights = [
    { icon: GraduationCap, label: 'CSE Undergraduate', desc: '3rd Year CSE Student', iconBg: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' },
    { icon: Code, label: 'Full-Stack Developer', desc: 'MERN Stack Enthusiast', iconBg: 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400' },
    { icon: Lightbulb, label: 'Problem Solver', desc: 'Practical Solutions', iconBg: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' },
    { icon: BookOpen, label: 'Continuous Learner', desc: 'Always Growing', iconBg: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  ]

  return (
    <section id="about" className="section-padding bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="About Me" title="Get to Know Me" />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <Reveal variant="blur">
            <div className="relative">
              <motion.div
                className="absolute -top-6 -left-6 w-24 h-24 bg-primary-500/10 rounded-3xl blur-2xl"
                animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              />
              <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-subtle border border-slate-100 dark:border-slate-700/50">
                {about ? (
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                    {about}
                  </p>
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 text-lg">
                    About content coming soon.
                  </p>
                )}
              </div>
            </div>
          </Reveal>

          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {highlights.map((item, i) => (
              <motion.div key={i} variants={staggerChild}>
                <div className="card-hover group relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 overflow-hidden">
                  <span
                    className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.04] to-accent-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 ${item.iconBg}`}>
                    <item.icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="relative font-semibold text-slate-900 dark:text-white text-sm">
                    {item.label}
                  </h3>
                  <p className="relative text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}