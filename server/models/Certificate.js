import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, default: '' },
    date: { type: String, default: '' },
    credentialId: { type: String, default: '' },
    image: { type: String, default: '' },
    pdf: { type: String, default: '' },
    url: { type: String, default: '' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Certificate', certificateSchema)