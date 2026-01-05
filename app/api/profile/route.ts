export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import {auth, currentUser} from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse('Unauthorized' , { status: 401 });
        }

        try{
            const profile = await db.businessProfile.findUnique({
                where: { userId },
        })

        if (profile) {
            return NextResponse.json(profile)
        }
    }   catch (e) {
        console.warn("Table BusinessProfile might not exist yet.", e);
    }

        return NextResponse.json({
            businessName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'My Business',
            email: user.emailAddresses[0]?.emailAddress || '',
            address: '',
        })
    } catch (error) {
        console.error('[PROFILE_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized' , { status: 401 })
        }

        const body = await req.json();
        const { businessName, email, address } = body;

        const profile = await db.businessProfile.upsert({
            where: { userId },
            update: {
                businessName,
                email,
                address,
            },
            create: {
                userId,
                businessName,
                email,
                address,
            },
        });

        return NextResponse.json(profile);
    } catch (error) {
        console.error('[PROFILE_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}