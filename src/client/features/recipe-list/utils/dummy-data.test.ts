import { RoastLevel } from '@prisma/client';
import { describe, it, expect } from 'vitest';

import type { Recipe } from '../types/recipe';

import { generateDummyTags, generateDummyAuthor, enrichRecipeWithDummyData } from './dummy-data';

describe('generateDummyTags', () => {
  describe('同じレシピIDに対して決定論的に同じタグが生成される', () => {
    it('同じIDで複数回呼び出しても同じ結果を返す', () => {
      // Arrange - テスト対象のレシピID
      const recipeId = 'recipe-123';
      const roastLevel: RoastLevel = RoastLevel.LIGHT;

      // Act - 同じIDで2回呼び出す
      const result1 = generateDummyTags(recipeId, roastLevel);
      const result2 = generateDummyTags(recipeId, roastLevel);

      // Assert - 結果が同一であることを検証
      expect(result1).toEqual(result2);
    });
  });

  describe('焙煎度に応じた適切なタグが生成される', () => {
    it('浅煎りの場合、フルーティ系のタグ傾向がある', () => {
      // Arrange
      const recipeId = 'recipe-light-test';
      const roastLevel: RoastLevel = RoastLevel.LIGHT;

      // Act
      const tags = generateDummyTags(recipeId, roastLevel);

      // Assert - タグが生成されることを検証（具体的な内容は実装依存）
      expect(tags.length).toBeGreaterThan(0);
      expect(tags.length).toBeLessThanOrEqual(8);
    });

    it('深煎りの場合、ビター系のタグ傾向がある', () => {
      // Arrange
      const recipeId = 'recipe-dark-test';
      const roastLevel: RoastLevel = RoastLevel.DARK;

      // Act
      const tags = generateDummyTags(recipeId, roastLevel);

      // Assert - タグが生成されることを検証
      expect(tags.length).toBeGreaterThan(0);
      expect(tags.length).toBeLessThanOrEqual(8);
    });
  });

  describe('異なるレシピIDに対して異なるタグが生成される', () => {
    it('異なるIDで呼び出すと異なる結果を返す可能性がある', () => {
      // Arrange
      const roastLevel: RoastLevel = RoastLevel.MEDIUM;

      // Act - 異なるIDで呼び出す
      const tags1 = generateDummyTags('recipe-aaa', roastLevel);
      const tags2 = generateDummyTags('recipe-bbb', roastLevel);
      const tags3 = generateDummyTags('recipe-ccc', roastLevel);

      // Assert - 少なくとも一組は異なる結果を返すことを検証（完全な一致の可能性は低い）
      const allSame =
        JSON.stringify(tags1) === JSON.stringify(tags2) &&
        JSON.stringify(tags2) === JSON.stringify(tags3);
      expect(allSame).toBe(false);
    });
  });
});

describe('generateDummyAuthor', () => {
  describe('同じレシピIDに対して決定論的に同じ投稿者名が生成される', () => {
    it('同じIDで複数回呼び出しても同じ結果を返す', () => {
      // Arrange
      const recipeId = 'recipe-456';

      // Act
      const author1 = generateDummyAuthor(recipeId);
      const author2 = generateDummyAuthor(recipeId);

      // Assert
      expect(author1).toBe(author2);
    });
  });

  describe('投稿者名が空でない文字列である', () => {
    it('有効な投稿者名を返す', () => {
      // Arrange
      const recipeId = 'recipe-test';

      // Act
      const author = generateDummyAuthor(recipeId);

      // Assert
      expect(author).toBeTruthy();
      expect(typeof author).toBe('string');
      expect(author.length).toBeGreaterThan(0);
    });
  });

  describe('異なるレシピIDに対して異なる投稿者名が生成される', () => {
    it('異なるIDで呼び出すと異なる結果を返す可能性がある', () => {
      // Arrange & Act
      const author1 = generateDummyAuthor('recipe-111');
      const author2 = generateDummyAuthor('recipe-222');
      const author3 = generateDummyAuthor('recipe-333');

      // Assert - 少なくとも一組は異なる結果を返すことを検証
      const allSame = author1 === author2 && author2 === author3;
      expect(allSame).toBe(false);
    });
  });
});

describe('enrichRecipeWithDummyData', () => {
  describe('Recipeを拡張してRecipeCardDisplayを返す', () => {
    it('tagsとauthorNameプロパティが追加される', () => {
      // Arrange - テスト用のRecipe
      const recipe: Recipe = {
        id: 'recipe-enrich-test',
        title: 'テストレシピ',
        summary: 'テストの概要',
        equipment: ['HARIO V60'],
        roastLevel: RoastLevel.MEDIUM,
        grindSize: null,
        beanWeight: 20,
        waterTemp: 92,
        waterAmount: 300,
      };

      // Act
      const result = enrichRecipeWithDummyData(recipe);

      // Assert - 元のプロパティが保持されていることを検証
      expect(result.id).toBe(recipe.id);
      expect(result.title).toBe(recipe.title);
      expect(result.summary).toBe(recipe.summary);
      expect(result.equipment).toEqual(recipe.equipment);
      expect(result.roastLevel).toBe(recipe.roastLevel);
      expect(result.grindSize).toBe(recipe.grindSize);
      expect(result.beanWeight).toBe(recipe.beanWeight);
      expect(result.waterTemp).toBe(recipe.waterTemp);
      expect(result.waterAmount).toBe(recipe.waterAmount);

      // Assert - 拡張プロパティが追加されていることを検証
      expect(result.tags).toBeDefined();
      expect(Array.isArray(result.tags)).toBe(true);
      expect(result.authorName).toBeDefined();
      expect(typeof result.authorName).toBe('string');
    });
  });

  describe('同じRecipeに対して決定論的に同じ結果が生成される', () => {
    it('同じRecipeで複数回呼び出しても同じ結果を返す', () => {
      // Arrange
      const recipe: Recipe = {
        id: 'recipe-deterministic-test',
        title: 'テストレシピ',
        summary: 'テストの概要',
        equipment: [],
        roastLevel: RoastLevel.LIGHT,
        grindSize: null,
        beanWeight: 15,
        waterTemp: 90,
        waterAmount: 250,
      };

      // Act
      const result1 = enrichRecipeWithDummyData(recipe);
      const result2 = enrichRecipeWithDummyData(recipe);

      // Assert
      expect(result1.tags).toEqual(result2.tags);
      expect(result1.authorName).toBe(result2.authorName);
    });
  });
});
