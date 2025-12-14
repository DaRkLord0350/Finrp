// Mock Prisma Client to avoid build errors when the client is not generated
export const db = new Proxy({}, {
  get: () => new Proxy({}, {
    get: () => async () => []
  })
}) as any;
