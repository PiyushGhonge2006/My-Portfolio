import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema(
  {
    organization: { type: String, default: '' },
    position: { type: String, default: '' },
    mode: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    description: { type: String, default: '' },
    technologies: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Experience', experienceSchema)