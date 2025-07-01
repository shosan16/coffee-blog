import { PrismaClient } from '@prisma/client';

import { createChildLogger } from '@/server/shared/logger';

// PrismaClientのグローバルインスタンスを宣言
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// ロガーの初期化
const logger = createChildLogger({ component: 'prisma' });

// シングルトンパターンでPrismaClientを初期化
logger.info('Initializing PrismaClient...');
logger.debug(
  {
    databaseUrlExists: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
  },
  'PrismaClient initialization context'
);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

logger.info('PrismaClient initialized successfully');

// 開発環境では、ホットリロード時に複数のPrismaClientインスタンスが作成されるのを防ぐ
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  logger.debug('PrismaClient stored in global for development');
}
