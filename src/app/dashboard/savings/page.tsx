'use client'

import { useEffect, useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { SavingsGoalCard } from '@/components/dashboard/savings-goal'
import { formatCurrency } from '@/lib/utils'

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string | null
}

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/savings')
      const data = await res.json()
      setGoals(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/savings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        targetAmount,
        deadline: deadline || null,
      }),
    })
    setName('')
    setTargetAmount('')
    setDeadline('')
    setShowAddGoal(false)
    fetchGoals()
  }

  const handleAddFunds = async (id: string, amount: number) => {
    const goal = goals.find((g) => g.id === id)
    if (!goal) return

    await fetch(`/api/savings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentAmount: goal.currentAmount + amount,
      }),
    })
    fetchGoals()
  }

  const handleDeleteGoal = async (id: string) => {
    await fetch(`/api/savings/${id}`, { method: 'DELETE' })
    fetchGoals()
  }

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-gray-500">Track your progress towards financial goals</p>
        </div>
        <Button onClick={() => setShowAddGoal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 mb-1">Total Saved</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalSaved)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 mb-1">Total Target</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalTarget)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 mb-1">Overall Progress</p>
            <p className="text-3xl font-bold text-indigo-600">
              {overallProgress.toFixed(0)}%
            </p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No savings goals yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first savings goal to start tracking your progress!
              </p>
              <Button onClick={() => setShowAddGoal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              onAddFunds={handleAddFunds}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showAddGoal}
        onClose={() => setShowAddGoal(false)}
        title="Create Savings Goal"
      >
        <form onSubmit={handleAddGoal} className="space-y-4">
          <Input
            label="Goal Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Emergency Fund, Vacation"
            required
          />
          <Input
            label="Target Amount"
            type="number"
            step="0.01"
            min="0"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="0.00"
            required
          />
          <Input
            label="Target Date (optional)"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddGoal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Goal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
