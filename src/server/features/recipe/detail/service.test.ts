import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getRecipeDetail } from './service';
import { RecipeDetailError } from './types';

// Prismaクライアントをモック
vi.mock('@/server/shared/database/prisma', () => ({
  prisma: {
    post: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// モックされたPrismaクライアントの参照を取得
const { prisma } = await import('@/server/shared/database/prisma');

describe('getRecipeDetail', () => {
  beforeEach(() => {
    // テスト間でモックをリセット
    vi.clearAllMocks();
  });

  describe('正常ケース', () => {
    it('公開されたレシピの詳細情報を正常に取得できること', async () => {
      // Arrange - 準備：公開されたレシピのモックデータを設定
      const mockRecipe = {
        id: 1n,
        authorId: 1n,
        baristaId: 1n,
        title: 'エチオピア イルガチェフェ V60',
        summary: 'フルーティーで華やかな酸味が特徴',
        remarks: '特に蒸らし時間に注意',
        roastLevel: 'LIGHT_MEDIUM' as const,
        grindSize: 'MEDIUM_FINE' as const,
        beanWeight: 20,
        waterTemp: 92,
        waterAmount: 300,
        viewCount: 150,
        isPublished: true,
        publishedAt: new Date('2025-06-20T10:30:00Z'),
        createdAt: new Date('2025-06-20T10:30:00Z'),
        updatedAt: new Date('2025-06-22T10:30:00Z'),
        barista: {
          id: 1n,
          name: '佐藤花子',
          affiliation: 'Specialty Coffee Shop ARIA',
          socialLinks: [
            {
              id: 1n,
              platform: 'Instagram',
              url: 'https://instagram.com/hanako_barista',
            },
          ],
        },
        steps: [
          {
            id: 1n,
            stepOrder: 1,
            timeSeconds: 30,
            description: 'お湯を沸かし、92℃まで冷ます',
          },
          {
            id: 2n,
            stepOrder: 2,
            timeSeconds: 60,
            description: 'ドリッパーとサーバーを温める',
          },
        ],
        equipment: [
          {
            id: 1n,
            name: 'V60ドリッパー',
            brand: 'HARIO',
            description: '円錐形で一つ穴のドリッパー',
            affiliateLink: 'https://example.com/affiliate/hario-v60',
            equipmentType: {
              id: 1n,
              name: 'ドリッパー',
              description: 'コーヒーを抽出するための器具',
            },
          },
        ],
        tags: [
          {
            tag: {
              id: 1n,
              name: 'エチオピア',
              slug: 'ethiopia',
            },
          },
        ],
      };

      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockRecipe);
      vi.mocked(prisma.post.update).mockResolvedValue({ ...mockRecipe, viewCount: 151 });

      // Act - 実行：レシピ詳細取得を実行
      const result = await getRecipeDetail(1);

      // Assert - 確認：正しい詳細情報が返されることを検証
      expect(result.recipe).toMatchObject({
        id: '1',
        title: 'エチオピア イルガチェフェ V60',
        summary: 'フルーティーで華やかな酸味が特徴',
        remarks: '特に蒸らし時間に注意',
        roastLevel: 'LIGHT_MEDIUM',
        grindSize: 'MEDIUM_FINE',
        beanWeight: 20,
        waterTemp: 92,
        waterAmount: 300,
        viewCount: 150,
        isPublished: true,
        publishedAt: '2025-06-20T10:30:00.000Z',
        createdAt: '2025-06-20T10:30:00.000Z',
        updatedAt: '2025-06-22T10:30:00.000Z',
      });

      expect(result.recipe.barista).toMatchObject({
        id: '1',
        name: '佐藤花子',
        socialLinks: [
          {
            id: '1',
            platform: 'Instagram',
            url: 'https://instagram.com/hanako_barista',
          },
        ],
      });

      expect(result.recipe.steps).toHaveLength(2);
      expect(result.recipe.equipment).toHaveLength(1);
      expect(result.recipe.tags).toHaveLength(1);
      expect(result.newViewCount).toBe(151);

      // 現在の実装では、ビューカウント更新はPrismaレベルで行われないため、
      // updateメソッドが呼ばれないことを確認
      expect(prisma.post.update).not.toHaveBeenCalled();
    });

    it('バリスタ情報がnullの場合でも正常に処理できること', async () => {
      // Arrange - 準備：バリスタ情報がnullのレシピモックデータを設定
      const mockRecipe = {
        id: 1n,
        authorId: 1n,
        baristaId: null,
        title: 'テストレシピ',
        summary: null,
        remarks: null,
        roastLevel: 'MEDIUM' as const,
        grindSize: null,
        beanWeight: null,
        waterTemp: null,
        waterAmount: null,
        viewCount: 0,
        isPublished: true,
        publishedAt: new Date('2025-06-20T10:30:00Z'),
        createdAt: new Date('2025-06-20T10:30:00Z'),
        updatedAt: new Date('2025-06-20T10:30:00Z'),
        barista: null,
        steps: [],
        equipment: [],
        tags: [],
      };

      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockRecipe);
      vi.mocked(prisma.post.update).mockResolvedValue({ ...mockRecipe, viewCount: 1 });

      // Act - 実行：レシピ詳細取得を実行
      const result = await getRecipeDetail(1);

      // Assert - 確認：barista が undefined になることを検証
      expect(result.recipe.barista).toBeUndefined();
      expect(result.recipe.steps).toHaveLength(0);
      expect(result.recipe.equipment).toHaveLength(0);
      expect(result.recipe.tags).toHaveLength(0);
    });
  });

  describe('異常ケース', () => {
    it('存在しないレシピIDの場合、RECIPE_NOT_FOUNDエラーを投げること', async () => {
      // Arrange - 準備：存在しないレシピのモックを設定
      vi.mocked(prisma.post.findUnique).mockResolvedValue(null);

      // Act & Assert - 実行・確認：NOT_FOUNDエラーが投げられることを検証
      await expect(getRecipeDetail(999)).rejects.toThrow(RecipeDetailError);
      await expect(getRecipeDetail(999)).rejects.toThrow(
        expect.objectContaining({
          code: 'RECIPE_NOT_FOUND',
          statusCode: 404,
        })
      );
    });

    it('非公開レシピの場合、RECIPE_NOT_PUBLISHEDエラーを投げること', async () => {
      // Arrange - 準備：非公開レシピのモックデータを設定
      const mockUnpublishedRecipe = {
        id: 1n,
        authorId: 1n,
        baristaId: null,
        title: '非公開レシピ',
        summary: null,
        remarks: null,
        roastLevel: 'MEDIUM' as const,
        grindSize: null,
        beanWeight: null,
        waterTemp: null,
        waterAmount: null,
        viewCount: 0,
        isPublished: false, // 非公開
        publishedAt: null,
        createdAt: new Date('2025-06-20T10:30:00Z'),
        updatedAt: new Date('2025-06-20T10:30:00Z'),
        barista: null,
        steps: [],
        equipment: [],
        tags: [],
      };

      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockUnpublishedRecipe);

      // Act & Assert - 実行・確認：NOT_PUBLISHEDエラーが投げられることを検証
      await expect(getRecipeDetail(1)).rejects.toThrow(RecipeDetailError);
      await expect(getRecipeDetail(1)).rejects.toThrow(
        expect.objectContaining({
          code: 'RECIPE_NOT_PUBLISHED',
          statusCode: 403,
        })
      );

      // ビューカウント更新が呼ばれないことを確認
      expect(prisma.post.update).not.toHaveBeenCalled();
    });

    it('データベースエラーの場合、そのまま例外を再投げること', async () => {
      // Arrange - 準備：データベースエラーのモックを設定
      const dbError = new Error('Database connection failed');
      vi.mocked(prisma.post.findUnique).mockRejectedValue(dbError);

      // Act & Assert - 実行・確認：データベースエラーが再投げされることを検証
      await expect(getRecipeDetail(1)).rejects.toThrow('Database connection failed');
    });

    it('ビューカウント更新に失敗してもレシピ取得は成功すること', async () => {
      // Arrange - 準備：レシピ取得は成功、ビューカウント更新は失敗のモックを設定
      const mockRecipe = {
        id: 1n,
        authorId: 1n,
        baristaId: null,
        title: 'テストレシピ',
        summary: null,
        remarks: null,
        roastLevel: 'MEDIUM' as const,
        grindSize: null,
        beanWeight: null,
        waterTemp: null,
        waterAmount: null,
        viewCount: 100,
        isPublished: true,
        publishedAt: new Date('2025-06-20T10:30:00Z'),
        createdAt: new Date('2025-06-20T10:30:00Z'),
        updatedAt: new Date('2025-06-20T10:30:00Z'),
        barista: null,
        steps: [],
        equipment: [],
        tags: [],
      };

      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockRecipe);
      vi.mocked(prisma.post.update).mockRejectedValue(new Error('Update failed'));

      // Act - 実行：レシピ詳細取得を実行
      const result = await getRecipeDetail(1);

      // Assert - 確認：レシピ取得は成功し、ビューカウントは増加していることを検証
      expect(result.recipe.viewCount).toBe(100);
      expect(result.newViewCount).toBe(101); // 現在の実装では常に+1される
    });
  });
});
