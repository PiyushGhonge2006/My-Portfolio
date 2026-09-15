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
import ContactMessage from '../models/ContactMessage.js'
import {
  getMany,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  getFirstDoc,
  upsertFirstDoc,
} from '../controllers/resourceController.js'
import { protect } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

router.use(protect)

router.get('/dashboard', async (req, res) => {
  const [projects, certificates, achievements, skills, experiences, messages] =
    await Promise.all([
      Project.countDocuments(),
      Certificate.countDocuments(),
      Achievement.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      ContactMessage.countDocuments({ read: false }),
    ])
  res.json({ projects, certificates, achievements, skills, experiences, unreadMessages: messages })
})

router.get('/contact-messages', getMany(ContactMessage, { createdAt: -1 }))
router.put('/contact-messages/:id/read', async (req, res) => {
  const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
  res.json(msg || { message: 'Not found' })
})
router.delete('/contact-messages/:id', deleteOne(ContactMessage))

router.route('/profile').get(getFirstDoc(Profile)).put(upsertFirstDoc(Profile))
router.route('/about').get(getFirstDoc(About)).put(upsertFirstDoc(About))
router.route('/settings').get(getFirstDoc(SiteSettings)).put(upsertFirstDoc(SiteSettings))

router.route('/education').get(getMany(Education, { order: 1 })).post(createOne(Education))
router.route('/education/:id').put(updateOne(Education)).delete(deleteOne(Education))

router.route('/skills').get(getMany(Skill, { order: 1 })).post(createOne(Skill))
router.route('/skills/:id').put(updateOne(Skill)).delete(deleteOne(Skill))

router.route('/experience').get(getMany(Experience, { order: 1 })).post(createOne(Experience))
router.route('/experience/:id').put(updateOne(Experience)).delete(deleteOne(Experience))

router.route('/projects').get(getMany(Project, { sortOrder: 1 })).post(createOne(Project))
router.route('/projects/:id').get(getOne(Project)).put(updateOne(Project)).delete(deleteOne(Project))

router.route('/certificates').get(getMany(Certificate, { createdAt: -1 })).post(createOne(Certificate))
router.route('/certificates/:id').put(updateOne(Certificate)).delete(deleteOne(Certificate))

router.route('/achievements').get(getMany(Achievement, { createdAt: -1 })).post(createOne(Achievement))
router.route('/achievements/:id').put(updateOne(Achievement)).delete(deleteOne(Achievement))

router.route('/socials').get(getMany(SocialLink, { order: 1 })).post(createOne(SocialLink))
router.route('/socials/:id').put(updateOne(SocialLink)).delete(deleteOne(SocialLink))

router.route('/resumes').get(getMany(Resume, { createdAt: -1 })).post(createOne(Resume))
router.route('/resumes/:id').put(updateOne(Resume)).delete(deleteOne(Resume))
router.post('/resumes/:id/activate', async (req, res) => {
  await Resume.updateMany({}, { active: false })
  const resume = await Resume.findByIdAndUpdate(req.params.id, { active: true }, { new: true })
  res.json(resume || { message: 'Resume not found' })
})

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  res.json({ url: `/uploads/${req.file.filename}` })
})

router.post('/upload/multiple', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' })
  }
  const urls = req.files.map((f) => `/uploads/${f.filename}`)
  res.json({ urls })
})

export default router