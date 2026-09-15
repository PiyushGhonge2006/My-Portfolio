import mongoose from 'mongoose'

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, default: '' },
    field: { type: String, default: '' },
    institution: { type: String, default: '' },
    period: { type: String, default: '' },
    grade: { type: String, default: '' },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Education', educationSchema)