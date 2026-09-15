import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const PortfolioContext = createContext()

export function PortfolioProvider({ children }) {
  const [data, setData] = useState({
    profile: {},
    about: '',
    education: [],
    skills: [],
    experience: [],
    projects: [],
    certificates: [],
    achievements: [],
    socials: [],
    resume: null,
    settings: {},
  })
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  const refresh = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    let cancelled = false
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [
          profile, about, education, skills, experience,
          projects, certificates, achievements, socials, resume, settings,
        ] = await Promise.all([
          api.get('/public/profile'),
          api.get('/public/about'),
          api.get('/public/education'),
          api.get('/public/skills'),
          api.get('/public/experience'),
          api.get('/public/projects'),
          api.get('/public/certificates'),
          api.get('/public/achievements'),
          api.get('/public/socials'),
          api.get('/public/resume'),
          api.get('/public/settings'),
        ])
        if (!cancelled) {
          setData({
            profile: profile.data || {},
            about: about.data?.content || '',
            education: education.data || [],
            skills: skills.data || [],
            experience: experience.data || [],
            projects: projects.data || [],
            certificates: certificates.data || [],
            achievements: achievements.data || [],
            socials: socials.data || [],
            resume: resume.data?.file ? { file: resume.data.file, title: resume.data.title } : null,
            settings: settings.data || {},
          })
        }
      } catch (err) {
        console.error('Failed to load portfolio data:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAll()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  return (
    <PortfolioContext.Provider value={{ ...data, loading, refresh }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => useContext(PortfolioContext)