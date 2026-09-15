import { motion } from 'framer-motion'
import { Award, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { staggerContainer, clipReveal, VIEWPORT, EASE } from '../motion'

export default function Certificates() {
  const { certificates } = usePortfolio()

  return (
    <section id="certificates" className="section-padding bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Certificates" title="Certifications & Courses" />
        </Reveal>

        {(!certificates || certificates.length === 0) ? (
          <div className="text-center p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700/50">
            <Award className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Certificates will be displayed here soon.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {certificates.map((cert, i) => (
              <motion.div key={`${cert.title}-${i}`} variants={clipReveal} className="h-full">
                <div className="card-hover group relative h-full overflow-hidden p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700/50 hover:border-primary-200 dark:hover:border-primary-900/50 hover:shadow-xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/5 transition-all duration-300">
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className="relative h-36 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20 flex items-center justify-center mb-4 overflow-hidden">
                    {cert.image ? (
                      <motion.img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        transition={{ duration: 0.6, ease: EASE.soft }}
                      />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 transition-transform duration-300 group-hover:scale-110" />
                    )}
                    {cert.image && (
                      <span
                        className="sweep-overlay rounded-xl"
                        style={{ ['--sweep-delay']: `${4 + i}s` }}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {cert.title}
                  </h3>

                  {cert.issuer && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                      {cert.issuer}
                    </p>
                  )}

                  {cert.date && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                      {cert.date}
                    </p>
                  )}

                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline group/link"
                    >
                      <ExternalLink size={14} className="transition-transform duration-200 group-hover/link:translate-x-0.5" />
                      View Certificate
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}