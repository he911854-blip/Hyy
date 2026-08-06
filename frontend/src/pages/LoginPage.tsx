import { ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button/Button'

export function LoginPage() {
  const navigate = useNavigate()
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col"><div className="flex items-center gap-2 text-lg font-bold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-primary"><Sparkles size={17} /></span>GeekFlow</div><div className="my-auto max-w-md"><p className="text-sm font-medium text-indigo-300">项目团队的新工作方式</p><h1 className="mt-4 text-4xl font-semibold leading-tight">让每一个项目，推进得更清晰。</h1><p className="mt-5 leading-7 text-slate-300">在一个专注的工作台中同步项目进度、任务状态与 AI 洞察。</p></div><p className="text-sm text-slate-500">© 2026 GeekFlow</p></section>
      <section className="flex items-center justify-center px-5 py-12"><div className="w-full max-w-sm"><div className="mb-10 flex items-center gap-2 text-lg font-bold text-slate-950 lg:hidden"><span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white"><Sparkles size={17} /></span>GeekFlow</div><p className="text-sm font-medium text-primary">欢迎使用 GeekFlow</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">AI 项目管理工作台</h2><p className="mt-3 text-sm leading-6 text-slate-500">登录后查看团队项目的最新进展。</p><form className="mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); navigate('/dashboard') }}><label className="block text-sm font-medium text-slate-700">邮箱<input className="mt-2 block w-full rounded-xl border bg-white px-3.5 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-primary focus:ring-3 focus:ring-indigo-100" type="email" placeholder="name@company.com" required /></label><label className="block text-sm font-medium text-slate-700">密码<input className="mt-2 block w-full rounded-xl border bg-white px-3.5 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-primary focus:ring-3 focus:ring-indigo-100" type="password" placeholder="输入密码" required /></label><Button className="mt-2 w-full" type="submit">登录并进入工作台 <ArrowRight size={16} /></Button></form><p className="mt-6 text-center text-xs text-slate-400">演示模式：输入任意有效邮箱与密码即可登录</p></div></section>
    </main>
  )
}
