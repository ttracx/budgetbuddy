import { LucideIcon } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  trend?: number
  isCurrency?: boolean
  color?: 'indigo' | 'green' | 'red' | 'amber'
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  isCurrency = true,
  color = 'indigo',
}: StatsCardProps) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {isCurrency ? formatCurrency(value) : value}
          </p>
          {trend !== undefined && (
            <p
              className={cn(
                'mt-1 text-sm',
                trend >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% vs last month
            </p>
          )}
        </div>
        <div className={cn('rounded-lg p-3', colors[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
