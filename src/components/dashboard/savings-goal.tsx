'use client'

import { useState } from 'react'
import { Target, Plus, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string | null
}

interface SavingsGoalCardProps {
  goal: SavingsGoal
  onAddFunds: (id: string, amount: number) => void
  onDelete: (id: string) => void
}

export function SavingsGoalCard({ goal, onAddFunds, onDelete }: SavingsGoalCardProps) {
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [amount, setAmount] = useState('')

  const progress = (goal.currentAmount / goal.targetAmount) * 100
  const remaining = goal.targetAmount - goal.currentAmount

  const handleAddFunds = () => {
    if (amount && parseFloat(amount) > 0) {
      onAddFunds(goal.id, parseFloat(amount))
      setAmount('')
      setShowAddFunds(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <Target className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{goal.name}</h3>
            {goal.deadline && (
              <p className="text-sm text-gray-500">
                Target: {formatDate(goal.deadline)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-900">{progress.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              progress >= 100 ? 'bg-green-500' : 'bg-indigo-500'
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(goal.currentAmount)}
          </p>
          <p className="text-sm text-gray-500">
            of {formatCurrency(goal.targetAmount)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="font-semibold text-gray-900">
            {formatCurrency(Math.max(remaining, 0))}
          </p>
        </div>
      </div>

      {showAddFunds ? (
        <div className="flex gap-2">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="flex-1"
          />
          <Button onClick={handleAddFunds} size="sm">
            Add
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowAddFunds(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setShowAddFunds(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Funds
        </Button>
      )}
    </div>
  )
}
