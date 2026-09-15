import { useState } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import api from '../../services/api'
import { FieldLabel } from './Fields'

export default function GalleryUploadInput({ label, value = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const formData = new FormData()
    files.forEach((f) => formData.append('files', f))

    setUploading(true)
    setError('')
    try {
      const res = await api.post('/admin/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange([...value, ...res.data.urls])
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const remove = (url) => {
    onChange(value.filter((u) => u !== url))
  }

  return (
    <div>
      <FieldLabel required={false}>{label}</FieldLabel>

      {(value || []).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((url, i) => (
            <div key={i} className="relative group w-24 h-20 rounded-lg overflow-hidden">
              <img src={url} alt={`${label} ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove image ${i + 1}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 cursor-pointer hover:border-primary-500 transition-colors">
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 text-primary-500 animate-spin mb-1" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Uploading...</span>
          </>
        ) : (
          <>
            {value.length > 0 ? <ImageIcon className="w-5 h-5 text-slate-400 mb-1" /> : <Upload className="w-5 h-5 text-slate-400 mb-1" />}
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {value.length > 0 ? 'Add more images' : 'Upload screenshots (multiple allowed)'}
            </span>
          </>
        )}
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="sr-only" />
      </label>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}