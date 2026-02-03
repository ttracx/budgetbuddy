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

    await prisma.savingsGoal.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete savings goal error:', error)
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
    const { currentAmount, name, targetAmount, deadline } = await req.json()

    const goal = await prisma.savingsGoal.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        ...(currentAmount !== undefined && { currentAmount: parseFloat(currentAmount) }),
        ...(name && { name }),
        ...(targetAmount && { targetAmount: parseFloat(targetAmount) }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Update savings goal error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
