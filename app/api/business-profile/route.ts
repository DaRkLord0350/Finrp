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

    try {
      const profile = await db.businessProfile.findUnique({
        where: { userId },
      })

      if (!profile) {
        return NextResponse.json({ exists: false })
      }

      return NextResponse.json({ exists: true, profile })
    } catch (dbError: any) {
      // Handle database connection errors gracefully
      console.error('[BUSINESS_PROFILE_GET] Database Error:', {
        message: dbError?.message,
        code: dbError?.code,
      })
      
      // Log helpful diagnostic info
      if (dbError?.message?.includes('Tenant or user not found') || 
          dbError?.message?.includes('connect')) {
        console.error('[BUSINESS_PROFILE_GET] 💡 Possible database connection issue:')
        console.error('  - Check DATABASE_URL in .env.local')
        console.error('  - Verify PostgreSQL is running')
        console.error('  - Verify username and password are correct')
        console.error('  - Run: node scripts/test-db-connection.js')
      }
      
      // For database errors, return exists: false to allow onboarding flow
      return NextResponse.json({ exists: false })
    }
  } catch (error) {
    console.error('[BUSINESS_PROFILE_GET]', error)
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
    const { businessName, email, address, industry, businessType, annualTurnover, hasEmployees, numberOfEmployees } = body

    // Validation
    if (!businessName || !email || !address) {
      return new NextResponse('Business Name, Email, and Address are required', { status: 400 })
    }

    try {
      // Check if profile already exists
      const existingProfile = await db.businessProfile.findUnique({
        where: { userId },
      })

      let profile

      if (existingProfile) {
        // Update existing profile
        profile = await db.businessProfile.update({
          where: { userId },
          data: {
            businessName,
            email,
            address,
            industry: industry || null,
            businessType: businessType || null,
            annualTurnover: annualTurnover ? parseFloat(annualTurnover) : null,
            hasEmployees: hasEmployees || false,
            numberOfEmployees: numberOfEmployees ? parseInt(numberOfEmployees) : null,
            updatedAt: new Date(),
          },
        })
      } else {
        // Create new profile
        profile = await db.businessProfile.create({
          data: {
            userId,
            businessName,
            email,
            address,
            industry: industry || null,
            businessType: businessType || null,
            annualTurnover: annualTurnover ? parseFloat(annualTurnover) : null,
            hasEmployees: hasEmployees || false,
            numberOfEmployees: numberOfEmployees ? parseInt(numberOfEmployees) : null,
          },
        })
      }

      return NextResponse.json(profile)
    } catch (dbError: any) {
      console.error('[BUSINESS_PROFILE_POST] Database Error:', {
        message: dbError?.message,
        code: dbError?.code,
      })
      
      // Log helpful diagnostic info
      if (dbError?.message?.includes('Tenant or user not found') || 
          dbError?.message?.includes('connect')) {
        console.error('[BUSINESS_PROFILE_POST] 💡 Possible database connection issue:')
        console.error('  - Check DATABASE_URL in .env.local')
        console.error('  - Verify PostgreSQL is running')
        console.error('  - Verify username and password are correct')
        console.error('  - Run: node scripts/test-db-connection.js')
      }
      
      return new NextResponse('Failed to save profile. Please check your database connection and try again.', { status: 500 })
    }
  } catch (error) {
    console.error('[BUSINESS_PROFILE_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
