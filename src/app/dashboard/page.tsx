'use client'

import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, PiggyBank, Receipt, Plus } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExpenseForm } from '@/components/dashboard/expense-form'
import { ExpenseList } from '@/components/dashboard/expense-list'
import { SpendingByCategory, DailySpendingChart } from '@/components/dashboard/spending-chart'

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface Expense {
  id: string
  amount: number
  description: string
  date: string
  category: Category
}

interface Insights {
  totalSpent: number
  totalBudget: number
  prevMonthTotal: number
  categoryData: { name: string; icon: string; color: string; spent: number; budget: number }[]
  dailyData: { date: string; amount: number }[]
  budgetRemaining: number
  percentUsed: number
}

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [insights, setInsights] = useState<Insights | null>(null)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const fetchData = async () => {
    try {
      const [expensesRes, categoriesRes, insightsRes] = await Promise.all([
        fetch(`/api/expenses?month=${month}&year=${year}`),
        fetch('/api/categories'),
        fetch(`/api/insights?month=${month}&year=${year}`),
      ])

      const expensesData = await expensesRes.json()
      const categoriesData = await categoriesRes.json()
      const insightsData = await insightsRes.json()

      setExpenses(Array.isArray(expensesData) ? expensesData : [])
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
  }, [])

  const handleAddExpense = async (data: { amount: string; description: string; categoryId: string; date: string }) => {
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    fetchData()
  }

  const handleDeleteExpense = async (id: string) => {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const trend = insights?.prevMonthTotal 
    ? ((insights.totalSpent - insights.prevMonthTotal) / insights.prevMonthTotal) * 100 
    : 0

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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Track your spending and manage your budget</p>
        </div>
        <Button onClick={() => setShowAddExpense(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Spent"
          value={insights?.totalSpent || 0}
          icon={DollarSign}
          trend={trend}
          color="indigo"
        />
        <StatsCard
          title="Budget Remaining"
          value={insights?.budgetRemaining || 0}
          icon={PiggyBank}
          color={insights && insights.budgetRemaining < 0 ? 'red' : 'green'}
        />
        <StatsCard
          title="This Month's Expenses"
          value={expenses.length}
          icon={Receipt}
          isCurrency={false}
          color="amber"
        />
        <StatsCard
          title="Budget Used"
          value={insights?.percentUsed || 0}
          icon={TrendingUp}
          isCurrency={false}
          color={insights && insights.percentUsed > 80 ? 'red' : 'indigo'}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingByCategory data={insights?.categoryData || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <DailySpendingChart data={insights?.dailyData || []} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseList
            expenses={expenses.slice(0, 10)}
            onDelete={handleDeleteExpense}
          />
        </CardContent>
      </Card>

      <ExpenseForm
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        categories={categories}
        onSubmit={handleAddExpense}
      />
    </div>
  )
}
