// サーバーサイドでのみpinoを使用
/* eslint-disable @typescript-eslint/no-explicit-any */
let pino: any;
let logger: any;

if (typeof window === 'undefined') {
  // サーバーサイドでのみインポート
  pino = require('pino');

  const isDev = process.env.NODE_ENV === 'development';
  const level = process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info');

  logger = pino({
    level,
    transport: isDev
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
            singleLine: false,
          },
        }
      : undefined,
    base: {
      env: process.env.NODE_ENV,
      service: 'coffee-blog-api',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    serializers: {
      err: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },
  });
} else {
  // クライアントサイドでは console を使用
  /* eslint-disable no-console */
  logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
    child: (): any => logger,
  };
  /* eslint-enable no-console */
}

export { logger };

// ユーティリティ関数: 子ロガーの作成
export const createChildLogger = (bindings: Record<string, unknown>): any => {
  return logger.child(bindings);
};

// ユーティリティ関数: リクエスト処理用ロガー
export const createRequestLogger = (method: string, url: string, requestId?: string): any => {
  return logger.child({
    request: {
      method,
      url,
      id: requestId ?? `req_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    },
  });
};

// ユーティリティ関数: パフォーマンス測定
export const measurePerformance = (operationName: string): { end: () => number } => {
  const start = performance.now();
  return {
    end: (): number => {
      const duration = performance.now() - start;
      logger.info(
        {
          operation: operationName,
          duration: Math.round(duration * 100) / 100,
        },
        `Operation completed: ${operationName}`
      );
      return duration;
    },
  };
};
