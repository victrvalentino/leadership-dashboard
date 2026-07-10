'use client'
import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { supabase } from '@/lib/supabase'
import {
  Home,
  BarChart3,
  LogIn,
  Users,
  TrendingUp,
  RefreshCw,
  LogOut,
  DollarSign,
  ClipboardList,
  Pencil,
  LogOut as LogOutIcon,
  type LucideIcon
} from 'lucide-react'

export type Page =
  | 'home'
  | 'executive'
  | 'entry'
  | 'experience'
  | 'development'
  | 'turnover'
  | 'exit'
  | 'cost'
  | 'leadership'

interface NavItem {
  id: Page
  label: string
  icon: LucideIcon
  color: string
  group?: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, color: '#374151' },
  { id: 'executive', label: 'Executive Snapshot', icon: BarChart3, color: '#1565C0', group: 'overview' },
  { id: 'entry', label: 'Entry', icon: LogIn, color: '#2E7D32', group: 'lifecycle' },
  { id: 'experience', label: 'Experience', icon: Users, color: '#1565C0', group: 'lifecycle' },
  { id: 'development', label: 'Development', icon: TrendingUp, color: '#6A1B9A', group: 'lifecycle' },
  { id: 'turnover', label: 'Turnover', icon: RefreshCw, color: '#E65100', group: 'lifecycle' },
  { id: 'exit', label: 'Exit', icon: LogOut, color: '#C62828', group: 'lifecycle' },
  { id: 'cost', label: 'Cost', icon: DollarSign, color: '#00695C', group: 'lifecycle' },
  { id: 'leadership', label: 'Leadership Action', icon: ClipboardList, color: '#E65100', group: 'action' },
]

interface SidebarProps {
  current: Page
  onNavigate: (page: Page) => void
  isOpen: boolean
  onClose: () => void
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp('(^| )' + name + '=([^;]+)')
  )
  return match ? decodeURIComponent(match[2]) : null
}

export default function Sidebar({ current, onNavigate, isOpen, onClose }: SidebarProps) {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    setRole(getCookie('user-role'))
  }, [])

  const canEdit = role === 'admin' || role === 'superadmin'

  const go = (page: Page) => {
    onNavigate(page)
    onClose()
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore sign-out errors; cookies are cleared below
    }

    for (const name of ['sb-auth-token', 'user-role', 'user-name']) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }

    window.location.href = '/admin/login'
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-xl z-40 flex flex-col transition-transform duration-200',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:shadow-none lg:z-auto'
        )}
      >
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100" style={{ background: '#0D1B4B' }}>
          <p className="text-white font-black text-xs uppercase tracking-widest">People Experience</p>
          <p className="text-blue-200 text-[10px] tracking-widest">Leadership Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          {/* Overview */}
          <p className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Overview</p>
          {NAV_ITEMS.filter((n) => !n.group || n.group === 'overview').map((item) => (
            <NavBtn key={item.id} item={item} active={current === item.id} onClick={() => go(item.id)} />
          ))}

          <p className="px-4 py-1.5 mt-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Lifecycle Intelligence</p>
          {NAV_ITEMS.filter((n) => n.group === 'lifecycle').map((item) => (
            <NavBtn key={item.id} item={item} active={current === item.id} onClick={() => go(item.id)} />
          ))}

          <p className="px-4 py-1.5 mt-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Leadership Action</p>
          {NAV_ITEMS.filter((n) => n.group === 'action').map((item) => (
            <NavBtn key={item.id} item={item} active={current === item.id} onClick={() => go(item.id)} />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100">
          <div className="px-3 py-3 space-y-2">
            {canEdit && (
              <a
                href="/admin/dashboard"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
                style={{ backgroundColor: '#0D1B4B' }}
              >
                <Pencil style={{ width: 16, height: 16 }} strokeWidth={2} />
                Edit Dashboard
              </a>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOutIcon style={{ width: 16, height: 16 }} strokeWidth={2} />
              Logout
            </button>
          </div>

          <div className="px-5 pb-3 text-[10px] text-gray-400">
            © 2026 People Experience Directorate
          </div>
        </div>
      </aside>
    </>
  )
}

function NavBtn({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors rounded-lg mx-2 my-0.5',
        active
          ? 'text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
      style={active ? { backgroundColor: item.color, width: 'calc(100% - 16px)' } : {}}
    >
      <item.icon
        className="w-4.5 h-4.5 flex-shrink-0"
        style={{ width: 18, height: 18, color: active ? '#FFFFFF' : item.color }}
        strokeWidth={2}
      />
      <span className="truncate">{item.label}</span>
    </button>
  )
}
