import { describe, it, expect, beforeEach } from 'vitest';

import { BrewingConditions } from '../../value-objects/BrewingConditions';
import { RecipeId } from '../../value-objects/RecipeId';

import { Recipe } from './Recipe.entity';
import type { RecipeStep } from './Recipe.types';

describe('Recipe Entity', () => {
  // テスト用の固定日時（決定的なテストのため）
  const TEST_CREATED_AT = new Date('2024-12-01T00:00:00.000Z');
  const TEST_UPDATED_AT = new Date('2025-01-01T00:00:00.000Z');

  // テスト用の共通データ
  let testRecipeId: RecipeId;
  let testBrewingConditions: BrewingConditions;

  beforeEach(() => {
    // Arrange - 各テストで使用する共通データを準備
    testRecipeId = RecipeId.fromString('1');
    testBrewingConditions = BrewingConditions.create({
      roastLevel: 'MEDIUM',
      grindSize: 'MEDIUM',
      beanWeight: 20,
      waterAmount: 300,
      waterTemp: 90,
    });
  });

  describe('reconstruct()', () => {
    /**
     * 事前条件: 全フィールドを含む有効なデータが渡される
     * 事後条件: すべてのフィールドが正しく設定される
     * 不変条件: brewingConditionsは元のデータと等価
     */
    it('既存データからレシピを再構築できること', () => {
      // Arrange - 再構築用のデータを準備
      const publishedAt = new Date('2025-01-01T00:00:00.000Z');
      const data = {
        id: testRecipeId,
        title: '再構築レシピ',
        summary: '再構築用の概要',
        remarks: '再構築用の備考',
        brewingConditions: testBrewingConditions,
        viewCount: 100,
        isPublished: true,
        publishedAt,
        createdAt: TEST_CREATED_AT,
        updatedAt: TEST_UPDATED_AT,
        baristaId: 'barista-1',
        steps: [
          {
            stepOrder: 1,
            description: 'ステップ1',
            timeSeconds: 30,
          },
        ] as RecipeStep[],
        equipmentIds: ['equipment-1'],
        tagIds: ['tag-1'],
      };

      // Act - レシピを再構築
      const recipe = Recipe.reconstruct(data);

      // Assert - 再構築されたレシピの状態を確認
      expect(recipe.id.equals(testRecipeId)).toBe(true);
      expect(recipe.title).toBe('再構築レシピ');
      expect(recipe.summary).toBe('再構築用の概要');
      expect(recipe.remarks).toBe('再構築用の備考');
      expect(recipe.viewCount).toBe(100);
      expect(recipe.isPublished).toBe(true);
      expect(recipe.publishedAt).toEqual(publishedAt);
      expect(recipe.createdAt).toEqual(TEST_CREATED_AT);
      expect(recipe.updatedAt).toEqual(TEST_UPDATED_AT);
      expect(recipe.baristaId).toBe('barista-1');
      expect(recipe.steps).toHaveLength(1);
      expect(recipe.equipmentIds).toHaveLength(1);
      expect(recipe.tagIds).toHaveLength(1);
      // 不変条件: brewingConditionsの等価性を検証
      expect(recipe.brewingConditions.equals(testBrewingConditions)).toBe(true);
    });

    /**
     * 事前条件: オプションフィールドが省略されたデータが渡される
     * 事後条件: オプションフィールドはデフォルト値（空配列/undefined/null）
     */
    it('オプションフィールドが省略された場合、デフォルト値が設定されること', () => {
      // Arrange - 最小限のデータを準備
      const data = {
        id: testRecipeId,
        title: '最小レシピ',
        brewingConditions: testBrewingConditions,
        viewCount: 0,
        isPublished: false,
        createdAt: TEST_CREATED_AT,
        updatedAt: TEST_UPDATED_AT,
      };

      // Act - レシピを再構築
      const recipe = Recipe.reconstruct(data);

      // Assert - オプションフィールドのデフォルト値を確認
      expect(recipe.summary).toBeUndefined();
      expect(recipe.remarks).toBeUndefined();
      expect(recipe.publishedAt).toBeUndefined();
      expect(recipe.baristaId).toBeUndefined();
      expect(recipe.baristaName).toBeNull();
      expect(recipe.steps).toEqual([]);
      expect(recipe.equipmentIds).toEqual([]);
      expect(recipe.tagIds).toEqual([]);
    });
  });

  describe('baristaName', () => {
    /**
     * 事前条件: baristaNameを含む有効なデータが渡される
     * 事後条件: baristaNameが正しく設定される
     * 不変条件: brewingConditionsは元のデータと等価
     */
    it('baristaNameが正しく取得できること', () => {
      // Arrange - baristaNameを含むデータを準備
      const data = {
        id: testRecipeId,
        title: 'テストレシピ',
        brewingConditions: testBrewingConditions,
        viewCount: 0,
        isPublished: false,
        createdAt: TEST_CREATED_AT,
        updatedAt: TEST_UPDATED_AT,
        baristaName: 'テストバリスタ',
      };

      // Act - レシピを再構築
      const recipe = Recipe.reconstruct(data);

      // Assert - baristaNameが正しく取得できることを確認
      expect(recipe.baristaName).toBe('テストバリスタ');
      // 不変条件: brewingConditionsの等価性を検証
      expect(recipe.brewingConditions.equals(testBrewingConditions)).toBe(true);
    });

    /**
     * 事前条件: baristaNameが省略されたデータが渡される
     * 事後条件: baristaNameはnullがデフォルト値として設定される
     * 不変条件: brewingConditionsは元のデータと等価
     */
    it('baristaNameが省略された場合、nullがデフォルト値として設定されること', () => {
      // Arrange - baristaNameを省略したデータを準備
      const data = {
        id: testRecipeId,
        title: 'テストレシピ',
        brewingConditions: testBrewingConditions,
        viewCount: 0,
        isPublished: false,
        createdAt: TEST_CREATED_AT,
        updatedAt: TEST_UPDATED_AT,
        // baristaName は省略
      };

      // Act - レシピを再構築
      const recipe = Recipe.reconstruct(data);

      // Assert - baristaNameがnullであることを確認
      expect(recipe.baristaName).toBeNull();
      // 不変条件: brewingConditionsの等価性を検証
      expect(recipe.brewingConditions.equals(testBrewingConditions)).toBe(true);
    });
  });
});
