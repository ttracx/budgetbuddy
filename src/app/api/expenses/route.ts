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
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    let dateFilter = {}
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
      dateFilter = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      }
    }

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.user.id,
        ...dateFilter,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Get expenses error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, description, categoryId, date } = await req.json()

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        description,
        categoryId,
        userId: session.user.id,
        date: date ? new Date(date) : new Date(),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Create expense error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
