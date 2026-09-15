import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Lock, Mail, LogIn, Loader2, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 relative overflow-hidden">
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-accent-500/10 dark:bg-accent-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl">
        <a
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft size={16} /> Back to website
        </a>

        <div className="grid md:grid-cols-5 rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
          {/* Brand side */}
          <div className="hidden md:flex md:col-span-2 flex-col justify-between p-8 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">Portfolio Admin</span>
              </div>
              <p className="text-3xl font-bold leading-tight mb-3">
                Manage your portfolio from one place
              </p>
              <p className="text-white/80 text-sm leading-relaxed">
                Projects, skills, certificates, resume, messages — everything you need to keep your site fresh and professional.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Real MongoDB-backed CRUD</li>
              <li>• Secure JWT authentication</li>
              <li>• Image & PDF uploads</li>
            </ul>
          </div>

          {/* Form side */}
          <div className="md:col-span-3 p-6 sm:p-10">
            <div className="md:hidden flex items-center justify-center w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 text-white">
              <Lock className="w-6 h-6" />
            </div>
            <p className="hidden md:block text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">
              Welcome back
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Login</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-8">
              Sign in to manage your portfolio content
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-11 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25 disabled:opacity-50"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                Sign In
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
              Your credentials are stored securely (hashed) and never exposed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}