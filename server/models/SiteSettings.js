import mongoose from 'mongoose'

const siteSettingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, default: 'Piyush Ghonge' },
    tagline: { type: String, default: 'Computer Science Engineering Student & Developer' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    footerText: { type: String, default: '' },
    defaultTheme: { type: String, default: 'dark' },
  },
  { timestamps: true }
)

export default mongoose.model('SiteSettings', siteSettingsSchema)