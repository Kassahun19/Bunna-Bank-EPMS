// =============================================================================
// Bunna Bank S.C. EPMS - Prisma Client & Database Manager
// =============================================================================
import { PrismaClient } from '@prisma/client';
import { config } from './env';

let prismaClient: PrismaClient | null = null;
let isConnected = false;

export function getPrismaClient(): PrismaClient | null {
  if (prismaClient) {
    return prismaClient;
  }

  if (!config.databaseUrl) {
    return null;
  }

  try {
    prismaClient = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    } as any);
    return prismaClient;
  } catch (err: any) {
    console.warn('[Prisma Init Warning]: Unable to create Prisma instance:', err?.message || err);
    return null;
  }
}

export async function checkDatabaseConnection(): Promise<{ connected: boolean; provider: string }> {
  const client = getPrismaClient();
  if (!client) {
    return { connected: false, provider: 'None (Prisma not configured)' };
  }

  try {
    // Perform a fast lightweight query to verify connectivity
    await client.$queryRaw`SELECT 1`;
    isConnected = true;
    return { connected: true, provider: 'Supabase PostgreSQL' };
  } catch (err: any) {
    isConnected = false;
    return { connected: false, provider: 'Supabase PostgreSQL (Offline/Unreachable)' };
  }
}

export async function disconnectPrisma(): Promise<void> {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
    isConnected = false;
  }
}

export const prisma = getPrismaClient();
