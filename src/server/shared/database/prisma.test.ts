import { beforeEach, describe, expect, it, vi } from 'vitest';

// Prismaクライアントをモック化
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    post: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  })),
}));

// グローバル変数の型定義
type GlobalWithPrisma = {
  prisma?: unknown;
};

describe('Prisma Client Singleton', () => {
  let originalNodeEnv: string | undefined;

  beforeEach(() => {
    // 各テスト前にモックをリセット
    vi.clearAllMocks();

    // 元の環境変数を保存
    originalNodeEnv = process.env.NODE_ENV;

    // グローバル変数をクリア
    const globalWithPrisma = global as GlobalWithPrisma;
    if ('prisma' in globalWithPrisma) {
      delete globalWithPrisma.prisma;
    }

    // 環境変数をリセット（デフォルト値を設定）
    vi.stubEnv('NODE_ENV', 'test');

    // モジュールキャッシュをクリア
    vi.resetModules();
  });

  afterEach(() => {
    // 環境変数を元に戻す
    if (originalNodeEnv !== undefined) {
      vi.stubEnv('NODE_ENV', originalNodeEnv);
    } else {
      // プロセス環境変数をクリア（TypeScriptエラー回避）
      vi.stubEnv('NODE_ENV', undefined);
    }

    // モックをリストア
    vi.restoreAllMocks();
  });

  describe('シングルトンパターンの検証', () => {
    it('事前条件: Prismaモジュールが正常にインポートできること', async () => {
      // 事前条件: モジュールが存在し、インポート可能
      const prismaModule = await import('@/server/shared/database/prisma');

      // 事前条件: prismaエクスポートが存在する
      expect(prismaModule.prisma).toBeDefined();
      expect(typeof prismaModule.prisma).toBe('object');
    });

    it('事後条件: 同一インスタンスが返されること', async () => {
      // テスト実行: 複数回インポート
      const prismaModule1 = await import('@/server/shared/database/prisma');
      const prismaModule2 = await import('@/server/shared/database/prisma');

      // 事後条件: 同一インスタンスが返される
      expect(prismaModule1.prisma).toBe(prismaModule2.prisma);
    });

    it('不変条件: 複数回インポートしても同一インスタンスであること', async () => {
      // テスト実行: 複数回インポート
      const prismaModule1 = await import('@/server/shared/database/prisma');
      const prismaModule2 = await import('@/server/shared/database/prisma');
      const prismaModule3 = await import('@/server/shared/database/prisma');

      // 不変条件: 全て同一インスタンス
      expect(prismaModule1.prisma).toBe(prismaModule2.prisma);
      expect(prismaModule2.prisma).toBe(prismaModule3.prisma);
      expect(prismaModule1.prisma).toBe(prismaModule3.prisma);
    });
  });

  describe('環境別動作の検証', () => {
    it('本番環境: グローバル変数に保存されないこと', async () => {
      // 事前条件: 本番環境の設定
      vi.stubEnv('NODE_ENV', 'production');

      // テスト実行: モジュールをインポート
      await import('@/server/shared/database/prisma');

      // 事後条件: グローバル変数に保存されない
      const globalWithPrisma = global as GlobalWithPrisma;
      expect(globalWithPrisma.prisma).toBeUndefined();
    });

    it('開発環境: グローバル変数に保存されること', async () => {
      // 事前条件: 開発環境の設定
      vi.stubEnv('NODE_ENV', 'development');

      // テスト実行: モジュールをインポート
      const { prisma } = await import('@/server/shared/database/prisma');

      // 事後条件: グローバル変数に保存される
      const globalWithPrisma = global as GlobalWithPrisma;
      expect(globalWithPrisma.prisma).toBe(prisma);
    });

    it('テスト環境: グローバル変数に保存されること', async () => {
      // 事前条件: テスト環境の設定
      vi.stubEnv('NODE_ENV', 'test');

      // テスト実行: モジュールをインポート
      const { prisma } = await import('@/server/shared/database/prisma');

      // 事後条件: グローバル変数に保存される
      const globalWithPrisma = global as GlobalWithPrisma;
      expect(globalWithPrisma.prisma).toBe(prisma);
    });
  });

  describe('モジュール構造の検証', () => {
    it('事後条件: 正しいエクスポート構造を持つこと', async () => {
      // テスト実行: モジュールをインポート
      const prismaModule = await import('@/server/shared/database/prisma');

      // 事後条件: 期待されるエクスポートが存在する
      expect(prismaModule).toHaveProperty('prisma');
      expect(typeof prismaModule.prisma).toBe('object');
    });

    it('不変条件: prismaインスタンスが有効なオブジェクトであること', async () => {
      // テスト実行: モジュールをインポート
      const { prisma } = await import('@/server/shared/database/prisma');

      // 不変条件: prismaが有効なオブジェクト
      expect(prisma).toBeDefined();
      expect(prisma).not.toBeNull();
      expect(typeof prisma).toBe('object');
    });
  });

  describe('設計原則の検証', () => {
    it('事前条件: シングルトンパターンが正しく実装されていること', async () => {
      // 事前条件: 初回インポート
      const firstImport = await import('@/server/shared/database/prisma');

      // モジュールキャッシュをクリアせずに再インポート
      const secondImport = await import('@/server/shared/database/prisma');

      // 事前条件: 同一インスタンスが返される（シングルトンパターン）
      expect(firstImport.prisma).toBe(secondImport.prisma);
    });

    it('不変条件: 環境変数に関係なくprismaインスタンスが利用可能であること', async () => {
      // 異なる環境設定でテスト
      const environments = ['production', 'development', 'test', ''];

      for (const env of environments) {
        vi.stubEnv('NODE_ENV', env);
        vi.resetModules();

        // テスト実行: 各環境でインポート
        const { prisma } = await import('@/server/shared/database/prisma');

        // 不変条件: 全ての環境でprismaが利用可能
        expect(prisma).toBeDefined();
        expect(typeof prisma).toBe('object');
      }
    });
  });
});
