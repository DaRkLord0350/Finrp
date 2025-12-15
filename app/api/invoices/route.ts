export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const invoices = await db.invoice.findMany({
      where: { userId },
      include: {
        customer: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('[INVOICES_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { id, customerId, issueDate, dueDate, status, items, notes } = body

    const invoice = await db.invoice.create({
      data: {
        id,
        userId,
        customerId,
        issueDate,
        dueDate,
        status,
        notes,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            rate: Number(item.rate),
          })),
        },
      },
      include: {
        items: true,
        customer: true,
      },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('[INVOICES_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
