'use client'

import { Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Expense {
  id: string
  amount: number
  description: string
  date: string
  category: {
    id: string
    name: string
    icon: string
    color: string
  }
}

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No expenses yet. Add your first expense to get started!</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: expense.category.color + '20' }}
            >
              {expense.category.icon}
            </div>
            <div>
              <p className="font-medium text-gray-900">{expense.description}</p>
              <p className="text-sm text-gray-500">
                {expense.category.name} • {formatDate(expense.date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-900">
              {formatCurrency(expense.amount)}
            </span>
            <button
              onClick={() => onDelete(expense.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
