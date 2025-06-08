import { PrismaClient } from '@prisma/client';

// PrismaClientのグローバルインスタンスを宣言
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// シングルトンパターンでPrismaClientを初期化
console.log('[Prisma] Initializing PrismaClient...');
console.log('[Prisma] DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('[Prisma] NODE_ENV:', process.env.NODE_ENV);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

console.log('[Prisma] PrismaClient initialized successfully');

// 開発環境では、ホットリロード時に複数のPrismaClientインスタンスが作成されるのを防ぐ
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  console.log('[Prisma] PrismaClient stored in global for development');
}
