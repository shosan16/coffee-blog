import { describe, it, expect, beforeEach } from 'vitest';

import { BrewingConditions } from '../../value-objects/BrewingConditions';
import { RecipeId } from '../../value-objects/RecipeId';

import { Recipe } from './Recipe.entity';
import type { RecipeStep } from './Recipe.types';

describe('Recipe Entity', () => {
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
      brewingTime: 240,
    });
  });

  describe('reconstruct()', () => {
    it('既存データからレシピを再構築できること', () => {
      // Arrange - 再構築用のデータを準備
      const data = {
        id: testRecipeId,
        title: '再構築レシピ',
        summary: '再構築用の概要',
        remarks: '再構築用の備考',
        brewingConditions: testBrewingConditions,
        viewCount: 100,
        isPublished: true,
        publishedAt: new Date('2025-01-01'),
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2025-01-01'),
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
      expect(recipe.publishedAt).toEqual(new Date('2025-01-01'));
      expect(recipe.createdAt).toEqual(new Date('2024-12-01'));
      expect(recipe.updatedAt).toEqual(new Date('2025-01-01'));
      expect(recipe.baristaId).toBe('barista-1');
      expect(recipe.steps).toHaveLength(1);
      expect(recipe.equipmentIds).toHaveLength(1);
      expect(recipe.tagIds).toHaveLength(1);
    });
  });
});
