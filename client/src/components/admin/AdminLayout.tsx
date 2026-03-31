import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, Wrench, UserCircle, LogOut, GraduationCap } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban, end: false },
  { to: '/admin/skills', label: 'Skills', icon: Wrench, end: false },
  { to: '/admin/about', label: 'About', icon: UserCircle, end: false },
  { to: '/admin/timeline', label: 'Education & Work', icon: GraduationCap, end: false },
]

export default function AdminLayout() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Admin panel uses default cursor
    document.body.classList.add('admin-body')
    document.body.style.cursor = 'auto'
    return () => {
      document.body.classList.remove('admin-body')
      document.body.style.cursor = ''
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-primary flex admin-body" style={{ cursor: 'auto' }}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-white/5 flex flex-col" style={{ background: '#111111' }}>
        <div className="p-6 border-b border-white/5">
          <h2 className="font-heading font-bold text-white text-lg">
            <span className="gradient-text">S</span> Admin
          </h2>
          <p className="text-white/30 text-xs font-body mt-1">@{username}</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all ${
                  isActive
                    ? 'text-white bg-white/8'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-white/40 hover:text-white hover:bg-white/5 w-full transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
