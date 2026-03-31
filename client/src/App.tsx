import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

import HomePage from '@/pages/HomePage'
import AdminLoginPage from '@/pages/AdminLoginPage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import AdminProjectsPage from '@/pages/AdminProjectsPage'
import AdminSkillsPage from '@/pages/AdminSkillsPage'
import AdminAboutPage from '@/pages/AdminAboutPage'
import AdminTimelinePage from '@/pages/AdminTimelinePage'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import CustomCursor from '@/components/ui/CustomCursor'

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
          },
          success: { iconTheme: { primary: '#FF4D00', secondary: '#fff' } },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="skills" element={<AdminSkillsPage />} />
            <Route path="about" element={<AdminAboutPage />} />
            <Route path="timeline" element={<AdminTimelinePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}
