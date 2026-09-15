import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon, YoutubeIcon } from './SocialIcons'
import { usePortfolio } from '../context/PortfolioContext'
import { staggerContainer, staggerChild, VIEWPORT, EASE } from '../motion'

export default function Footer() {
  const { profile, socials } = usePortfolio()
  const currentYear = new Date().getFullYear()

  const findSocial = (platform) => socials.find((s) => s.platform === platform)?.url || ''

  const socialItems = [
    { url: findSocial('github'), icon: GithubIcon, label: 'GitHub' },
    { url: findSocial('linkedin'), icon: LinkedinIcon, label: 'LinkedIn' },
    { url: findSocial('instagram'), icon: InstagramIcon, label: 'Instagram' },
    { url: findSocial('youtube'), icon: YoutubeIcon, label: 'YouTube' },
  ].filter((s) => s.url)

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <motion.div
          variants={staggerChild}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="text-center md:text-left">
            <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="text-lg font-bold text-gradient">
              {profile.name?.split(' ')[0] || 'Piyush'}<span className="text-slate-400 dark:text-slate-500">.</span>
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Computer Science Engineering Student & Developer
            </p>
          </div>

          {socialItems.length > 0 && (
            <div className="flex items-center gap-4">
              {socialItems.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  transition={EASE.snappy}
                  className="p-2 rounded-lg text-slate-400 hover:text-primary-500 transition-colors"
                  aria-label={s.label}
                >
                  <s.icon size={18} />
                </motion.a>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          variants={staggerChild}
          className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center"
        >
          <p className="text-sm text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
            &copy; {currentYear} {profile.name || 'Piyush Ghonge'}. Built with
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={14} className="text-red-400" />
            </motion.span>
            and React
          </p>
        </motion.div>
      </motion.div>
    </footer>
  )
}