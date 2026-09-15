import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    tagline: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    photo: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Profile', profileSchema)