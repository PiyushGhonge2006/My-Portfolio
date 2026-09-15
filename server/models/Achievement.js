import mongoose from 'mongoose'

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    organization: { type: String, default: '' },
    date: { type: String, default: '' },
    rank: { type: String, default: '' },
    image: { type: String, default: '' },
    link: { type: String, default: '' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Achievement', achievementSchema)