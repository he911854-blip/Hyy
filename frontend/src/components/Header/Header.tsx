import { Bell, ChevronDown, Search } from 'lucide-react'
import { NavigationLinks } from '../Sidebar/Sidebar'

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <p className="truncate text-sm font-medium text-slate-600">产品工作台</p>
          <span className="hidden h-5 w-px bg-slate-200 sm:block" />
          <span className="hidden text-sm text-slate-400 sm:inline">2026 年 8 月</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-400 md:flex" type="button">
            <Search size={16} /> 搜索
          </button>
          <button aria-label="通知" className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" type="button"><Bell size={18} /></button>
          <button className="flex items-center gap-2 rounded-lg p-1 text-sm font-medium text-slate-700 hover:bg-slate-100" type="button">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-primary">GF</span>
            <span className="hidden sm:inline">GeekFlow</span><ChevronDown size={15} />
          </button>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:hidden"><NavigationLinks compact /></nav>
    </header>
  )
}
