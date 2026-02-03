'use client'

import { useEffect, useState } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ExpenseForm } from '@/components/dashboard/expense-form'
import { ExpenseList } from '@/components/dashboard/expense-list'
import { formatCurrency, getMonthName } from '@/lib/utils'

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

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const fetchExpenses = async () => {
    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        fetch(`/api/expenses?month=${month}&year=${year}`),
        fetch('/api/categories'),
      ])

      const expensesData = await expensesRes.json()
      const categoriesData = await categoriesRes.json()

      setExpenses(Array.isArray(expensesData) ? expensesData : [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
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

  const handleAddExpense = async (data: { amount: string; description: string; categoryId: string; date: string }) => {
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    fetchExpenses()
  }

  const handleDeleteExpense = async (id: string) => {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
    fetchExpenses()
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)

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
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500">Track and manage your spending</p>
        </div>
        <Button onClick={() => setShowAddExpense(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
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
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
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
