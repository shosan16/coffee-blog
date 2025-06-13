import { RoastLevel, GrindSize } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchRecipesService } from '@/server/features/recipes/search/service';
import {
  createSearchParams,
  createMockPrismaRecipes,
  createFullSearchParams,
  createMockRecipeWithNulls,
} from '@/server/features/recipes/search/test-helpers';

// Prismaクライアントをモック化
vi.mock('@/server/shared/database/prisma', () => ({
  prisma: {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    post: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

// モックPrismaの型定義
type MockPrisma = {
  $connect: ReturnType<typeof vi.fn>;
  $disconnect: ReturnType<typeof vi.fn>;
  post: {
    count: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
};

describe('SearchRecipesService', () => {
  let service: SearchRecipesService;
  let mockPrisma: MockPrisma;

  beforeEach(async () => {
    vi.clearAllMocks();
    service = new SearchRecipesService();

    // モックされたPrismaインスタンスを取得
    const prismaModule = await import('@/server/shared/database/prisma');
    mockPrisma = prismaModule.prisma as unknown as MockPrisma;

    // $connectのモックを設定
    mockPrisma.$connect.mockResolvedValue(undefined);
  });

  describe('基本的なレシピ検索', () => {
    it('ページネーション付きでレシピ一覧を取得できる', async () => {
      // Arrange - 準備： 検索パラメータとモックデータを設定
      const searchParams = createSearchParams({ page: 1, limit: 10 });
      const mockRecipes = createMockPrismaRecipes(5);
      mockPrisma.post.count.mockResolvedValue(5);
      mockPrisma.post.findMany.mockResolvedValue(mockRecipes);

      // Act - 実行： レシピ検索を実行
      const result = await service.searchRecipes(searchParams);

      // Assert - 確認： 正しい件数とページネーション情報が返される
      expect(result.recipes).toHaveLength(5);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalItems).toBe(5);
      expect(result.pagination.itemsPerPage).toBe(10);
    });

    it('空の検索結果でも正しい構造を返す', async () => {
      // Arrange - 準備： 空の結果を返すモックを設定
      const searchParams = createSearchParams();
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： レシピ検索を実行
      const result = await service.searchRecipes(searchParams);

      // Assert - 確認： 空の配列と0件のページネーション情報が返される
      expect(result.recipes).toEqual([]);
      expect(result.pagination.totalItems).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });

    it('複数ページにわたる検索結果のページネーションが正しく計算される', async () => {
      // Arrange - 準備： 複数ページにわたるデータ件数を設定
      const totalCount = 25;
      const limit = 10;
      const page = 2;
      const searchParams = createSearchParams({ page, limit });

      mockPrisma.post.count.mockResolvedValue(totalCount);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： 2ページ目の検索を実行
      const result = await service.searchRecipes(searchParams);

      // Assert - 確認： ページネーション情報が正しく計算される
      expect(result.pagination.currentPage).toBe(page);
      expect(result.pagination.totalPages).toBe(Math.ceil(totalCount / limit));
      expect(result.pagination.totalItems).toBe(totalCount);
      expect(result.pagination.itemsPerPage).toBe(limit);
    });
  });

  describe('フィルター機能', () => {
    it('焙煎レベルでフィルタリングできる', async () => {
      // Arrange - 準備： 焙煎レベルフィルターを含む検索パラメータを設定
      const searchParams = createSearchParams({
        roastLevel: [RoastLevel.MEDIUM, RoastLevel.DARK],
      });
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： 焙煎レベルフィルター付きで検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： WHERE句に焙煎レベル条件が含まれる
      const whereClause = mockPrisma.post.findMany.mock.calls[0][0].where;
      expect(whereClause.roastLevel.in).toEqual([RoastLevel.MEDIUM, RoastLevel.DARK]);
    });

    it('挽き目でフィルタリングできる', async () => {
      // Arrange - 準備： 挽き目フィルターを含む検索パラメータを設定
      const searchParams = createSearchParams({
        grindSize: [GrindSize.MEDIUM, GrindSize.FINE],
      });
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： 挽き目フィルター付きで検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： WHERE句に挽き目条件が含まれる
      const whereClause = mockPrisma.post.findMany.mock.calls[0][0].where;
      expect(whereClause.grindSize.in).toEqual([GrindSize.MEDIUM, GrindSize.FINE]);
    });

    it('器具名でフィルタリングできる', async () => {
      // Arrange - 準備： 器具フィルターを含む検索パラメータを設定
      const searchParams = createSearchParams({
        equipment: ['V60', 'Chemex'],
      });
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： 器具フィルター付きで検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： WHERE句に器具名条件が含まれる
      const whereClause = mockPrisma.post.findMany.mock.calls[0][0].where;
      expect(whereClause.AND).toBeDefined();
      expect(whereClause.AND[0].equipment.some.name.in).toEqual(['V60', 'Chemex']);
    });

    it('豆の重量範囲でフィルタリングできる', async () => {
      // Arrange - 準備： 豆の重量範囲フィルターを含む検索パラメータを設定
      const searchParams = createSearchParams({
        beanWeight: { min: 15, max: 25 },
      });
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： 豆の重量範囲フィルター付きで検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： WHERE句に豆の重量範囲条件が含まれる
      const whereClause = mockPrisma.post.findMany.mock.calls[0][0].where;
      expect(whereClause.beanWeight.gte).toBe(15);
      expect(whereClause.beanWeight.lte).toBe(25);
    });

    it('水温範囲でフィルタリングできる', async () => {
      // Arrange - 準備： 水温範囲フィルターを含む検索パラメータを設定
      const searchParams = createSearchParams({
        waterTemp: { min: 85, max: 95 },
      });
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： 水温範囲フィルター付きで検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： WHERE句に水温範囲条件が含まれる
      const whereClause = mockPrisma.post.findMany.mock.calls[0][0].where;
      expect(whereClause.waterTemp.gte).toBe(85);
      expect(whereClause.waterTemp.lte).toBe(95);
    });

    it('複数の条件を組み合わせてフィルタリングできる', async () => {
      // Arrange - 準備： すべてのフィルター条件を含む検索パラメータを設定
      const searchParams = createFullSearchParams();
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： 複数フィルター付きで検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： WHERE句にすべてのフィルター条件が含まれる
      const whereClause = mockPrisma.post.findMany.mock.calls[0][0].where;
      expect(whereClause.roastLevel.in).toEqual([RoastLevel.MEDIUM]);
      expect(whereClause.grindSize.in).toEqual([GrindSize.MEDIUM]);
      expect(whereClause.AND).toBeDefined();
      expect(whereClause.AND[0].equipment.some.name.in).toEqual(['V60']);
      expect(whereClause.beanWeight.gte).toBe(15);
      expect(whereClause.beanWeight.lte).toBe(25);
      expect(whereClause.waterTemp.gte).toBe(85);
      expect(whereClause.waterTemp.lte).toBe(95);
    });

    it('水量範囲でフィルタリングできる', async () => {
      // Arrange - 準備： 水量範囲フィルターを含む検索パラメータを設定
      const searchParams = createSearchParams({
        waterAmount: { min: 200, max: 300 },
      });
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： 水量範囲フィルター付きで検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： WHERE句に水量範囲条件が含まれる
      const whereClause = mockPrisma.post.findMany.mock.calls[0][0].where;
      expect(whereClause.waterAmount.gte).toBe(200);
      expect(whereClause.waterAmount.lte).toBe(300);
    });

    it('器具タイプでフィルタリングできる', async () => {
      // Arrange - 準備： 器具タイプフィルターを含む検索パラメータを設定
      const searchParams = createSearchParams({
        equipmentType: ['ドリッパー', 'グラインダー'],
      });
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： 器具タイプフィルター付きで検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： WHERE句に器具タイプ条件が含まれる
      const whereClause = mockPrisma.post.findMany.mock.calls[0][0].where;
      expect(whereClause.AND).toHaveLength(1);
      expect(whereClause.AND[0].equipment.some.equipmentType.name.in).toEqual([
        'ドリッパー',
        'グラインダー',
      ]);
    });
  });

  describe('検索機能', () => {
    it('キーワードでタイトルと概要を検索できる', async () => {
      // Arrange - 準備： 検索キーワードを含む検索パラメータを設定
      const searchParams = createSearchParams({
        search: 'ハンドドリップ',
      });
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： キーワード検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： WHERE句にタイトルと概要のOR検索条件が含まれる
      const whereClause = mockPrisma.post.findMany.mock.calls[0][0].where;
      expect(whereClause.OR).toHaveLength(2);
      expect(whereClause.OR[0].title.contains).toBe('ハンドドリップ');
      expect(whereClause.OR[1].summary.contains).toBe('ハンドドリップ');
    });

    it('検索キーワードが大文字小文字を区別しない', async () => {
      // Arrange - 準備： 大文字の検索キーワードを含む検索パラメータを設定
      const searchParams = createSearchParams({
        search: 'COFFEE',
      });
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： 大文字キーワードで検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： 検索条件が大文字小文字を区別しない設定になっている
      const whereClause = mockPrisma.post.findMany.mock.calls[0][0].where;
      expect(whereClause.OR[0].title.mode).toBe('insensitive');
      expect(whereClause.OR[1].summary.mode).toBe('insensitive');
    });
  });

  describe('ソート機能', () => {
    it('指定されたフィールドで昇順ソートできる', async () => {
      // Arrange - 準備： 昇順ソートを含む検索パラメータを設定
      const searchParams = createSearchParams({
        sort: 'title',
        order: 'asc',
      });
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： タイトル昇順ソート付きで検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： ORDER BY句にタイトル昇順条件が含まれる
      const orderBy = mockPrisma.post.findMany.mock.calls[0][0].orderBy;
      expect(orderBy.title).toBe('asc');
    });

    it('指定されたフィールドで降順ソートできる', async () => {
      // Arrange - 準備： 降順ソートを含む検索パラメータを設定
      const searchParams = createSearchParams({
        sort: 'title',
        order: 'desc',
      });
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： タイトル降順ソート付きで検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： ORDER BY句にタイトル降順条件が含まれる
      const orderBy = mockPrisma.post.findMany.mock.calls[0][0].orderBy;
      expect(orderBy.title).toBe('desc');
    });

    it('ソート指定がない場合はIDで昇順ソートされる', async () => {
      // Arrange - 準備： ソート指定なしの検索パラメータを設定
      const searchParams = createSearchParams();
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： ソート指定なしで検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： ORDER BY句にデフォルトのID昇順条件が含まれる
      const orderBy = mockPrisma.post.findMany.mock.calls[0][0].orderBy;
      expect(orderBy.id).toBe('asc');
    });
  });

  describe('データ変換', () => {
    it('bigint IDが文字列に変換される', async () => {
      // Arrange - 準備： bigint IDを持つモックレシピデータを設定
      const searchParams = createSearchParams();
      const mockRecipes = createMockPrismaRecipes(1);
      mockPrisma.post.count.mockResolvedValue(1);
      mockPrisma.post.findMany.mockResolvedValue(mockRecipes);

      // Act - 実行： レシピ検索を実行してデータ変換を確認
      const result = await service.searchRecipes(searchParams);

      // Assert - 確認： bigint IDが文字列に変換されている
      expect(typeof result.recipes[0].id).toBe('string');
      expect(result.recipes[0].id).toBe('1');
    });

    it('null値がデフォルト値に変換される', async () => {
      // Arrange - 準備： null値を含むモックレシピデータを設定
      const searchParams = createSearchParams();
      const mockRecipeWithNulls = createMockRecipeWithNulls();
      mockPrisma.post.count.mockResolvedValue(1);
      mockPrisma.post.findMany.mockResolvedValue([mockRecipeWithNulls]);

      // Act - 実行： null値を含むデータで検索を実行
      const result = await service.searchRecipes(searchParams);

      // Assert - 確認： null値が適切なデフォルト値に変換されている
      expect(result.recipes[0].summary).toBe('');
      expect(result.recipes[0].beanWeight).toBe(0);
      expect(result.recipes[0].waterTemp).toBe(0);
      expect(result.recipes[0].waterAmount).toBe(0);
    });

    it('器具名が配列として正しく変換される', async () => {
      // Arrange - 準備： 器具情報を含むモックレシピデータを設定
      const searchParams = createSearchParams();
      const mockRecipes = createMockPrismaRecipes(1);
      mockPrisma.post.count.mockResolvedValue(1);
      mockPrisma.post.findMany.mockResolvedValue(mockRecipes);

      // Act - 実行： 器具情報を含むデータで検索を実行
      const result = await service.searchRecipes(searchParams);

      // Assert - 確認： 器具名が配列として正しく変換されている
      expect(Array.isArray(result.recipes[0].equipment)).toBe(true);
      expect(result.recipes[0].equipment).toEqual(['V60']);
    });
  });

  describe('ページネーション計算', () => {
    it('skip値が正しく計算される', async () => {
      // Arrange - 準備： 3ページ目、5件ずつの検索パラメータを設定
      const searchParams = createSearchParams({ page: 3, limit: 5 });
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： ページネーション付きで検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： skip値とtake値が正しく計算されている
      const findManyCall = mockPrisma.post.findMany.mock.calls[0][0];
      expect(findManyCall.skip).toBe(10); // (3 - 1) * 5
      expect(findManyCall.take).toBe(5);
    });

    it('最初のページではskip値が0になる', async () => {
      // Arrange - 準備： 1ページ目の検索パラメータを設定
      const searchParams = createSearchParams({ page: 1, limit: 10 });
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： 1ページ目の検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： skip値が0になっている
      const findManyCall = mockPrisma.post.findMany.mock.calls[0][0];
      expect(findManyCall.skip).toBe(0);
    });
  });

  describe('データベース操作', () => {
    it('公開済みレシピのみが検索対象になる', async () => {
      // Arrange - 準備： 基本的な検索パラメータを設定
      const searchParams = createSearchParams();
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： レシピ検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： countとfindManyの両方でisPublishedがtrueに設定されている
      const countCall = mockPrisma.post.count.mock.calls[0][0];
      const findManyCall = mockPrisma.post.findMany.mock.calls[0][0];
      expect(countCall.where.isPublished).toBe(true);
      expect(findManyCall.where.isPublished).toBe(true);
    });

    it('必要なリレーションが含まれる', async () => {
      // Arrange - 準備： 基本的な検索パラメータを設定
      const searchParams = createSearchParams();
      mockPrisma.post.count.mockResolvedValue(0);
      mockPrisma.post.findMany.mockResolvedValue([]);

      // Act - 実行： リレーション情報を含む検索を実行
      await service.searchRecipes(searchParams);

      // Assert - 確認： 器具とタグのリレーションが含まれている
      const findManyCall = mockPrisma.post.findMany.mock.calls[0][0];
      expect(findManyCall.include.equipment.include.equipmentType).toBe(true);
      expect(findManyCall.include.tags.include.tag).toBe(true);
    });
  });

  describe('エラーハンドリング', () => {
    it('データベースエラーが適切に伝播される', async () => {
      // Arrange - 準備： データベースエラーを発生させるモックを設定
      const searchParams = createSearchParams();
      const dbError = new Error('データベース接続エラー');
      mockPrisma.post.count.mockRejectedValue(dbError);

      // Act & Assert - 実行と確認： データベースエラーが適切に伝播される
      await expect(service.searchRecipes(searchParams)).rejects.toThrow('データベース接続エラー');
    });

    it('findManyエラーが適切に伝播される', async () => {
      // Arrange - 準備： findManyでエラーを発生させるモックを設定
      const searchParams = createSearchParams();
      mockPrisma.post.count.mockResolvedValue(1);
      mockPrisma.post.findMany.mockRejectedValue(new Error('クエリ実行エラー'));

      // Act & Assert - 実行と確認： findManyエラーが適切に伝播される
      await expect(service.searchRecipes(searchParams)).rejects.toThrow('クエリ実行エラー');
    });
  });
});
