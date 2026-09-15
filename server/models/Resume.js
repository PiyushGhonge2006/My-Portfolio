import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'My Resume' },
    file: { type: String, default: '' },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Resume', resumeSchema)