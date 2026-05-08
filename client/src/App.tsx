import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

import HomePage from '@/pages/HomePage'
import CustomCursor from '@/components/ui/CustomCursor'

// Lazy load admin — not bundled with public portfolio
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'))
const AdminProjectsPage = lazy(() => import('@/pages/AdminProjectsPage'))
const AdminSkillsPage = lazy(() => import('@/pages/AdminSkillsPage'))
const AdminAboutPage = lazy(() => import('@/pages/AdminAboutPage'))
const AdminTimelinePage = lazy(() => import('@/pages/AdminTimelinePage'))
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'))
const ProtectedRoute = lazy(() => import('@/components/admin/ProtectedRoute'))

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
          <Route path="/admin/login" element={<Suspense fallback={null}><AdminLoginPage /></Suspense>} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={null}>
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              </Suspense>
            }
          >
            <Route index element={<Suspense fallback={null}><AdminDashboardPage /></Suspense>} />
            <Route path="projects" element={<Suspense fallback={null}><AdminProjectsPage /></Suspense>} />
            <Route path="skills" element={<Suspense fallback={null}><AdminSkillsPage /></Suspense>} />
            <Route path="about" element={<Suspense fallback={null}><AdminAboutPage /></Suspense>} />
            <Route path="timeline" element={<Suspense fallback={null}><AdminTimelinePage /></Suspense>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}
