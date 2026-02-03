'use client'

import { Check, Trash2, Bell } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Bill {
  id: string
  name: string
  amount: number
  dueDay: number
  isRecurring: boolean
  isPaid: boolean
}

interface BillCardProps {
  bill: Bill
  onTogglePaid: (id: string, isPaid: boolean) => void
  onDelete: (id: string) => void
}

export function BillCard({ bill, onTogglePaid, onDelete }: BillCardProps) {
  const today = new Date().getDate()
  const isUpcoming = bill.dueDay >= today && bill.dueDay <= today + 5
  const isOverdue = bill.dueDay < today && !bill.isPaid

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-lg border',
        bill.isPaid
          ? 'bg-green-50 border-green-200'
          : isOverdue
          ? 'bg-red-50 border-red-200'
          : isUpcoming
          ? 'bg-amber-50 border-amber-200'
          : 'bg-white border-gray-200'
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => onTogglePaid(bill.id, !bill.isPaid)}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors',
            bill.isPaid
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-indigo-500'
          )}
        >
          {bill.isPaid && <Check className="h-4 w-4" />}
        </button>
        <div>
          <p className={cn('font-medium', bill.isPaid && 'line-through text-gray-500')}>
            {bill.name}
          </p>
          <p className="text-sm text-gray-500">
            Due: {bill.dueDay}{ordinalSuffix(bill.dueDay)} of each month
            {bill.isRecurring && ' (Recurring)'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isUpcoming && !bill.isPaid && (
          <Bell className="h-5 w-5 text-amber-500 animate-pulse" />
        )}
        <span className="font-semibold">{formatCurrency(bill.amount)}</span>
        <button
          onClick={() => onDelete(bill.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function ordinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
