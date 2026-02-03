import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const goals = await prisma.savingsGoal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Get savings error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, targetAmount, deadline } = await req.json()

    const goal = await prisma.savingsGoal.create({
      data: {
        name,
        targetAmount: parseFloat(targetAmount),
        deadline: deadline ? new Date(deadline) : null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Create savings goal error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
