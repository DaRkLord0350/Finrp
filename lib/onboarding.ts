import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function checkOnboardingStatus() {
  const { userId } = await auth()

  if (!userId) {
    return { isAuthenticated: false, needsOnboarding: false }
  }

  const profile = await db.businessProfile.findUnique({
    where: { userId },
  })

  return {
    isAuthenticated: true,
    needsOnboarding: !profile,
    profile: profile || null,
  }
}
