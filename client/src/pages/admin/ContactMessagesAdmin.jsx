import { useEffect, useState } from 'react'
import { Loader2, Mail, Trash2, Check, ExternalLink } from 'lucide-react'
import api from '../../services/api'

export default function ContactMessagesAdmin() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const fetchMessages = async () => {
    const res = await api.get('/admin/contact-messages')
    setMessages(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages().catch(() => {
      showToast('Failed to load messages')
      setLoading(false)
    })
  }, [])

  const markRead = async (id) => {
    await api.put(`/admin/contact-messages/${id}/read`)
    await fetchMessages()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await api.delete(`/admin/contact-messages/${id}`)
      await fetchMessages()
      showToast('Message deleted')
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed')
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
    <div className="max-w-3xl">
      {toast && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Messages</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{messages.length} total</p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
          <Mail className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">
            No messages yet. They appear here when visitors submit the contact form.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`rounded-xl border p-4 transition-colors ${
                msg.read
                  ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 opacity-75'
                  : 'bg-white dark:bg-slate-800 border-primary-200 dark:border-primary-900/30 ring-1 ring-primary-100 dark:ring-primary-900/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    msg.read ? 'bg-slate-100 dark:bg-slate-700 text-slate-400' : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  }`}>
                    {msg.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      {msg.name}
                      {!msg.read && <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">new</span>}
                      <span className="text-slate-400 font-normal text-sm truncate">· {msg.email}</span>
                    </p>
                    {msg.subject && (
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">{msg.subject}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3 whitespace-pre-line">
                {msg.message}
              </p>
              <div className="flex items-center gap-1">
                {!msg.read && (
                  <button
                    onClick={() => markRead(msg._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Check size={13} /> Mark read
                  </button>
                )}
                <a
                  href={`mailto:${msg.email}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-medium hover:bg-primary-700 transition-colors"
                >
                  <ExternalLink size={13} /> Reply
                </a>
                <button
                  onClick={() => remove(msg._id)}
                  className="ml-auto p-2 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}