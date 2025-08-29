import pino from 'pino';

/**
 * 構造化ログ用のPinoロガー設定
 * CLAUDE.mdのログ管理規約に準拠
 */
export const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  formatters: {
    level: (label) => ({
      level: label,
    }),
  },
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
});

/**
 * ログコンテキスト生成ヘルパー
 */
export function createLogContext(
  operation: string,
  recipeId?: string
): { operation: string; recipeId?: string; timestamp: string } {
  return {
    operation,
    recipeId,
    timestamp: new Date().toISOString(),
  };
}
