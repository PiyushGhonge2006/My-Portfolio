import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import Admin from '../models/Admin.js'
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
import { seedData } from '../seed/seedData.js'

dotenv.config()

const checkEnv = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD']
  const missing = required.filter((key) => !process.env[key])
  if (missing.length > 0) {
    console.error(
      `Missing environment variables: ${missing.join(', ')}\n` +
      `Add them to server/.env (copy the format from server/.env.example).`
    )
    process.exit(1)
  }
}

const clearCollections = async () => {
  await Promise.all([
    Education.deleteMany({}),
    Skill.deleteMany({}),
    Experience.deleteMany({}),
    Project.deleteMany({}),
    Certificate.deleteMany({}),
    Achievement.deleteMany({}),
    SocialLink.deleteMany({}),
  ])
}

const seed = async () => {
  checkEnv()
  await connectDB()

  console.log('Creating admin account...')
  const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL })
  if (existing) {
    console.log('Admin already exists. Skipping admin creation.')
  } else {
    await Admin.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    })
    console.log('Admin created.')
  }

  console.log('Clearing content collections...')
  await clearCollections()

  console.log('Seeding profile...')
  const profile = await Profile.findOne()
  if (profile) Object.assign(profile, seedData.profile)
  else await Profile.create(seedData.profile)
  if (profile) await profile.save()

  console.log('Seeding about...')
  const about = await About.findOne()
  if (about) Object.assign(about, seedData.about)
  else await About.create(seedData.about)
  if (about) await about.save()

  console.log('Seeding settings...')
  const settings = await SiteSettings.findOne()
  if (settings) Object.assign(settings, seedData.settings)
  else await SiteSettings.create(seedData.settings)
  if (settings) await settings.save()

  console.log('Seeding education...')
  await Education.insertMany(seedData.education)

  console.log('Seeding skills...')
  await Skill.insertMany(seedData.skills)

  console.log('Seeding experience...')
  await Experience.insertMany(seedData.experience)

  console.log('Seeding projects...')
  await Project.insertMany(seedData.projects)

  console.log('Seeding certificates...')
  await Certificate.insertMany(seedData.certificates)

  console.log('Seeding achievements...')
  await Achievement.insertMany(seedData.achievements)

  console.log('Seeding social links...')
  await SocialLink.insertMany(seedData.socials)

  console.log('Setting up resume placeholder...')
  const resume = await Resume.findOne()
  if (!resume) await Resume.create({ title: 'My Resume', file: '', active: false })

  console.log('Seed complete!')
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(async (err) => {
  console.error('Seed failed:', err.message)
  await mongoose.disconnect()
  process.exit(1)
})