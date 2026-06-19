'use client'
import { clsx } from 'clsx'

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
  icon: string
  color: string
  group?: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: '🏠', color: '#374151' },
  { id: 'executive', label: 'Executive Snapshot', icon: '📋', color: '#1565C0', group: 'overview' },
  { id: 'entry', label: 'Entry', icon: '🚪', color: '#2E7D32', group: 'lifecycle' },
  { id: 'experience', label: 'Experience', icon: '👥', color: '#1565C0', group: 'lifecycle' },
  { id: 'development', label: 'Development', icon: '📈', color: '#6A1B9A', group: 'lifecycle' },
  { id: 'turnover', label: 'Turnover', icon: '🔄', color: '#E65100', group: 'lifecycle' },
  { id: 'exit', label: 'Exit', icon: '📤', color: '#C62828', group: 'lifecycle' },
  { id: 'cost', label: 'Cost', icon: '💰', color: '#00695C', group: 'lifecycle' },
  { id: 'leadership', label: 'Leadership Action', icon: '🎯', color: '#E65100', group: 'action' },
]

interface SidebarProps {
  current: Page
  onNavigate: (page: Page) => void
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ current, onNavigate, isOpen, onClose }: SidebarProps) {
  const go = (page: Page) => {
    onNavigate(page)
    onClose()
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
        <div className="px-5 py-3 border-t border-gray-100 text-[10px] text-gray-400">
          © 2024 People Experience Directorate
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
      <span className="text-base flex-shrink-0">{item.icon}</span>
      <span className="truncate">{item.label}</span>
    </button>
  )
}
