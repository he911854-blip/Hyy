import { Bot, CheckSquare, FolderKanban, LayoutDashboard, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/ai', label: 'AI Assistant', icon: Bot },
]

export function NavigationLinks({ compact = false }: { compact?: boolean }) {
  return navigation.map(({ to, label, icon: Icon }) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) => cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
        isActive ? 'bg-indigo-50 text-primary' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
        compact && 'whitespace-nowrap',
      )}
    >
      <Icon size={18} strokeWidth={2} />
      {label}
    </NavLink>
  ))
}

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 lg:flex">
      <NavLink to="/dashboard" className="flex items-center gap-2 px-2 text-lg font-bold tracking-tight text-slate-950">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white"><Sparkles size={17} /></span>
        GeekFlow
      </NavLink>
      <nav className="mt-10 space-y-1"><NavigationLinks /></nav>
      <div className="mt-auto rounded-xl bg-slate-950 p-4 text-white">
        <p className="text-sm font-semibold">GeekFlow AI</p>
        <p className="mt-1 text-xs leading-5 text-slate-300">让项目协作更清晰、更高效。</p>
      </div>
    </aside>
  )
}
