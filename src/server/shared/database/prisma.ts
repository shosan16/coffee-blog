import { PrismaClient } from '@prisma/client';

// PrismaClientのグローバルインスタンスを宣言
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// シングルトンパターンでPrismaClientを初期化
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// 開発環境では、ホットリロード時に複数のPrismaClientインスタンスが作成されるのを防ぐ
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
