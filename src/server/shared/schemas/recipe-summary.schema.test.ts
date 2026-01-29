/**
 * レシピ一覧用スキーマのテスト
 */

import { describe, it, expect } from 'vitest';

import {
  RecipeSummarySchema,
  RecipeListResponseSchema,
  type RecipeSummary,
  type RecipeListResponse,
} from './recipe-summary.schema';

describe('RecipeSummarySchema', () => {
  describe('有効なレシピ要約情報のパース', () => {
    it('正常なレシピ要約情報がパースできること', () => {
      // Arrange - 有効なレシピ要約情報を準備
      const validRecipeSummary = {
        id: 'recipe-1',
        title: 'V60 ミディアムロースト',
        summary: 'バランスの取れたV60レシピ',
        equipment: ['Hario V60', 'ペーパーフィルター'],
        roastLevel: 'MEDIUM',
        tags: [{ id: '1', name: 'フルーティ', slug: 'fruity' }],
        baristaName: 'テスト投稿者',
      };

      // Act - スキーマでパース
      const result = RecipeSummarySchema.safeParse(validRecipeSummary);

      // Assert - パース成功を検証
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validRecipeSummary);
      }
    });

    it('空の器具配列でもパースできること', () => {
      // Arrange - 器具が空のレシピ要約情報
      const recipeWithEmptyEquipment = {
        id: 'recipe-3',
        title: '器具なしレシピ',
        summary: '器具を指定していないレシピ',
        equipment: [],
        roastLevel: 'DARK',
        tags: [],
        baristaName: '山田太郎',
      };

      // Act - スキーマでパース
      const result = RecipeSummarySchema.safeParse(recipeWithEmptyEquipment);

      // Assert - パース成功を検証
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.equipment).toEqual([]);
      }
    });
  });

  describe('無効なレシピ要約情報の拒否', () => {
    it('idが欠落している場合、パースに失敗すること', () => {
      // Arrange - idが欠落したレシピ要約情報
      const invalidRecipe = {
        title: 'テストレシピ',
        summary: 'テスト',
        equipment: [],
        roastLevel: 'MEDIUM',
        tags: [],
        baristaName: null,
      };

      // Act - スキーマでパース
      const result = RecipeSummarySchema.safeParse(invalidRecipe);

      // Assert - パース失敗を検証
      expect(result.success).toBe(false);
    });

    it('未知のプロパティが含まれる場合、パースに失敗すること', () => {
      // Arrange - 未知のプロパティを含むレシピ要約情報
      const recipeWithUnknownProps = {
        id: 'recipe-1',
        title: 'テストレシピ',
        summary: 'テスト',
        equipment: [],
        roastLevel: 'MEDIUM',
        tags: [],
        baristaName: null,
        unknownProp: 'should fail',
      };

      // Act - スキーマでパース
      const result = RecipeSummarySchema.safeParse(recipeWithUnknownProps);

      // Assert - パース失敗を検証（strict()による）
      expect(result.success).toBe(false);
    });

    it('roastLevelが数値の場合、パースに失敗すること', () => {
      // Arrange - roastLevelが数値のレシピ要約情報
      const invalidRecipe = {
        id: 'recipe-1',
        title: 'テストレシピ',
        summary: 'テスト',
        equipment: [],
        roastLevel: 123,
        tags: [],
        baristaName: null,
      };

      // Act - スキーマでパース
      const result = RecipeSummarySchema.safeParse(invalidRecipe);

      // Assert - パース失敗を検証
      expect(result.success).toBe(false);
    });
  });

  describe('型推論', () => {
    it('RecipeSummary型が正しく推論されること', () => {
      // Arrange - RecipeSummary型の値を作成
      const recipe: RecipeSummary = {
        id: 'recipe-1',
        title: 'テストレシピ',
        summary: 'テスト',
        equipment: ['V60'],
        roastLevel: 'MEDIUM',
        tags: [{ id: '1', name: 'ナッツ', slug: 'nuts' }],
        baristaName: 'テスト投稿者',
      };

      // Assert - フィールドの型を確認
      expect(typeof recipe.id).toBe('string');
      expect(typeof recipe.title).toBe('string');
      expect(Array.isArray(recipe.equipment)).toBe(true);
      expect(typeof recipe.roastLevel).toBe('string');
      expect(Array.isArray(recipe.tags)).toBe(true);
    });
  });
});

describe('RecipeListResponseSchema', () => {
  describe('有効なレシピ一覧レスポンスのパース', () => {
    it('正常なレシピ一覧レスポンスがパースできること', () => {
      // Arrange - 有効なレシピ一覧レスポンスを準備
      const validResponse = {
        recipes: [
          {
            id: 'recipe-1',
            title: 'V60 ミディアムロースト',
            summary: 'バランスの取れたV60レシピ',
            equipment: ['Hario V60'],
            roastLevel: 'MEDIUM',
            tags: [{ id: '1', name: 'バランス', slug: 'balance' }],
            baristaName: '鈴木一郎',
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 5,
          totalItems: 50,
          itemsPerPage: 10,
        },
      };

      // Act - スキーマでパース
      const result = RecipeListResponseSchema.safeParse(validResponse);

      // Assert - パース成功を検証
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.recipes).toHaveLength(1);
        expect(result.data.pagination.currentPage).toBe(1);
      }
    });

    it('空のレシピ配列でもパースできること', () => {
      // Arrange - レシピが空のレスポンス
      const emptyResponse = {
        recipes: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
        },
      };

      // Act - スキーマでパース
      const result = RecipeListResponseSchema.safeParse(emptyResponse);

      // Assert - パース成功を検証
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.recipes).toEqual([]);
      }
    });
  });

  describe('無効なレシピ一覧レスポンスの拒否', () => {
    it('paginationが欠落している場合、パースに失敗すること', () => {
      // Arrange - paginationが欠落したレスポンス
      const invalidResponse = {
        recipes: [],
      };

      // Act - スキーマでパース
      const result = RecipeListResponseSchema.safeParse(invalidResponse);

      // Assert - パース失敗を検証
      expect(result.success).toBe(false);
    });

    it('不正なレシピデータが含まれる場合、パースに失敗すること', () => {
      // Arrange - 不正なレシピデータを含むレスポンス
      const invalidResponse = {
        recipes: [
          {
            id: 'recipe-1',
            // titleが欠落
            summary: 'テスト',
            equipment: [],
            roastLevel: 'MEDIUM',
            tags: [],
            baristaName: null,
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
        },
      };

      // Act - スキーマでパース
      const result = RecipeListResponseSchema.safeParse(invalidResponse);

      // Assert - パース失敗を検証
      expect(result.success).toBe(false);
    });
  });

  describe('型推論', () => {
    it('RecipeListResponse型が正しく推論されること', () => {
      // Arrange - RecipeListResponse型の値を作成
      const response: RecipeListResponse = {
        recipes: [
          {
            id: 'recipe-1',
            title: 'テストレシピ',
            summary: 'テスト',
            equipment: [],
            roastLevel: 'MEDIUM',
            tags: [],
            baristaName: null,
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
        },
      };

      // Assert - レスポンス構造を確認
      expect(Array.isArray(response.recipes)).toBe(true);
      expect(typeof response.pagination.currentPage).toBe('number');
    });
  });
});
