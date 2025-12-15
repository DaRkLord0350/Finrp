export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

const MOCK_CUSTOMERS = [
  { name: 'Amit Patel', email: 'amit@example.com', address: '123 Tech Park, Bangalore' },
  { name: 'Sunita Reddy', email: 'sunita@example.com', address: '456 IT Hub, Hyderabad' },
  { name: 'Vikram Singh', email: 'vikram@example.com', address: '789 Business Bay, Mumbai' },
  { name: 'Priya Sharma', email: 'priya@example.com', address: '101 Cyber City, Gurgaon' },
]

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    let customers = await db.customer.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    })

    if (customers.length === 0) {
      await db.customer.createMany({
        data: MOCK_CUSTOMERS.map((c) => ({
          ...c,
          userId,
        })),
      })

      customers = await db.customer.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
      })
    }

    return NextResponse.json(customers)
  } catch (error) {
    console.error('[CUSTOMERS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
