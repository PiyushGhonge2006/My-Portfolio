import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban, Award, Trophy, Code2, Briefcase, Loader2, Mail, ArrowRight, ArrowUp, PlusCircle, FileText, Settings,
} from 'lucide-react'
import api from '../../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, msgRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/contact-messages'),
        ])
        setStats(dashRes.data)
        setMessages(msgRes.data.slice(0, 5))
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  const cards = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, slug: 'projects', gradient: 'from-blue-500 to-indigo-500' },
    { label: 'Certificates', value: stats.certificates, icon: Award, slug: 'certificates', gradient: 'from-violet-500 to-purple-500' },
    { label: 'Achievements', value: stats.achievements, icon: Trophy, slug: 'achievements', gradient: 'from-amber-400 to-orange-500' },
    { label: 'Skills', value: stats.skills, icon: Code2, slug: 'skills', gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Experience', value: stats.experiences, icon: Briefcase, slug: 'experience', gradient: 'from-cyan-500 to-sky-500' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: Mail, slug: 'contact-messages', gradient: 'from-rose-500 to-red-500' },
  ]

  const quickActions = [
    { label: 'Add Project', slug: 'projects', icon: PlusCircle },
    { label: 'Upload Resume', slug: 'resume', icon: FileText },
    { label: 'Site Settings', slug: 'settings', icon: Settings },
  ]

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real counts from your MongoDB database
          </p>
        </div>
        <Link
          to="/admin/projects"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
        >
          <PlusCircle size={16} /> New Project
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {cards.map((card, i) => (
          <Link
            key={i}
            to={`/admin/${card.slug}`}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-md`}>
                <card.icon size={18} />
              </div>
              <ArrowUp size={14} className="text-slate-300 dark:text-slate-600 rotate-45 transition-transform group-hover:rotate-0 group-hover:text-primary-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((a) => (
              <Link
                key={a.slug}
                to={`/admin/${a.slug}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <a.icon size={16} /> {a.label}
                <ArrowRight size={14} className="ml-auto" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent messages */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Messages</h3>
            <span className="text-sm text-slate-400 dark:text-slate-500">From contact form</span>
          </div>
          {messages.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 py-6 text-center">
              No messages yet. They'll appear here when someone uses the contact form.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {messages.map((msg) => (
                <div key={msg._id} className="py-3 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-bold flex-shrink-0">
                    {msg.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{msg.name}</p>
                      {!msg.read && <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">new</span>}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{msg.message}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
          {messages.length > 0 && (
            <Link
              to="/admin/contact-messages"
              className="inline-flex items-center gap-1 mt-3 ml-auto text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              View all <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}