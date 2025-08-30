/**
 * SearchRecipesUseCase テスト
 *
 * TDD Red-Green-Refactorサイクルに従った実用テスト実装
 */

import { describe, it, expect, beforeEach } from 'vitest';

import { Recipe } from '@/server/domain/recipe/entities/recipe';
import { BrewingConditions } from '@/server/domain/recipe/value-objects/BrewingConditions';
import { RecipeId } from '@/server/domain/recipe/value-objects/RecipeId';
import { MemoryRecipeRepository } from '@/server/infrastructure/repositories/MemoryRecipeRepository';

import {
  SearchRecipesUseCase,
  SearchRecipesUseCaseError,
  type SearchRecipesInput,
} from './SearchRecipesUseCase';

const RECIPE_CREATED_AT = new Date('2024-01-01T00:00:00.000Z');
const RECIPE_UPDATED_AT = new Date('2024-01-01T00:00:00.000Z');
const RECIPE_CREATED_AT_2 = new Date('2024-01-02T00:00:00.000Z');
const RECIPE_UPDATED_AT_2 = new Date('2024-01-02T00:00:00.000Z');
const RECIPE_CREATED_AT_3 = new Date('2024-01-03T00:00:00.000Z');
const RECIPE_UPDATED_AT_3 = new Date('2024-01-03T00:00:00.000Z');

describe('SearchRecipesUseCase', () => {
  let useCase: SearchRecipesUseCase;
  let repository: MemoryRecipeRepository;

  beforeEach(() => {
    // Arrange - 準備：リポジトリとユースケースのセットアップ
    repository = new MemoryRecipeRepository();
    useCase = new SearchRecipesUseCase(repository);
    repository.clear();
  });

  describe('基本検索テスト', () => {
    it('基本パラメータで公開レシピを検索できること', async () => {
      // Arrange - 準備：公開・非公開レシピを混在させる
      const publicRecipe1 = Recipe.reconstruct({
        id: RecipeId.fromString('1'),
        title: 'Public Recipe 1',
        brewingConditions: BrewingConditions.create({ roastLevel: 'MEDIUM' }),
        viewCount: 100,
        isPublished: true,
        createdAt: RECIPE_CREATED_AT,
        updatedAt: RECIPE_UPDATED_AT,
      });

      const publicRecipe2 = Recipe.reconstruct({
        id: RecipeId.fromString('2'),
        title: 'Public Recipe 2',
        brewingConditions: BrewingConditions.create({ roastLevel: 'LIGHT' }),
        viewCount: 50,
        isPublished: true,
        createdAt: RECIPE_CREATED_AT_2,
        updatedAt: RECIPE_UPDATED_AT_2,
      });

      const privateRecipe = Recipe.reconstruct({
        id: RecipeId.fromString('3'),
        title: 'Private Recipe',
        brewingConditions: BrewingConditions.create({ roastLevel: 'DARK' }),
        viewCount: 10,
        isPublished: false, // 非公開
        createdAt: RECIPE_CREATED_AT_3,
        updatedAt: RECIPE_UPDATED_AT_3,
      });

      repository.add(publicRecipe1);
      repository.add(publicRecipe2);
      repository.add(privateRecipe);

      const input: SearchRecipesInput = {
        page: 1,
        limit: 10,
      };

      // Act - 実行：ユースケースの実行
      const result = await useCase.execute(input);

      // Assert - 確認：公開レシピのみが返されることを確認
      expect(result.recipes).toHaveLength(2);
      expect(result.recipes.every((recipe) => recipe.isPublished)).toBe(true);
      expect(result.pagination.totalItems).toBe(2);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('テキスト検索で該当レシピが取得できること', async () => {
      // Arrange - 準備：タイトルに特定キーワードを含むレシピを作成
      const coffeeRecipe = Recipe.reconstruct({
        id: RecipeId.fromString('1'),
        title: 'Ethiopian Coffee Recipe',
        summary: 'A premium Ethiopian bean recipe',
        brewingConditions: BrewingConditions.create({ roastLevel: 'LIGHT' }),
        viewCount: 200,
        isPublished: true,
        createdAt: RECIPE_CREATED_AT,
        updatedAt: RECIPE_UPDATED_AT,
      });

      const espressoRecipe = Recipe.reconstruct({
        id: RecipeId.fromString('2'),
        title: 'Espresso Blend',
        summary: 'Perfect espresso blend',
        brewingConditions: BrewingConditions.create({ roastLevel: 'DARK' }),
        viewCount: 150,
        isPublished: true,
        createdAt: RECIPE_CREATED_AT,
        updatedAt: RECIPE_UPDATED_AT,
      });

      const teaRecipe = Recipe.reconstruct({
        id: RecipeId.fromString('3'),
        title: 'Green Tea Recipe',
        brewingConditions: BrewingConditions.create({ roastLevel: 'LIGHT' }),
        viewCount: 100,
        isPublished: true,
        createdAt: RECIPE_CREATED_AT,
        updatedAt: RECIPE_UPDATED_AT,
      });

      repository.add(coffeeRecipe);
      repository.add(espressoRecipe);
      repository.add(teaRecipe);

      const input: SearchRecipesInput = {
        page: 1,
        limit: 10,
        search: 'Ethiopian',
      };

      // Act - 実行：ユースケースの実行
      const result = await useCase.execute(input);

      // Assert - 確認：検索キーワードに該当するレシピのみが返されることを確認
      expect(result.recipes).toHaveLength(1);
      expect(result.recipes[0].title).toBe('Ethiopian Coffee Recipe');
      expect(result.pagination.totalItems).toBe(1);
    });

    it('フィルター条件で絞り込み検索ができること', async () => {
      // Arrange - 準備：異なる焙煎度のレシピを作成
      const lightRoast = Recipe.reconstruct({
        id: RecipeId.fromString('1'),
        title: 'Light Roast Recipe',
        brewingConditions: BrewingConditions.create({
          roastLevel: 'LIGHT',
          grindSize: 'MEDIUM',
          beanWeight: 15,
          waterAmount: 250,
        }),
        viewCount: 100,
        isPublished: true,
        createdAt: RECIPE_CREATED_AT,
        updatedAt: RECIPE_UPDATED_AT,
      });

      const mediumRoast = Recipe.reconstruct({
        id: RecipeId.fromString('2'),
        title: 'Medium Roast Recipe',
        brewingConditions: BrewingConditions.create({
          roastLevel: 'MEDIUM',
          grindSize: 'FINE',
          beanWeight: 20,
          waterAmount: 300,
        }),
        viewCount: 150,
        isPublished: true,
        createdAt: RECIPE_CREATED_AT,
        updatedAt: RECIPE_UPDATED_AT,
      });

      const darkRoast = Recipe.reconstruct({
        id: RecipeId.fromString('3'),
        title: 'Dark Roast Recipe',
        brewingConditions: BrewingConditions.create({
          roastLevel: 'DARK',
          grindSize: 'COARSE',
          beanWeight: 18,
          waterAmount: 280,
        }),
        viewCount: 120,
        isPublished: true,
        createdAt: RECIPE_CREATED_AT,
        updatedAt: RECIPE_UPDATED_AT,
      });

      repository.add(lightRoast);
      repository.add(mediumRoast);
      repository.add(darkRoast);

      const input: SearchRecipesInput = {
        page: 1,
        limit: 10,
        roastLevel: ['LIGHT', 'MEDIUM'],
        grindSize: ['MEDIUM'],
        beanWeight: { min: 10, max: 20 },
      };

      // Act - 実行：ユースケースの実行
      const result = await useCase.execute(input);

      // Assert - 確認：フィルター条件に該当するレシピのみが返されることを確認
      expect(result.recipes).toHaveLength(1);
      expect(result.recipes[0].title).toBe('Light Roast Recipe');
      expect(result.recipes[0].brewingConditions.roastLevel).toBe('LIGHT');
      expect(result.recipes[0].brewingConditions.grindSize).toBe('MEDIUM');
    });
  });

  describe('パラメータバリデーションテスト', () => {
    it('ページ番号が0以下の場合にINVALID_PARAMSエラーが発生すること', async () => {
      // Arrange - 準備：無効なページ番号
      const invalidInputs: SearchRecipesInput[] = [
        { page: 0, limit: 10 },
        { page: -1, limit: 10 },
        { page: -100, limit: 10 },
      ];

      // Act & Assert - 実行と確認：各無効入力でエラーが発生することを確認
      for (const input of invalidInputs) {
        await expect(useCase.execute(input)).rejects.toThrow(SearchRecipesUseCaseError);
        await expect(useCase.execute(input)).rejects.toThrow(
          'ページ番号は1以上である必要があります'
        );

        try {
          await useCase.execute(input);
        } catch (error) {
          expect(error).toBeInstanceOf(SearchRecipesUseCaseError);
          if (error instanceof SearchRecipesUseCaseError) {
            expect(error.code).toBe('INVALID_PARAMS');
            expect(error.statusCode).toBe(400);
          }
        }
      }
    });

    it('取得件数が範囲外の場合にINVALID_PARAMSエラーが発生すること', async () => {
      // Arrange - 準備：無効な取得件数
      const invalidInputs: SearchRecipesInput[] = [
        { page: 1, limit: 0 },
        { page: 1, limit: -1 },
        { page: 1, limit: 101 },
        { page: 1, limit: 1000 },
      ];

      // Act & Assert - 実行と確認：各無効入力でエラーが発生することを確認
      for (const input of invalidInputs) {
        await expect(useCase.execute(input)).rejects.toThrow(SearchRecipesUseCaseError);
        await expect(useCase.execute(input)).rejects.toThrow(
          '取得件数は1から100の間で指定してください'
        );

        try {
          await useCase.execute(input);
        } catch (error) {
          expect(error).toBeInstanceOf(SearchRecipesUseCaseError);
          if (error instanceof SearchRecipesUseCaseError) {
            expect(error.code).toBe('INVALID_PARAMS');
            expect(error.statusCode).toBe(400);
          }
        }
      }
    });

    it('範囲フィルターが無効な場合にINVALID_PARAMSエラーが発生すること', async () => {
      // Arrange - 準備：無効な範囲フィルター
      const invalidInputs: SearchRecipesInput[] = [
        {
          page: 1,
          limit: 10,
          beanWeight: { min: -5, max: 20 }, // 負の最小値
        },
        {
          page: 1,
          limit: 10,
          waterTemp: { min: 90, max: -10 }, // 負の最大値
        },
        {
          page: 1,
          limit: 10,
          waterAmount: { min: 300, max: 200 }, // 最小値 > 最大値
        },
      ];

      // Act & Assert - 実行と確認：各無効入力でエラーが発生することを確認
      for (const input of invalidInputs) {
        await expect(useCase.execute(input)).rejects.toThrow(SearchRecipesUseCaseError);

        try {
          await useCase.execute(input);
        } catch (error) {
          expect(error).toBeInstanceOf(SearchRecipesUseCaseError);
          if (error instanceof SearchRecipesUseCaseError) {
            expect(error.code).toBe('INVALID_PARAMS');
            expect(error.statusCode).toBe(400);
          }
        }
      }
    });
  });

  describe('データ変換テスト', () => {
    it('外部入力が正しくドメイン検索条件に変換されること', async () => {
      // Arrange - 準備：テスト用レシピを作成
      const testRecipe = Recipe.reconstruct({
        id: RecipeId.fromString('1'),
        title: 'Test Recipe',
        brewingConditions: BrewingConditions.create({
          roastLevel: 'MEDIUM',
          grindSize: 'MEDIUM',
          beanWeight: 15,
          waterTemp: 92,
          waterAmount: 250,
        }),
        equipmentIds: ['drip-01', 'filter-02'],
        viewCount: 100,
        isPublished: true,
        createdAt: RECIPE_CREATED_AT,
        updatedAt: RECIPE_UPDATED_AT,
      });

      repository.add(testRecipe);

      const input: SearchRecipesInput = {
        page: 1,
        limit: 5,
        search: 'Test',
        roastLevel: ['MEDIUM'],
        grindSize: ['MEDIUM'],
        equipment: ['drip-01', 'filter-02'],
        equipmentType: ['dripper', 'filter'],
        beanWeight: { min: 10, max: 20 },
        waterTemp: { min: 85, max: 95 },
        waterAmount: { min: 200, max: 300 },
        sort: 'viewCount',
        order: 'desc',
      };

      // Act - 実行：ユースケースの実行
      const result = await useCase.execute(input);

      // Assert - 確認：変換が正しく行われ、結果が期待通りであることを確認
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.itemsPerPage).toBe(5);
      // 実際のフィルタリングロジックは MemoryRecipeRepository で実装済み
      expect(result.recipes).toHaveLength(1);
      expect(result.recipes[0].title).toBe('Test Recipe');
    });

    it('空の検索条件でも正常に動作すること', async () => {
      // Arrange - 準備：複数のレシピを作成
      for (let i = 1; i <= 5; i++) {
        const recipe = Recipe.reconstruct({
          id: RecipeId.fromString(i.toString()),
          title: `Recipe ${i}`,
          brewingConditions: BrewingConditions.create({ roastLevel: 'MEDIUM' }),
          viewCount: i * 10,
          isPublished: true,
          createdAt: RECIPE_CREATED_AT,
          updatedAt: RECIPE_UPDATED_AT,
        });
        repository.add(recipe);
      }

      const input: SearchRecipesInput = {
        page: 1,
        limit: 10,
        // その他のフィルター条件は未指定
      };

      // Act - 実行：ユースケースの実行
      const result = await useCase.execute(input);

      // Assert - 確認：全ての公開レシピが返されることを確認
      expect(result.recipes).toHaveLength(5);
      expect(result.pagination.totalItems).toBe(5);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });
  });

  describe('ページネーションテスト', () => {
    beforeEach(() => {
      // Arrange - 準備：20個のテストレシピを作成
      for (let i = 1; i <= 20; i++) {
        const recipe = Recipe.reconstruct({
          id: RecipeId.fromString(i.toString()),
          title: `Recipe ${i.toString().padStart(2, '0')}`,
          brewingConditions: BrewingConditions.create({ roastLevel: 'MEDIUM' }),
          viewCount: i,
          isPublished: true,
          createdAt: RECIPE_CREATED_AT,
          updatedAt: RECIPE_UPDATED_AT,
        });
        repository.add(recipe);
      }
    });

    it('1ページ目が正しく取得できること', async () => {
      // Act - 実行：1ページ目を取得
      const result = await useCase.execute({
        page: 1,
        limit: 10,
      });

      // Assert - 確認：ページネーション情報が正しいことを確認
      expect(result.recipes).toHaveLength(10);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.totalItems).toBe(20);
      expect(result.pagination.itemsPerPage).toBe(10);
    });

    it('2ページ目が正しく取得できること', async () => {
      // Act - 実行：2ページ目を取得
      const result = await useCase.execute({
        page: 2,
        limit: 10,
      });

      // Assert - 確認：2ページ目の内容が正しいことを確認
      expect(result.recipes).toHaveLength(10);
      expect(result.pagination.currentPage).toBe(2);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.totalItems).toBe(20);
    });

    it('存在しないページを指定した場合に空の結果が返されること', async () => {
      // Act - 実行：存在しない3ページ目を取得
      const result = await useCase.execute({
        page: 3,
        limit: 10,
      });

      // Assert - 確認：空の結果が返されることを確認
      expect(result.recipes).toHaveLength(0);
      expect(result.pagination.currentPage).toBe(3);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.totalItems).toBe(20);
    });
  });

  describe('ソート機能テスト', () => {
    beforeEach(() => {
      // Arrange - 準備：異なるビューカウント・作成日のレシピを作成
      const recipes = [
        { id: '1', title: 'Recipe A', viewCount: 100, createdAt: '2023-01-01' },
        { id: '2', title: 'Recipe B', viewCount: 300, createdAt: '2023-01-03' },
        { id: '3', title: 'Recipe C', viewCount: 200, createdAt: '2023-01-02' },
      ];

      recipes.forEach((data) => {
        const recipe = Recipe.reconstruct({
          id: RecipeId.fromString(data.id),
          title: data.title,
          brewingConditions: BrewingConditions.create({ roastLevel: 'MEDIUM' }),
          viewCount: data.viewCount,
          isPublished: true,
          createdAt: new Date(data.createdAt),
          updatedAt: RECIPE_UPDATED_AT,
        });
        repository.add(recipe);
      });
    });

    it('ビューカウント降順でソートできること', async () => {
      // Act - 実行：ビューカウント降順でソート
      const result = await useCase.execute({
        page: 1,
        limit: 10,
        sort: 'viewCount',
        order: 'desc',
      });

      // Assert - 確認：ビューカウント降順に並んでいることを確認
      expect(result.recipes).toHaveLength(3);
      expect(result.recipes[0].title).toBe('Recipe B'); // 300 views
      expect(result.recipes[1].title).toBe('Recipe C'); // 200 views
      expect(result.recipes[2].title).toBe('Recipe A'); // 100 views
    });

    it('作成日昇順でソートできること', async () => {
      // Act - 実行：作成日昇順でソート
      const result = await useCase.execute({
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'asc',
      });

      // Assert - 確認：作成日昇順に並んでいることを確認
      expect(result.recipes).toHaveLength(3);
      expect(result.recipes[0].title).toBe('Recipe A'); // 2023-01-01
      expect(result.recipes[1].title).toBe('Recipe C'); // 2023-01-02
      expect(result.recipes[2].title).toBe('Recipe B'); // 2023-01-03
    });
  });
});
