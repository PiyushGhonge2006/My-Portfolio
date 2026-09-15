import { useState } from 'react'
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, Info, GraduationCap, Code2, Briefcase, FolderKanban,
  Award, Trophy, Share2, FileText, Settings, LogOut, Menu, ExternalLink, Sun, Moon, Mail, ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { slug: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      { slug: 'profile', label: 'Profile', icon: User },
      { slug: 'about', label: 'About', icon: Info },
      { slug: 'education', label: 'Education', icon: GraduationCap },
      { slug: 'skills', label: 'Skills', icon: Code2 },
      { slug: 'experience', label: 'Experience', icon: Briefcase },
      { slug: 'projects', label: 'Projects', icon: FolderKanban },
      { slug: 'certificates', label: 'Certificates', icon: Award },
      { slug: 'achievements', label: 'Achievements', icon: Trophy },
      { slug: 'socials', label: 'Social Links', icon: Share2 },
    ],
  },
  {
    label: 'Files & System',
    items: [
      { slug: 'resume', label: 'Resume', icon: FileText },
      { slug: 'contact-messages', label: 'Messages', icon: Mail },
      { slug: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

export default function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  const current = location.pathname.split('/').filter(Boolean)[1] || 'dashboard'
  const initials = (user.name || 'A').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  const nav = (
    <nav className="flex-1 px-3 py-4 overflow-y-auto">
      {navGroups.map((group) => (
        <div key={group.label} className="mb-5 last:mb-0">
          <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = current === item.slug
              return (
                <li key={item.slug}>
                  <a
                    href={`/admin/${item.slug}`}
                    onClick={(e) => { e.preventDefault(); navigate(`/admin/${item.slug}`); setSidebarOpen(false) }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon size={17} />
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )

  const brand = (
    <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-100 dark:border-slate-700/50">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white">
        <ShieldCheck size={16} />
      </div>
      <span className="font-bold text-slate-900 dark:text-white">Admin Panel</span>
    </div>
  )

  const userChip = (
    <div className="p-4 border-t border-slate-100 dark:border-slate-700/50">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
          <p className="text-xs text-slate-400 truncate">{user.email}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700/50 z-40">
        {brand}
        {nav}
        {userChip}
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 flex flex-col bg-white dark:bg-slate-800">
            {brand}
            {nav}
            {userChip}
          </aside>
        </div>
      )}

      <div className="md:pl-64">
        <header className="h-16 fixed top-0 right-0 left-0 md:left-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-700/50 z-30">
          <div className="h-full flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 capitalize">
                {current === 'contact-messages' ? 'Messages' : current.replace('-', ' ')}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ExternalLink size={14} /> View Site
              </a>
            </div>
          </div>
        </header>

        <main className="pt-16 px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}