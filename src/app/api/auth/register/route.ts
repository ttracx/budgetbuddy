import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        categories: {
          create: [
            { name: 'Food & Dining', icon: '🍔', color: '#ef4444' },
            { name: 'Transportation', icon: '🚗', color: '#f97316' },
            { name: 'Shopping', icon: '🛒', color: '#eab308' },
            { name: 'Entertainment', icon: '🎬', color: '#22c55e' },
            { name: 'Bills & Utilities', icon: '💡', color: '#3b82f6' },
            { name: 'Healthcare', icon: '🏥', color: '#8b5cf6' },
            { name: 'Other', icon: '📦', color: '#6b7280' },
          ],
        },
      },
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
