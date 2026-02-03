import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bills = await prisma.billReminder.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        dueDay: 'asc',
      },
    })

    return NextResponse.json(bills)
  } catch (error) {
    console.error('Get bills error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, amount, dueDay, isRecurring } = await req.json()

    const bill = await prisma.billReminder.create({
      data: {
        name,
        amount: parseFloat(amount),
        dueDay: parseInt(dueDay),
        isRecurring: isRecurring ?? true,
        userId: session.user.id,
      },
    })

    return NextResponse.json(bill)
  } catch (error) {
    console.error('Create bill error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
