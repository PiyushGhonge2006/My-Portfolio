import express from 'express'
import Profile from '../models/Profile.js'
import About from '../models/About.js'
import Education from '../models/Education.js'
import Skill from '../models/Skill.js'
import Experience from '../models/Experience.js'
import Project from '../models/Project.js'
import Certificate from '../models/Certificate.js'
import Achievement from '../models/Achievement.js'
import SocialLink from '../models/SocialLink.js'
import Resume from '../models/Resume.js'
import SiteSettings from '../models/SiteSettings.js'
import { getFirstDoc } from '../controllers/resourceController.js'
import { submitContact } from '../controllers/contactController.js'

const router = express.Router()

router.get('/profile', getFirstDoc(Profile))
router.get('/about', getFirstDoc(About))
router.get('/education', async (req, res) => {
  const items = await Education.find({}).sort({ order: 1 })
  res.json(items)
})
router.get('/skills', async (req, res) => {
  const skills = await Skill.find({}).sort({ order: 1, category: 1 })
  const grouped = []
  for (const s of skills) {
    const cat = grouped.find((c) => c.category === s.category)
    if (cat) cat.items.push(s.name)
    else grouped.push({ category: s.category, items: [s.name] })
  }
  res.json(grouped)
})
router.get('/experience', async (req, res) => {
  const items = await Experience.find({}).sort({ order: 1 })
  res.json(items)
})
router.get('/projects', async (req, res) => {
  const items = await Project.find({}).sort({ sortOrder: 1, createdAt: -1 })
  res.json(items)
})
router.get('/certificates', async (req, res) => {
  const items = await Certificate.find({}).sort({ createdAt: -1 })
  res.json(items)
})
router.get('/achievements', async (req, res) => {
  const items = await Achievement.find({}).sort({ createdAt: -1 })
  res.json(items)
})
router.get('/socials', async (req, res) => {
  const links = await SocialLink.find({}).sort({ order: 1 })
  res.json(links.filter((l) => l.url && l.url.trim() !== ''))
})
router.get('/resume', async (req, res) => {
  const resume = await Resume.findOne({ active: true }).sort({ updatedAt: -1 })
  res.json(resume || {})
})
router.get('/settings', getFirstDoc(SiteSettings))

router.post('/contact', submitContact)

export default router