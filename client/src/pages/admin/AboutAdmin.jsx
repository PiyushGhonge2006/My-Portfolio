import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import api from '../../services/api'

export default function AboutAdmin() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    api
      .get('/admin/about')
      .then((res) => setContent(res.data.content || ''))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/admin/about', { content })
      showToast('About saved')
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {toast && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">About</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Written in your own voice. A blank line creates a new paragraph.
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-6">
        <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          About Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          placeholder="Write about yourself..."
          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-y"
        />
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          Tip: keep it honest and focused on what you're building and learning.
        </p>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save About
          </button>
        </div>
      </div>
    </form>
  )
}