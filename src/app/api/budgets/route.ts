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

    const budgets = await prisma.budget.findMany({
      where: {
        userId: session.user.id,
        month,
        year,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Get budgets error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, categoryId, month, year } = await req.json()

    const budget = await prisma.budget.upsert({
      where: {
        userId_categoryId_month_year: {
          userId: session.user.id,
          categoryId,
          month,
          year,
        },
      },
      update: {
        amount: parseFloat(amount),
      },
      create: {
        amount: parseFloat(amount),
        categoryId,
        month,
        year,
        userId: session.user.id,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Create budget error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
