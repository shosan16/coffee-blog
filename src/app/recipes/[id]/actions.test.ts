import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notFound } from 'next/navigation';

import { getRecipeDetailAction } from './actions';
import { getRecipeDetail } from '@/server/features/recipe/detail/service';
import { validateRecipeId } from '@/server/features/recipe/detail/validation';
import { RecipeDetailError } from '@/server/features/recipe/detail/types';

// モジュールをモック
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('@/server/features/recipe/detail/service', () => ({
  getRecipeDetail: vi.fn(),
}));

vi.mock('@/server/features/recipe/detail/validation', () => ({
  validateRecipeId: vi.fn(),
}));

// モック関数の参照取得
const mockedNotFound = vi.mocked(notFound);
const mockedGetRecipeDetail = vi.mocked(getRecipeDetail);
const mockedValidateRecipeId = vi.mocked(validateRecipeId);

describe('getRecipeDetailAction', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    vi.clearAllMocks();
  });

  describe('正常ケース', () => {
    it('有効なレシピIDでレシピ詳細を正常に取得できること', async () => {
      // Arrange - 準備：モックデータとレスポンスを設定
      const recipeId = '123';
      const numericId = 123;
      const mockRecipe = {
        id: '123',
        title: 'エチオピア イルガチェフェ V60',
        summary: 'フルーティーで華やかな酸味が特徴',
        roastLevel: 'LIGHT_MEDIUM' as const,
        steps: [],
        equipment: [],
        tags: [],
        viewCount: 100,
        isPublished: true,
        createdAt: '2025-06-20T10:30:00Z',
        updatedAt: '2025-06-22T10:30:00Z',
      };

      mockedValidateRecipeId.mockReturnValue(numericId);
      mockedGetRecipeDetail.mockResolvedValue({
        recipe: mockRecipe,
        newViewCount: 101,
      });

      // Act - 実行：Server Actionを実行
      const result = await getRecipeDetailAction(recipeId);

      // Assert - 確認：正常にレシピ詳細が取得されることを検証
      expect(mockedValidateRecipeId).toHaveBeenCalledWith(recipeId);
      expect(mockedGetRecipeDetail).toHaveBeenCalledWith(numericId);
      expect(result).toEqual(mockRecipe);
      expect(mockedNotFound).not.toHaveBeenCalled();
    });
  });

  describe('エラーケース', () => {
    it('無効なIDの場合、notFound()が呼ばれること', async () => {
      // Arrange - 準備：無効なIDエラーを設定
      const invalidId = 'invalid';
      const error = new RecipeDetailError('Invalid ID', 'INVALID_ID', 400);

      mockedValidateRecipeId.mockImplementation(() => {
        throw error;
      });

      // Act - 実行：Server Actionを実行（notFound()のためPromiseは解決されない）
      try {
        await getRecipeDetailAction(invalidId);
      } catch {
        // notFound()が呼ばれた場合、何もしない
      }

      // Assert - 確認：notFound()が呼ばれることを検証
      expect(mockedValidateRecipeId).toHaveBeenCalledWith(invalidId);
      expect(mockedNotFound).toHaveBeenCalled();
      expect(mockedGetRecipeDetail).not.toHaveBeenCalled();
    });

    it('レシピが見つからない場合、notFound()が呼ばれること', async () => {
      // Arrange - 準備：レシピ未発見エラーを設定
      const recipeId = '999';
      const numericId = 999;
      const error = new RecipeDetailError('Recipe not found', 'RECIPE_NOT_FOUND', 404);

      mockedValidateRecipeId.mockReturnValue(numericId);
      mockedGetRecipeDetail.mockRejectedValue(error);

      // Act - 実行：Server Actionを実行（notFound()のためPromiseは解決されない）
      try {
        await getRecipeDetailAction(recipeId);
      } catch {
        // notFound()が呼ばれた場合、何もしない
      }

      // Assert - 確認：notFound()が呼ばれることを検証
      expect(mockedValidateRecipeId).toHaveBeenCalledWith(recipeId);
      expect(mockedGetRecipeDetail).toHaveBeenCalledWith(numericId);
      expect(mockedNotFound).toHaveBeenCalled();
    });

    it('非公開レシピの場合、notFound()が呼ばれること（セキュリティ上の隠蔽）', async () => {
      // Arrange - 準備：非公開レシピエラーを設定
      const recipeId = '456';
      const numericId = 456;
      const error = new RecipeDetailError('Recipe not published', 'RECIPE_NOT_PUBLISHED', 403);

      mockedValidateRecipeId.mockReturnValue(numericId);
      mockedGetRecipeDetail.mockRejectedValue(error);

      // Act - 実行：Server Actionを実行（notFound()のためPromiseは解決されない）
      try {
        await getRecipeDetailAction(recipeId);
      } catch {
        // notFound()が呼ばれた場合、何もしない
      }

      // Assert - 確認：403エラーもnotFound()で処理されることを検証
      expect(mockedValidateRecipeId).toHaveBeenCalledWith(recipeId);
      expect(mockedGetRecipeDetail).toHaveBeenCalledWith(numericId);
      expect(mockedNotFound).toHaveBeenCalled();
    });

    it('予期しないエラーの場合、エラーを再スローすること', async () => {
      // Arrange - 準備：予期しないエラーを設定
      const recipeId = '789';
      const numericId = 789;
      const unexpectedError = new Error('Database connection failed');

      mockedValidateRecipeId.mockReturnValue(numericId);
      mockedGetRecipeDetail.mockRejectedValue(unexpectedError);

      // Act & Assert - 実行・確認：予期しないエラーが再スローされることを検証
      await expect(getRecipeDetailAction(recipeId)).rejects.toThrow('Database connection failed');

      expect(mockedValidateRecipeId).toHaveBeenCalledWith(recipeId);
      expect(mockedGetRecipeDetail).toHaveBeenCalledWith(numericId);
      expect(mockedNotFound).not.toHaveBeenCalled();
    });

    it('RecipeDetailErrorの不明なコードの場合、エラーを再スローすること', async () => {
      // Arrange - 準備：不明なエラーコードを設定
      const recipeId = '101';
      const numericId = 101;
      const unknownError = new RecipeDetailError('Unknown error', 'UNKNOWN_ERROR' as never, 500);

      mockedValidateRecipeId.mockReturnValue(numericId);
      mockedGetRecipeDetail.mockRejectedValue(unknownError);

      // Act & Assert - 実行・確認：不明なエラーコードが再スローされることを検証
      await expect(getRecipeDetailAction(recipeId)).rejects.toThrow(unknownError);

      expect(mockedValidateRecipeId).toHaveBeenCalledWith(recipeId);
      expect(mockedGetRecipeDetail).toHaveBeenCalledWith(numericId);
      expect(mockedNotFound).not.toHaveBeenCalled();
    });
  });
});
