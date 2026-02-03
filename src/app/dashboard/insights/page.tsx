'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SpendingByCategory, DailySpendingChart, BudgetVsSpending } from '@/components/dashboard/spending-chart'
import { formatCurrency, getMonthName, cn } from '@/lib/utils'

interface Insights {
  totalSpent: number
  totalBudget: number
  prevMonthTotal: number
  categoryData: { name: string; icon: string; color: string; spent: number; budget: number }[]
  dailyData: { date: string; amount: number }[]
  budgetRemaining: number
  percentUsed: number
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const fetchInsights = async () => {
    try {
      const res = await fetch(`/api/insights?month=${month}&year=${year}`)
      const data = await res.json()
      setInsights(data)
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Spending Insights</h1>
        <p className="text-gray-500">Analyze your spending patterns</p>
      </div>

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

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 mb-1">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(insights?.totalSpent || 0)}
            </p>
            <div className={cn(
              'flex items-center gap-1 mt-2 text-sm',
              trend >= 0 ? 'text-red-600' : 'text-green-600'
            )}>
              {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(trend).toFixed(1)}% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 mb-1">Budget Used</p>
            <p className="text-3xl font-bold text-gray-900">
              {(insights?.percentUsed || 0).toFixed(0)}%
            </p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div
                className={cn(
                  'h-full rounded-full',
                  (insights?.percentUsed || 0) > 100 ? 'bg-red-500' : 
                  (insights?.percentUsed || 0) > 80 ? 'bg-amber-500' : 'bg-green-500'
                )}
                style={{ width: `${Math.min(insights?.percentUsed || 0, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 mb-1">Budget Remaining</p>
            <p className={cn(
              'text-3xl font-bold',
              (insights?.budgetRemaining || 0) < 0 ? 'text-red-600' : 'text-green-600'
            )}>
              {formatCurrency(insights?.budgetRemaining || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              of {formatCurrency(insights?.totalBudget || 0)} total budget
            </p>
          </CardContent>
        </Card>
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
          <CardTitle>Budget vs Actual Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetVsSpending data={insights?.categoryData || []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Spending Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights?.categoryData
              ?.sort((a, b) => b.spent - a.spent)
              .slice(0, 5)
              .map((category, index) => (
                <div key={category.name} className="flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-400 w-6">
                    {index + 1}
                  </span>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: category.color,
                          width: `${Math.min((category.spent / (insights?.totalSpent || 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(category.spent)}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
