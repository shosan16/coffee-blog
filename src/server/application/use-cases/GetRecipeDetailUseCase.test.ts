/**
 * GetRecipeDetailUseCase テスト
 *
 * TDD Red-Green-Refactorサイクルに従った実用テスト実装
 */

import { describe, it, expect, beforeEach } from 'vitest';

import {
  GetRecipeDetailUseCase,
  RecipeDetailUseCaseError,
  type GetRecipeDetailResult,
} from './GetRecipeDetailUseCase';
import { MemoryRecipeRepository } from '@/server/infrastructure/repositories/MemoryRecipeRepository';
import { Recipe } from '@/server/domain/recipe/entities/recipe';
import { RecipeId } from '@/server/domain/recipe/value-objects/RecipeId';
import { BrewingConditions } from '@/server/domain/recipe/value-objects/BrewingConditions';

describe('GetRecipeDetailUseCase', () => {
  let useCase: GetRecipeDetailUseCase;
  let repository: MemoryRecipeRepository;

  beforeEach(() => {
    // Arrange - 準備：リポジトリとユースケースのセットアップ
    repository = new MemoryRecipeRepository();
    useCase = new GetRecipeDetailUseCase(repository);
    repository.clear();
  });

  describe('正常系テスト', () => {
    it('公開レシピが正常に取得できること', async () => {
      // Arrange - 準備：公開レシピをリポジトリに追加
      const recipeId = RecipeId.fromString('1');
      const brewingConditions = BrewingConditions.create({
        roastLevel: 'MEDIUM',
        grindSize: 'MEDIUM',
        beanWeight: 15,
        waterAmount: 250,
        waterTemp: 92,
        brewingTime: 240,
      });

      const publishedRecipe = Recipe.reconstruct({
        id: recipeId,
        title: 'Test Recipe',
        summary: 'Test summary',
        brewingConditions,
        viewCount: 100,
        isPublished: true,
        publishedAt: new Date('2023-01-01'),
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        baristaId: 'barista-1',
      });

      repository.add(publishedRecipe);

      // Act - 実行：ユースケースの実行
      const result: GetRecipeDetailResult = await useCase.execute('1');

      // Assert - 確認：結果の検証
      expect(result.recipe).toBeDefined();
      expect(result.recipe.id.value).toBe('1');
      expect(result.recipe.title).toBe('Test Recipe');
      expect(result.recipe.isPublished).toBe(true);
      expect(result.newViewCount).toBe(101); // ビューカウント増加を確認
    });

    it('ビューカウントが正常に増加すること', async () => {
      // Arrange - 準備：ビューカウント500のレシピを作成
      const recipeId = RecipeId.fromString('2');
      const brewingConditions = BrewingConditions.create({ roastLevel: 'LIGHT' });

      const recipe = Recipe.reconstruct({
        id: recipeId,
        title: 'High View Recipe',
        brewingConditions,
        viewCount: 500,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      repository.add(recipe);

      // Act - 実行：ユースケースの実行
      const result = await useCase.execute('2');

      // Assert - 確認：ビューカウント増加の検証
      expect(result.newViewCount).toBe(501);
      expect(result.recipe.viewCount).toBe(500); // 元のエンティティは変更されない
    });
  });

  describe('異常系テスト', () => {
    it('存在しないレシピIDの場合にRECIPE_NOT_FOUNDエラーが発生すること', async () => {
      // Arrange - 準備：空のリポジトリ

      // Act & Assert - 実行と確認：エラーが発生することを確認
      await expect(useCase.execute('999')).rejects.toThrow(RecipeDetailUseCaseError);
      await expect(useCase.execute('999')).rejects.toThrow('レシピが見つかりません');

      try {
        await useCase.execute('999');
      } catch (error) {
        expect(error).toBeInstanceOf(RecipeDetailUseCaseError);
        if (error instanceof RecipeDetailUseCaseError) {
          expect(error.code).toBe('RECIPE_NOT_FOUND');
          expect(error.statusCode).toBe(404);
        }
      }
    });

    it('非公開レシピの場合にRECIPE_NOT_PUBLISHEDエラーが発生すること', async () => {
      // Arrange - 準備：非公開レシピをリポジトリに追加
      const recipeId = RecipeId.fromString('3');
      const brewingConditions = BrewingConditions.create({ roastLevel: 'DARK' });

      const unpublishedRecipe = Recipe.reconstruct({
        id: recipeId,
        title: 'Unpublished Recipe',
        brewingConditions,
        viewCount: 0,
        isPublished: false, // 非公開
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      repository.add(unpublishedRecipe);

      // Act & Assert - 実行と確認：エラーが発生することを確認
      await expect(useCase.execute('3')).rejects.toThrow(RecipeDetailUseCaseError);
      await expect(useCase.execute('3')).rejects.toThrow('このレシピは公開されていません');

      try {
        await useCase.execute('3');
      } catch (error) {
        expect(error).toBeInstanceOf(RecipeDetailUseCaseError);
        if (error instanceof RecipeDetailUseCaseError) {
          expect(error.code).toBe('RECIPE_NOT_PUBLISHED');
          expect(error.statusCode).toBe(403);
        }
      }
    });

    it('無効なIDの場合にINVALID_IDエラーが発生すること', async () => {
      // Arrange - 準備：無効なIDパターン
      const invalidIds = ['', '0', '-1', 'abc', '1.5', ' ', 'null', 'undefined'];

      // Act & Assert - 実行と確認：各無効IDでエラーが発生することを確認
      for (const invalidId of invalidIds) {
        await expect(useCase.execute(invalidId)).rejects.toThrow(RecipeDetailUseCaseError);

        try {
          await useCase.execute(invalidId);
        } catch (error) {
          expect(error).toBeInstanceOf(RecipeDetailUseCaseError);
          if (error instanceof RecipeDetailUseCaseError) {
            expect(error.code).toBe('INVALID_ID');
            expect(error.statusCode).toBe(400);
          }
        }
      }
    });
  });

  describe('エッジケーステスト', () => {
    it('境界値のレシピIDが正常に処理されること', async () => {
      // Arrange - 準備：境界値のIDでレシピ作成
      const edgeIds = ['1', '999999999']; // 最小値と大きな値

      for (const idValue of edgeIds) {
        const recipeId = RecipeId.fromString(idValue);
        const brewingConditions = BrewingConditions.create({ roastLevel: 'MEDIUM' });

        const recipe = Recipe.reconstruct({
          id: recipeId,
          title: `Edge Case Recipe ${idValue}`,
          brewingConditions,
          viewCount: 0,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        repository.add(recipe);

        // Act - 実行：ユースケースの実行
        const result = await useCase.execute(idValue);

        // Assert - 確認：結果の検証
        expect(result.recipe.id.value).toBe(idValue);
        expect(result.newViewCount).toBe(1);
      }
    });

    it('高いビューカウントが正常に処理されること', async () => {
      // Arrange - 準備：高いビューカウントのレシピ
      const recipeId = RecipeId.fromString('4');
      const brewingConditions = BrewingConditions.create({ roastLevel: 'FRENCH' });

      const highViewRecipe = Recipe.reconstruct({
        id: recipeId,
        title: 'Popular Recipe',
        brewingConditions,
        viewCount: 999999, // 高いビューカウント
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      repository.add(highViewRecipe);

      // Act - 実行：ユースケースの実行
      const result = await useCase.execute('4');

      // Assert - 確認：ビューカウント増加の検証
      expect(result.newViewCount).toBe(1000000);
      expect(result.recipe.viewCount).toBe(999999);
    });

    it('最小限の情報でレシピが正常に処理されること', async () => {
      // Arrange - 準備：最小限の情報のレシピ
      const recipeId = RecipeId.fromString('5');
      const brewingConditions = BrewingConditions.create({ roastLevel: 'LIGHT_MEDIUM' });

      const minimalRecipe = Recipe.reconstruct({
        id: recipeId,
        title: 'Minimal Recipe',
        brewingConditions,
        viewCount: 0,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        // オプショナルなフィールドはundefined
      });

      repository.add(minimalRecipe);

      // Act - 実行：ユースケースの実行
      const result = await useCase.execute('5');

      // Assert - 確認：結果の検証
      expect(result.recipe.title).toBe('Minimal Recipe');
      expect(result.recipe.summary).toBeUndefined();
      expect(result.recipe.remarks).toBeUndefined();
      expect(result.recipe.baristaId).toBeUndefined();
      expect(result.newViewCount).toBe(1);
    });
  });
});
