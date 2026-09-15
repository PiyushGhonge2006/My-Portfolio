import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    detailedDescription: { type: String, default: '' },
    category: { type: String, default: '' },
    technologies: { type: [String], default: [] },
    features: { type: [String], default: [] },
    status: { type: String, default: 'Ongoing' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    github: { type: String, default: '' },
    liveDemo: { type: String, default: '' },
    image: { type: String, default: '' },
    screenshots: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)