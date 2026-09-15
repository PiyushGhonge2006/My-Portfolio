import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useInView, animate, useReducedMotion } from 'framer-motion'
import { ArrowDown, FolderOpen, FileText, MapPin, Sparkles, User } from 'lucide-react'
import CinematicGrid from './CinematicGrid'
import Magnetic from './Magnetic'
import { GithubIcon, LinkedinIcon, InstagramIcon, YoutubeIcon } from './SocialIcons'
import { usePortfolio } from '../context/PortfolioContext'
import { heroSequence, staggerContainer, EASE } from '../motion'

const mailtoHref = (email) => `mailto:${email}?subject=Interested in hiring you`

const withDelay = (v, delay) => ({
  hidden: v.hidden,
  visible: {
    ...v.visible,
    transition: { ...v.visible.transition, delay },
  },
})

const V = heroSequence
const stage = (key, extra = 0) => withDelay(V[key], (STAGE[key] || 0) + extra)

const arrowIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE.cinematic },
  },
}
const arrowStage = () => withDelay(arrowIn, 1.55)

const STAGE = {
  grid: 0.1,
  light: 0.2,
  badge: 0.3,
  heading: 0.4,
  subtitle: 0.7,
  desc: 0.85,
  location: 0.9,
  cta: 1.0,
  social: 1.15,
  visual: 1.3,
  stat: 1.35,
  arrow: 1.55,
}

const maskWord = {
  hidden: { y: '112%', rotate: 2.5 },
  visible: {
    y: '0%',
    rotate: 0,
    transition: { duration: 1, ease: EASE.cinematic },
  },
}

function AnimatedCounter({ value, className }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const [count, setCount] = useState(reduced ? value : 0)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!inView || reduced) return
    const controls = animate(0, value, {
      duration: 1.4,
      ease: EASE.cinematic,
      onUpdate: (v) => setCount(Math.min(value, Math.round(v))),
    })
    return () => controls.stop()
  }, [inView, value, reduced])

  return (
    <p ref={ref} className={className}>
      {count}
    </p>
  )
}

export default function Hero({ start = false }) {
  const { profile, socials, projects, certificates, achievements, skills } = usePortfolio()
  const heroRef = useRef(null)
  const [typed, setTyped] = useState('')
  const reduced = useReducedMotion()
  const fine = window.matchMedia('(pointer: fine)').matches
  const small = window.matchMedia('(max-width: 1023px)').matches

  const rotateX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18, mass: 0.4 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18, mass: 0.4 })

  useEffect(() => {
    const roles = [profile.title, ...(profile.subtitle ? [profile.subtitle] : [])].filter(Boolean)
    if (roles.length === 0) return
    let roleIndex = 0
    let charIndex = 0
    let deleting = false
    let timer
    const tick = () => {
      const current = roles[roleIndex]
      if (!deleting) {
        charIndex++
        setTyped(current.slice(0, charIndex))
        if (charIndex === current.length) {
          deleting = true
          timer = setTimeout(tick, 1800)
          return
        }
        timer = setTimeout(tick, 55)
      } else {
        charIndex--
        setTyped(current.slice(0, charIndex))
        if (charIndex === 0) {
          deleting = false
          roleIndex = (roleIndex + 1) % roles.length
          timer = setTimeout(tick, 400)
          return
        }
        timer = setTimeout(tick, 28)
      }
    }
    timer = setTimeout(tick, 1600)
    return () => clearTimeout(timer)
  }, [profile.title, profile.subtitle])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero || reduced || !fine || small) return

    const onMove = (e) => {
      const cx = e.clientX / window.innerWidth - 0.5
      const cy = e.clientY / window.innerHeight - 0.5
      rotateY.set(cx * 6)
      rotateX.set(-cy * 6)
    }
    const onLeave = () => {
      rotateX.set(0)
      rotateY.set(0)
    }
    hero.addEventListener('mousemove', onMove, { passive: true })
    hero.addEventListener('mouseleave', onLeave, { passive: true })
    return () => {
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseleave', onLeave)
    }
  }, [rotateX, rotateY, reduced, fine, small])

  const findSocial = (platform) => socials.find((s) => s.platform === platform)?.url || ''

  const socialButtons = [
    { url: findSocial('github'), icon: GithubIcon, label: 'GitHub' },
    { url: findSocial('linkedin'), icon: LinkedinIcon, label: 'LinkedIn' },
    { url: findSocial('instagram'), icon: InstagramIcon, label: 'Instagram' },
    { url: findSocial('youtube'), icon: YoutubeIcon, label: 'YouTube' },
  ].filter((s) => s.url)

  const stats = [
    { label: 'Projects', value: projects.length },
    { label: 'Certificates', value: certificates.length },
    { label: 'Skills', value: skills.reduce((n, g) => n + (g.items?.length || 0), 0) },
    { label: 'Achievements', value: achievements.length },
  ]

  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  const nameParts = profile.name ? profile.name.split(' ') : []

  return (
    <section id="home" ref={heroRef} className="hero-section">
      <CinematicGrid show={start} />

      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6"
        initial="hidden"
        animate={start ? 'visible' : 'hidden'}
      >
        <div className="grid lg:grid-cols-[1fr_auto] lg:gap-10 items-center">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.div
              variants={stage('badge')}
              className="inline-flex items-center justify-center mb-6 lg:justify-start"
            >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur text-sm text-slate-600 dark:text-slate-300">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-green-500" />
            </span>
            Open to Opportunities
          </span>
        </motion.div>

        <motion.h1
          variants={stage('heading')}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 leading-[1.08]"
        >
          {nameParts.length > 0 ? (
            <span aria-label={`Hi, I'm ${profile.name}`}>
              <motion.span
                className="block overflow-hidden pb-[0.08em] -mb-[0.08em]"
                variants={maskWord}
              >
                <span className="block will-change-transform" aria-hidden="true">Hi, I'm</span>
              </motion.span>
              <span className="inline-block">
                {nameParts.map((part) => (
                  <motion.span
                    key={`${part}-w`}
                    className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em]"
                    variants={maskWord}
                  >
                    <span className="block text-gradient will-change-transform" aria-hidden="true">
                      {part}&nbsp;
                    </span>
                  </motion.span>
                ))}
              </span>
            </span>
          ) : (
            'Hi, I\'m Piyush'
          )}
        </motion.h1>

        <motion.p
          variants={stage('subtitle')}
          className="text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-medium mb-3"
        >
          {typed}
          <span className="typing-caret animate-typing-caret" />
        </motion.p>

        {profile.tagline && (
          <motion.p
            variants={stage('desc')}
            className="max-w-2xl text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-5"
          >
            {profile.tagline}
          </motion.p>
        )}

        {profile.location && (
          <motion.p
            variants={stage('location')}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"
          >
            <MapPin size={14} className="text-primary-500" />
            {profile.location}
          </motion.p>
        )}

        <motion.div
          variants={stage('cta')}
          className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8 mb-12"
        >
          <Magnetic strength={7} radius={150}>
            <button
              onClick={() => scrollTo('#projects')}
              className="magnetic micro-btn inline-flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
            >
              <FolderOpen size={18} /> View Projects <span className="shine" />
            </button>
          </Magnetic>
          <Magnetic strength={7} radius={150}>
            <a
              href={profile.email ? mailtoHref(profile.email) : '#contact'}
              onClick={!profile.email ? (e) => { e.preventDefault(); scrollTo('#contact') } : undefined}
              className="magnetic micro-btn inline-flex items-center gap-2 px-8 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-primary-500 dark:hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium rounded-xl"
            >
              <FileText size={18} /> Hire Me <span className="shine" />
            </a>
          </Magnetic>
        </motion.div>

        {socialButtons.length > 0 && (
          <motion.div variants={stage('social')} className="flex items-center justify-center lg:justify-start gap-3 mb-12 lg:mb-14">
            {socialButtons.map((s) => (
              <Magnetic key={s.label} strength={5} radius={110}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative micro-btn p-3 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-white hover:bg-primary-600 dark:hover:bg-primary-600 hover:border-transparent shadow-sm"
                  aria-label={s.label}
                >
                  <s.icon size={20} />
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 text-[11px] font-medium rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 hidden sm:block whitespace-nowrap shadow-lg">
                    {s.label}
                  </span>
                </a>
              </Magnetic>
            ))}
          </motion.div>
        )}

          </div>

          <motion.div
            variants={stage('visual')}
            className="order-1 lg:order-2 mb-8 lg:mb-0 flex justify-center lg:justify-end"
          >
            <motion.div
              style={{ rotateX, rotateY, transformPerspective: 800 }}
              className="hero-visual relative inline-block"
            >
              <div className="absolute -inset-5 rounded-full bg-gradient-to-br from-primary-500/25 via-transparent to-accent-500/25 blur-2xl animate-float-slow" />
              <span className="sweep-overlay rounded-full" />
              <span className="hero-ring" />
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-1.5 shadow-xl shadow-primary-500/20 animate-float-slow">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt={profile.name || 'Profile'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                    <User className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-4 border-white dark:border-slate-900 z-10" />
              <span className="absolute -top-1 -right-4 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 animate-float-slow z-10">
                <Sparkles className="w-4 h-4 text-primary-500" />
              </span>
            </motion.div>
          </motion.div>
        </div>

        <div className="text-center">
          <motion.div
            variants={staggerContainer(0.06, STAGE.stat)}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={heroSequence.stat}
                className="px-4 py-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-100 dark:border-slate-700/50"
              >
                <AnimatedCounter value={s.value} className="text-2xl sm:text-3xl font-bold text-gradient" />
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            variants={arrowStage()}
            onClick={() => scrollTo('#about')}
            className="inline-flex text-slate-400 dark:text-slate-500 hover:text-primary-500 transition-colors animate-bounce"
            aria-label="Scroll down"
          >
            <ArrowDown size={26} />
          </motion.button>
        </div>
      </motion.div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 7rem 0 3rem;
          isolation: isolate;
          background: linear-gradient(180deg, rgba(59,130,246,0.04), transparent 40%);
        }
        .hero-visual { will-change: transform; }
        .hero-ring {
          position: absolute;
          inset: -12px;
          border-radius: 9999px;
          padding: 1px;
          background: conic-gradient(from var(--ring-angle, 0deg),
            var(--color-primary-500), var(--color-accent-500),
            var(--color-primary-300), var(--color-accent-500),
            var(--color-primary-500));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.5;
          pointer-events: none;
          animation: ringSpin 14s linear infinite;
        }
        @property --ring-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes ringSpin {
          to { --ring-angle: 360deg; }
        }
      `}</style>
    </section>
  )
}