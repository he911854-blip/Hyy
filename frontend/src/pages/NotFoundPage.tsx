import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold">页面不存在</h1>
        <Button asChild className="mt-6"><Link to="/">返回首页</Link></Button>
      </div>
    </main>
  )
}
