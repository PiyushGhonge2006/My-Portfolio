import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon, YoutubeIcon } from './SocialIcons'
import { usePortfolio } from '../context/PortfolioContext'
import api from '../services/api'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { staggerContainer, staggerChild, VIEWPORT, EASE } from '../motion'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const { profile, socials } = usePortfolio()
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', website: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('') // '', 'sending', 'sent', 'error', 'limited'

  const findSocial = (platform) => socials.find((s) => s.platform === platform)?.url || ''

  const socialItems = [
    { url: findSocial('github'), icon: GithubIcon, label: 'GitHub' },
    { url: findSocial('linkedin'), icon: LinkedinIcon, label: 'LinkedIn' },
    { url: findSocial('instagram'), icon: InstagramIcon, label: 'Instagram' },
    { url: findSocial('youtube'), icon: YoutubeIcon, label: 'YouTube' },
  ].filter((s) => s.url)

  const resetStatus = () => setTimeout(() => setStatus(''), 6000)

  const validate = () => {
    const e = {}
    const name = formData.name.trim()
    const email = formData.email.trim()
    const message = formData.message.trim()
    if (!name) e.name = 'Please enter your name.'
    else if (name.length > 100) e.name = 'Your name must be 100 characters or fewer.'
    if (!email) e.email = 'Please enter your email address.'
    else if (!EMAIL_PATTERN.test(email)) e.email = 'Please enter a valid email address.'
    if (!message) e.message = 'Please enter your message.'
    else if (message.length < 10) e.message = 'Your message must be at least 10 characters.'
    else if (message.length > 5000) e.message = 'Your message must be 5000 characters or fewer.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending' || status === 'sent') return
    if (!validate()) return
    setStatus('sending')
    setErrors({})
    try {
      await api.post('/public/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        website: formData.website,
      })
      setStatus('sent')
      setFormData({ name: '', email: '', subject: '', message: '', website: '' })
      resetStatus()
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) setErrors(data.errors)
      setStatus(err.response?.status === 429 ? 'limited' : 'error')
      resetStatus()
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${
      errors[field] ? 'border-red-400 dark:border-red-400' : 'border-slate-200 dark:border-slate-700'
    }`

  const statusMessage =
    status === 'sent'
      ? "Message sent successfully! I'll get back to you soon."
      : status === 'limited'
      ? 'Too many messages. Please wait a few minutes and try again.'
      : status === 'error'
      ? 'Unable to send your message. Please try again or contact me directly by email.'
      : ''

  return (
    <section id="contact" className="section-padding bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Get In Touch"
            subtitle="Have a question, opportunity, or want to collaborate? Feel free to reach out."
          />
        </Reveal>

        <motion.div
          className="grid lg:grid-cols-5 gap-8"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div variants={staggerChild} className="lg:col-span-2">
            <div className="relative h-full overflow-hidden p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700/50">
              <span
                className="sweep-overlay rounded-2xl"
                style={{ ['--sweep-delay']: '6s' }}
                aria-hidden="true"
              />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Contact Information</h3>

              <div className="space-y-4">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                      <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Email</p>
                      <p className="text-sm">{profile.email}</p>
                    </div>
                  </a>
                )}

                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="group flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                      <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Phone</p>
                      <p className="text-sm">{profile.phone}</p>
                    </div>
                  </a>
                )}

                {profile.location && (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Location</p>
                      <p className="text-sm">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {socialItems.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Connect</p>
                  <div className="flex gap-3">
                    {socialItems.map((s) => (
                      <motion.a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -3, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={EASE.snappy}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        aria-label={s.label}
                      >
                        <s.icon size={18} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={staggerChild} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700/50 h-full"
            >
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass('name')}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.22 }}
                >
                  <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
required
                  maxLength={300}
                  value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass('email')}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </motion.div>
              </div>

              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Subject <span className="text-slate-400 dark:text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  maxLength={200}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={inputClass('subject')}
                  placeholder="What's this about?"
                />
              </motion.div>

              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.38 }}
              >
                <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  maxLength={5000}
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${inputClass('message')} resize-none`}
                  placeholder="Your message..."
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.46 }}
              >
                <motion.button
                  type="submit"
                  disabled={status === 'sending' || status === 'sent'}
                  whileHover={status === 'sending' || status === 'sent' ? {} : { y: -2 }}
                  whileTap={status === 'sending' || status === 'sent' ? {} : { scale: 0.98 }}
                  transition={EASE.snappy}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-60 ${
                    status === 'sent'
                      ? 'bg-green-600 hover:bg-green-700'
                      : status === 'error' || status === 'limited'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/25'
                  }`}
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending...
                    </>
                  ) : status === 'sent' ? (
                    <>
                      <CheckCircle2 size={16} /> Message Sent!
                    </>
                  ) : status === 'error' || status === 'limited' ? (
                    <>
                      <AlertCircle size={16} /> Could not send. Try again.
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </motion.button>
                {statusMessage && (
                  <p
                    className={`mt-3 text-sm text-center ${
                      status === 'sent'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                    role={status === 'error' || status === 'limited' ? 'alert' : 'status'}
                  >
                    {statusMessage}
                  </p>
                )}
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}