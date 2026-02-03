import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1))
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    // Get expenses for the month grouped by category
    const expensesByCategory = await prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    })

    // Get category details
    const categories = await prisma.category.findMany({
      where: {
        userId: session.user.id,
      },
    })

    // Get budgets for comparison
    const budgets = await prisma.budget.findMany({
      where: {
        userId: session.user.id,
        month,
        year,
      },
    })

    // Calculate totals
    const totalSpent = expensesByCategory.reduce(
      (sum, item) => sum + (item._sum.amount || 0),
      0
    )

    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)

    // Get daily spending for trend
    const dailyExpenses = await prisma.expense.groupBy({
      by: ['date'],
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Previous month comparison
    const prevStartDate = new Date(year, month - 2, 1)
    const prevEndDate = new Date(year, month - 1, 0, 23, 59, 59)

    const prevMonthTotal = await prisma.expense.aggregate({
      where: {
        userId: session.user.id,
        date: {
          gte: prevStartDate,
          lte: prevEndDate,
        },
      },
      _sum: {
        amount: true,
      },
    })

    // Format data
    const categoryData = expensesByCategory.map((item) => {
      const category = categories.find((c) => c.id === item.categoryId)
      const budget = budgets.find((b) => b.categoryId === item.categoryId)
      return {
        name: category?.name || 'Unknown',
        icon: category?.icon || '📁',
        color: category?.color || '#6b7280',
        spent: item._sum.amount || 0,
        budget: budget?.amount || 0,
      }
    })

    const dailyData = dailyExpenses.map((item) => ({
      date: item.date.toISOString().split('T')[0],
      amount: item._sum.amount || 0,
    }))

    return NextResponse.json({
      totalSpent,
      totalBudget,
      prevMonthTotal: prevMonthTotal._sum.amount || 0,
      categoryData,
      dailyData,
      budgetRemaining: totalBudget - totalSpent,
      percentUsed: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
    })
  } catch (error) {
    console.error('Get insights error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
