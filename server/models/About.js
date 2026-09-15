import mongoose from 'mongoose'

const aboutSchema = new mongoose.Schema(
  {
    content: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('About', aboutSchema)