import type { ReactNode } from 'react'
import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string
  detail: string
  icon: ReactNode
  accentClassName: string
}

export function StatCard({ label, value, detail, icon, accentClassName }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${accentClassName}`}>{icon}</span>
      </div>
    </Card>
  )
}
