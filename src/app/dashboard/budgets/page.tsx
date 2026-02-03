'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { BudgetVsSpending } from '@/components/dashboard/spending-chart'
import { formatCurrency, getMonthName, cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface Budget {
  id: string
  amount: number
  categoryId: string
  category: Category
}

interface Insights {
  categoryData: { name: string; icon: string; color: string; spent: number; budget: number }[]
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [insights, setInsights] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSetBudget, setShowSetBudget] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [budgetAmount, setBudgetAmount] = useState('')

  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const fetchData = async () => {
    try {
      const [budgetsRes, categoriesRes, insightsRes] = await Promise.all([
        fetch(`/api/budgets?month=${month}&year=${year}`),
        fetch('/api/categories'),
        fetch(`/api/insights?month=${month}&year=${year}`),
      ])

      const budgetsData = await budgetsRes.json()
      const categoriesData = await categoriesRes.json()
      const insightsData = await insightsRes.json()

      setBudgets(Array.isArray(budgetsData) ? budgetsData : [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      setInsights(insightsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [month, year])

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  const handleSetBudget = async () => {
    if (!selectedCategory || !budgetAmount) return

    await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryId: selectedCategory.id,
        amount: budgetAmount,
        month,
        year,
      }),
    })

    setShowSetBudget(false)
    setBudgetAmount('')
    setSelectedCategory(null)
    fetchData()
  }

  const openSetBudget = (category: Category) => {
    const existingBudget = budgets.find((b) => b.categoryId === category.id)
    setSelectedCategory(category)
    setBudgetAmount(existingBudget?.amount.toString() || '')
    setShowSetBudget(true)
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
        <p className="text-gray-500">Set monthly budgets for each category</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold">
            {getMonthName(month)} {year}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Budget</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget vs Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetVsSpending data={insights?.categoryData || []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {categories.map((category) => {
              const budget = budgets.find((b) => b.categoryId === category.id)
              const categoryData = insights?.categoryData?.find((c) => c.name === category.name)
              const spent = categoryData?.spent || 0
              const percent = budget ? (spent / budget.amount) * 100 : 0

              return (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(spent)} / {budget ? formatCurrency(budget.amount) : 'No budget set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {budget && (
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            percent > 100 ? 'bg-red-500' : percent > 80 ? 'bg-amber-500' : 'bg-green-500'
                          )}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openSetBudget(category)}
                    >
                      {budget ? 'Edit' : 'Set Budget'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showSetBudget}
        onClose={() => setShowSetBudget(false)}
        title={`Set Budget for ${selectedCategory?.name}`}
      >
        <div className="space-y-4">
          <Input
            label="Monthly Budget"
            type="number"
            step="0.01"
            min="0"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            placeholder="0.00"
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSetBudget(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSetBudget} className="flex-1">
              Save Budget
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
