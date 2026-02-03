import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.expense.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete expense error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { amount, description, categoryId, date } = await req.json()

    const expense = await prisma.expense.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        amount: parseFloat(amount),
        description,
        categoryId,
        date: date ? new Date(date) : undefined,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Update expense error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
