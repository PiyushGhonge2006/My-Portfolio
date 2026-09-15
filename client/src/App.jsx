import { Routes, Route, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Portfolio from './components/Portfolio'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ProfileAdmin from './pages/admin/ProfileAdmin'
import AboutAdmin from './pages/admin/AboutAdmin'
import ResumeAdmin from './pages/admin/ResumeAdmin'
import SettingsAdmin from './pages/admin/SettingsAdmin'
import ResourceSection from './pages/admin/ResourceSection'
import ContactMessagesAdmin from './pages/admin/ContactMessagesAdmin'

function AdminGate() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin" replace />
  }

  return <AdminLayout />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Portfolio />} />

          <Route path="/admin" element={<AdminLogin />} />

          <Route element={<AdminGate />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/profile" element={<ProfileAdmin />} />
            <Route path="/admin/about" element={<AboutAdmin />} />
            <Route path="/admin/education" element={<ResourceSection section="education" />} />
            <Route path="/admin/skills" element={<ResourceSection section="skills" />} />
            <Route path="/admin/experience" element={<ResourceSection section="experience" />} />
            <Route path="/admin/projects" element={<ResourceSection section="projects" />} />
            <Route path="/admin/certificates" element={<ResourceSection section="certificates" />} />
            <Route path="/admin/achievements" element={<ResourceSection section="achievements" />} />
            <Route path="/admin/socials" element={<ResourceSection section="socials" />} />
            <Route path="/admin/resume" element={<ResumeAdmin />} />
            <Route path="/admin/settings" element={<SettingsAdmin />} />
            <Route path="/admin/contact-messages" element={<ContactMessagesAdmin />} />
          </Route>

          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}