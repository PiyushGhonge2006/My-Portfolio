import { useState } from 'react'
import { Upload, X, Loader2, FileText } from 'lucide-react'
import api from '../../services/api'
import { FieldLabel } from './Fields'

export default function FileUploadInput({ label, value = '', onChange, accept = 'image/*', helper }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    setError('')
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(res.data.url)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const isPdf = value.toLowerCase().endsWith('.pdf')

  return (
    <div>
      <FieldLabel required={false}>{label}</FieldLabel>

      {value ? (
        <div className="relative rounded-xl overflow-hidden group">
          {isPdf ? (
            <div className="flex items-center justify-center gap-3 h-28 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <FileText className="w-8 h-8 text-red-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">PDF attached</span>
            </div>
          ) : (
            <img
              src={value}
              alt={label}
              className="w-full h-28 object-cover"
            />
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove file"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 cursor-pointer hover:border-primary-500 transition-colors">
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-primary-500 animate-spin mb-1" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Click to upload</span>
              {helper && <span className="text-xs text-slate-400 mt-0.5 px-4 text-center">{helper}</span>}
            </>
          )}
          <input
            type="file"
            accept={accept}
            onChange={handleFile}
            className="sr-only"
          />
        </label>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}