import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        stripeSubscriptionId: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
      },
    })

    const isSubscribed =
      user?.stripeSubscriptionId &&
      user?.stripeCurrentPeriodEnd &&
      user.stripeCurrentPeriodEnd.getTime() > Date.now()

    return NextResponse.json({
      isSubscribed,
      subscriptionEnd: user?.stripeCurrentPeriodEnd,
    })
  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
