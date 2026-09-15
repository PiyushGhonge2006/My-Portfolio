import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Star, ArrowRight, X, FolderKanban } from 'lucide-react'
import { GithubIcon } from './SocialIcons'
import { usePortfolio } from '../context/PortfolioContext'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { staggerContainer, clipReveal, modalBackdrop, modalContent, VIEWPORT, EASE } from '../motion'

export default function Projects() {
  const { projects } = usePortfolio()
  const [selectedProject, setSelectedProject] = useState(null)
  const [filter, setFilter] = useState('all')

  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)
  const allProjects =
    filter === 'featured' ? featuredProjects : filter === 'other' ? otherProjects : projects

  return (
    <section id="projects" className="section-padding bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Projects"
            title="Featured Work"
            subtitle="Real projects built while learning and exploring software development"
          />
        </Reveal>

        {projects.length === 0 ? (
          <div className="text-center p-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
            <FolderKanban className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Projects will be displayed here soon.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-center gap-2 mb-10">
              {['all', 'featured', 'other'].map((f) => (
                <motion.button
                  key={f}
                  onClick={() => setFilter(f)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={EASE.snappy}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f === 'all' ? 'All Projects' : f === 'featured' ? 'Featured' : 'Other'}
                </motion.button>
              ))}
            </div>

            {filter === 'all' && featuredProjects.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Featured Projects
                </h3>
                <motion.div
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerContainer(0.1)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                >
                  {featuredProjects.map((project, i) => (
                    <motion.div key={`f-${project._id || i}`} variants={clipReveal}>
                      <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {filter === 'all' && otherProjects.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                  Other Projects
                </h3>
                <motion.div
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerContainer(0.1)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                >
                  {otherProjects.map((project, i) => (
                    <motion.div key={`o-${project._id || i}`} variants={clipReveal}>
                      <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {filter !== 'all' && (
              <motion.div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer(0.1, 0.05)}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                key={filter}
              >
                {allProjects.map((project, i) => (
                  <motion.div key={`${filter}-${project._id || i}`} variants={clipReveal}>
                    <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <AnimatePresence>
              {selectedProject && (
                <ProjectModal
                  project={selectedProject}
                  onClose={() => setSelectedProject(null)}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative cursor-pointer rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 overflow-hidden"
    >
      <span className="block h-0.5 w-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.06] via-transparent to-accent-500/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative h-48 bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20 flex items-center justify-center overflow-hidden">
        {project.image ? (
          <motion.img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
            loading="lazy"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.6, ease: EASE.soft }}
          />
        ) : (
            <div className="text-4xl font-bold text-primary-300 dark:text-primary-600 opacity-50">
              {project.name?.charAt(0)}
            </div>
          )}
          {project.featured && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-400 text-yellow-950 shadow">
              <Star size={11} /> Featured
            </span>
          )}
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-black/60 text-white backdrop-blur opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            View Details <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {project.name}
          </h3>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
          {project.shortDescription}
        </p>

        {project.status && (
          <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full mb-3 ${
            project.status === 'Completed'
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : project.status === 'Ongoing' || project.status === 'In Progress'
              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}>
            {project.status}
          </span>
        )}

        <div className="flex flex-wrap gap-1.5">
          {(project.technologies || []).slice(0, 4).map((tech, i) => (
            <motion.span
              key={i}
              whileHover={{ y: -3, scale: 1.08, color: '#3b82f6' }}
              transition={EASE.snappy}
              className="px-2 py-0.5 text-xs rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
            >
              {tech}
            </motion.span>
          ))}
          {project.technologies?.length > 4 && (
            <span className="px-2 py-0.5 text-xs rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ProjectModal({ project, onClose }) {
  const techList = project.technologies || []
  const featureList = project.features || []
  const screenshotList = project.screenshots || []

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      variants={modalBackdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="h-56 bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20 flex items-center justify-center relative">
          {project.image ? (
            <motion.img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-cover"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: EASE.cinematic }}
            />
          ) : (
            <div className="text-6xl font-bold text-primary-300 dark:text-primary-600 opacity-30">
              {project.name?.charAt(0)}
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {project.name}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {project.status && (
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                project.status === 'Completed'
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : project.status === 'Ongoing' || project.status === 'In Progress'
                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                {project.status}
              </span>
            )}
            {project.startDate && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                {project.startDate}{project.endDate ? ` - ${project.endDate}` : ''}
              </span>
            )}
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {project.detailedDescription || project.shortDescription}
          </p>

          {screenshotList.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Screenshots</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {screenshotList.map((url, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE.cinematic }}
                    className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700/50"
                  >
                    <img src={url} alt={`${project.name} screenshot ${i + 1}`} className="w-full h-28 object-cover" loading="lazy" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {featureList.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {featureList.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: EASE.cinematic }}
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <ArrowRight size={14} className="text-primary-500 flex-shrink-0" />
                    {feature}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {techList.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {techList.map((tech, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.05, ease: EASE.cinematic }}
                    className="px-3 py-1.5 text-sm rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={EASE.snappy}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                <GithubIcon size={16} /> GitHub
              </motion.a>
            )}
            {project.liveDemo && (
              <motion.a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={EASE.snappy}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                <ExternalLink size={16} /> Live Demo
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}