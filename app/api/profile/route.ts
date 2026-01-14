export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
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
            businessType: 'Private Limited Company',
            industry: 'Services',
            annualTurnover: '20 Lakh - 1 Crore',
            hasEmployees: false,
            numberOfEmployees: 0
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
        const { 
            businessName,
            email,
            address, 
            industry,
            businessType,
            annualTurnover,
            hasEmployees,
            numberOfEmployees
            } = body;

        
        const dataToSave: any = {
            businessName,
            email,
            address,
        }

        // Only add these if they are present in the request to avoid overwriting with null if a partial update (like from invoice creator) is sent
        if (industry !== undefined) dataToSave.industry = industry;
        if (businessType !== undefined) dataToSave.businessType = businessType;
        if (annualTurnover !== undefined) dataToSave.annualTurnover = annualTurnover;
        if (hasEmployees !== undefined) dataToSave.hasEmployees = hasEmployees;
        if (numberOfEmployees !== undefined) dataToSave.numberOfEmployees = numberOfEmployees;



        const profile = await db.businessProfile.upsert({
            where: { userId },
            update: dataToSave,
            create: {
                userId,
                businessName: businessName || 'My Business',
                email: email || '',
                address: address || '',
                industry: industry || 'Services',
                businessType: businessType || 'Sole Proprietorship',
                annualTurnover: annualTurnover || '< 20 Lakh',
                hasEmployees: hasEmployees || false,
                numberOfEmployees: numberOfEmployees || 0
            },
        })  

        return NextResponse.json(profile);
    }   catch (error) {
        console.error('[PROFILE_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}