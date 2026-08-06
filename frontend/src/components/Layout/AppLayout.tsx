import { Outlet } from 'react-router-dom'
import { Header } from '../Header/Header'
import { Sidebar } from '../Sidebar/Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="mx-auto w-full max-w-7xl p-5 sm:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
