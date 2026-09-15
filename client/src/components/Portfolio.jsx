import { useEffect, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { PortfolioProvider } from '../context/PortfolioContext'
import LoadingScreen from './LoadingScreen'
import ScrollProgress from './ScrollProgress'
import CustomCursor from './CustomCursor'
import Navbar from './Navbar'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Education from './Education'
import Experience from './Experience'
import Projects from './Projects'
import Certificates from './Certificates'
import Achievements from './Achievements'
import Contact from './Contact'
import Footer from './Footer'
import { backToTop, EASE } from '../motion'

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setVisible(window.scrollY > 600)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backToTop}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          transition={EASE.snappy}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/25"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <PortfolioProvider>
      <MotionConfig reducedMotion="user">
        <LoadingScreen done={loaded} />
        <ScrollProgress />
        <CustomCursor />
        <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
          <Navbar />
          <main>
            <Hero start={loaded} />
            <About />
            <Skills />
            <Education />
            <Experience />
            <Projects />
            <Certificates />
            <Achievements />
            <Contact />
          </main>
          <Footer />
          <BackToTop />
        </div>
      </MotionConfig>
    </PortfolioProvider>
  )
}