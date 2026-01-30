import { RoastLevel } from '@prisma/client';
import { describe, it, expect, beforeEach } from 'vitest';

import { Recipe, type RecipeStep } from '@/server/domain/recipe/entities/recipe';
import type { RecipeSearchCriteria } from '@/server/domain/recipe/repositories/IRecipeRepository';
import { BrewingConditions } from '@/server/domain/recipe/value-objects/BrewingConditions';
import { RecipeId } from '@/server/domain/recipe/value-objects/RecipeId';

import { MemoryRecipeRepository } from './MemoryRecipeRepository';

// 日付定数をファクトリー関数として定義してテスト分離を強化
const getTestDates = (): {
  RECIPE_CREATED_AT: Date;
  RECIPE_UPDATED_AT: Date;
  RECIPE_PUBLISHED_AT: Date;
} => ({
  RECIPE_CREATED_AT: new Date('2024-01-01T00:00:00.000Z'),
  RECIPE_UPDATED_AT: new Date('2024-01-02T00:00:00.000Z'),
  RECIPE_PUBLISHED_AT: new Date('2024-01-03T00:00:00.000Z'),
});

describe('MemoryRecipeRepository', () => {
  let repository: MemoryRecipeRepository;
  let testRecipe: Recipe;

  beforeEach(() => {
    // Arrange - 各テストでリポジトリを初期化
    repository = new MemoryRecipeRepository();

    // テスト独立性を保つため、各テストで新しい日付オブジェクトを取得
    const dates = getTestDates();

    // テスト用のレシピエンティティを作成
    const recipeId = RecipeId.fromString('1');
    const brewingConditions = BrewingConditions.create({
      roastLevel: RoastLevel.MEDIUM,
    });

    const steps: RecipeStep[] = [
      {
        stepOrder: 1,
        description: 'お湯を沸かす',
        timeSeconds: 60,
      },
      {
        stepOrder: 2,
        description: 'コーヒーを挽く',
        timeSeconds: 30,
      },
    ];

    testRecipe = Recipe.reconstruct({
      id: recipeId,
      title: 'テストレシピ',
      summary: 'テスト用の概要',
      remarks: 'テスト用の備考',
      brewingConditions,
      baristaId: '1',
      viewCount: 0,
      isPublished: false,
      publishedAt: undefined,
      createdAt: dates.RECIPE_CREATED_AT,
      updatedAt: dates.RECIPE_UPDATED_AT,
      steps,
      equipmentIds: ['1', '2'],
      tagIds: ['1'],
    });
  });

  describe('findById()', () => {
    it('IDによるレシピ取得が正しく動作すること', async () => {
      // Arrange - リポジトリにレシピを追加
      repository.add(testRecipe);

      // Act - IDでレシピを取得
      const result = await repository.findById(testRecipe.id);

      // Assert - 正しいレシピが取得されることを確認
      expect(result).not.toBeNull();
      expect(result?.id.equals(testRecipe.id)).toBe(true);
      expect(result?.title).toBe(testRecipe.title);
    });

    it('存在しないIDの場合nullが返されること', async () => {
      // Arrange - 空のリポジトリ

      // Act - 存在しないIDでレシピを取得
      const result = await repository.findById(RecipeId.fromString('999'));

      // Assert - nullが返されることを確認
      expect(result).toBeNull();
    });
  });

  describe('findPublishedById()', () => {
    it('公開済みレシピのみ取得できること', async () => {
      // Arrange - 公開済みレシピを作成
      const dates = getTestDates();
      const publishedRecipe = Recipe.reconstruct({
        id: testRecipe.id,
        title: testRecipe.title,
        summary: testRecipe.summary,
        remarks: testRecipe.remarks,
        brewingConditions: testRecipe.brewingConditions,
        baristaId: testRecipe.baristaId,
        viewCount: 0,
        isPublished: true,
        publishedAt: dates.RECIPE_PUBLISHED_AT,
        createdAt: dates.RECIPE_CREATED_AT,
        updatedAt: dates.RECIPE_UPDATED_AT,
        steps: [
          {
            stepOrder: 1,
            description: 'ステップ1',
          },
        ],
        equipmentIds: [...testRecipe.equipmentIds],
        tagIds: [...testRecipe.tagIds],
      });
      repository.add(publishedRecipe);

      // Act - 公開レシピを取得
      const result = await repository.findPublishedById(publishedRecipe.id);

      // Assert - 公開レシピが取得されることを確認
      expect(result).not.toBeNull();
      expect(result?.isPublished).toBe(true);
    });

    it('非公開レシピの場合nullが返されること', async () => {
      // Arrange - 非公開レシピを追加
      repository.add(testRecipe);

      // Act - 非公開レシピを取得
      const result = await repository.findPublishedById(testRecipe.id);

      // Assert - nullが返されることを確認
      expect(result).toBeNull();
    });
  });

  describe('search()', () => {
    beforeEach(() => {
      // Arrange - 複数のテストレシピを追加
      const dates = getTestDates();
      const recipe1 = Recipe.reconstruct({
        id: RecipeId.fromString('1'),
        title: 'エスプレッソレシピ',
        summary: 'エスプレッソの作り方',
        brewingConditions: BrewingConditions.create({
          roastLevel: RoastLevel.DARK,
        }),
        baristaId: '1',
        viewCount: 0,
        isPublished: true,
        publishedAt: dates.RECIPE_PUBLISHED_AT,
        createdAt: dates.RECIPE_CREATED_AT,
        updatedAt: dates.RECIPE_UPDATED_AT,
        steps: [{ stepOrder: 1, description: 'ステップ1' }],
        equipmentIds: [],
        tagIds: [],
      });

      const recipe2 = Recipe.reconstruct({
        id: RecipeId.fromString('2'),
        title: 'ドリップコーヒーレシピ',
        summary: 'ハンドドリップの作り方',
        brewingConditions: BrewingConditions.create({
          roastLevel: RoastLevel.MEDIUM,
        }),
        baristaId: '2',
        viewCount: 0,
        isPublished: true,
        publishedAt: dates.RECIPE_PUBLISHED_AT,
        createdAt: dates.RECIPE_CREATED_AT,
        updatedAt: dates.RECIPE_UPDATED_AT,
        steps: [{ stepOrder: 1, description: 'ステップ1' }],
        equipmentIds: [],
        tagIds: [],
      });

      repository.add(recipe1);
      repository.add(recipe2);
    });

    it('基本的な検索が正しく動作すること', async () => {
      // Arrange - 検索条件を準備
      const criteria: RecipeSearchCriteria = {
        page: 1,
        limit: 10,
      };

      // Act - 検索を実行
      const result = await repository.search(criteria);

      // Assert - 検索結果を確認
      expect(result.recipes).toHaveLength(2);
      expect(result.pagination.totalItems).toBe(2);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('テキスト検索が正しく動作すること', async () => {
      // Arrange - テキスト検索条件を準備
      const criteria: RecipeSearchCriteria = {
        searchTerm: 'エスプレッソ',
        page: 1,
        limit: 10,
      };

      // Act - 検索を実行
      const result = await repository.search(criteria);

      // Assert - 検索結果を確認
      expect(result.recipes).toHaveLength(1);
      expect(result.recipes[0].title).toBe('エスプレッソレシピ');
    });

    it('焙煎度フィルターが正しく動作すること', async () => {
      // Arrange - 焙煎度フィルターを準備
      const criteria: RecipeSearchCriteria = {
        roastLevel: [RoastLevel.DARK],
        page: 1,
        limit: 10,
      };

      // Act - 検索を実行
      const result = await repository.search(criteria);

      // Assert - 検索結果を確認
      expect(result.recipes).toHaveLength(1);
      expect(result.recipes[0].brewingConditions.roastLevel).toBe(RoastLevel.DARK);
    });

    it('バリスタフィルターが正しく動作すること', async () => {
      // Arrange - バリスタフィルターを準備
      const criteria: RecipeSearchCriteria = {
        baristaId: '1',
        page: 1,
        limit: 10,
      };

      // Act - 検索を実行
      const result = await repository.search(criteria);

      // Assert - 検索結果を確認
      expect(result.recipes).toHaveLength(1);
      expect(result.recipes[0].baristaId).toBe('1');
    });

    it('公開状態フィルターが正しく動作すること', async () => {
      // Arrange - 公開状態フィルターを準備
      const criteria: RecipeSearchCriteria = {
        isPublished: true,
        page: 1,
        limit: 10,
      };

      // Act - 検索を実行
      const result = await repository.search(criteria);

      // Assert - 検索結果を確認
      expect(result.recipes).toHaveLength(2);
      expect(result.recipes.every((recipe) => recipe.isPublished)).toBe(true);
    });

    it('ページネーションが正しく動作すること', async () => {
      // Arrange - ページネーション条件を準備
      const criteria: RecipeSearchCriteria = {
        page: 1,
        limit: 1,
      };

      // Act - 検索を実行
      const result = await repository.search(criteria);

      // Assert - ページネーション結果を確認
      expect(result.recipes).toHaveLength(1);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.totalItems).toBe(2);
      expect(result.pagination.itemsPerPage).toBe(1);
    });

    it('ソート機能が正しく動作すること', async () => {
      // Arrange - タイトルでソートする条件を準備
      const criteria: RecipeSearchCriteria = {
        sortBy: 'title',
        sortOrder: 'asc',
        page: 1,
        limit: 10,
      };

      // Act - 検索を実行
      const result = await repository.search(criteria);

      // Assert - ソート結果を確認
      expect(result.recipes).toHaveLength(2);
      expect(result.recipes[0].title).toBe('エスプレッソレシピ');
      expect(result.recipes[1].title).toBe('ドリップコーヒーレシピ');
    });
  });

  describe('findPublishedRecipes()', () => {
    it('公開レシピのみ取得できること', async () => {
      // Arrange - 公開・非公開のレシピを準備
      const dates = getTestDates();
      const publishedRecipe = Recipe.reconstruct({
        id: RecipeId.fromString('1'),
        title: '公開レシピ',
        brewingConditions: BrewingConditions.create({
          roastLevel: RoastLevel.MEDIUM,
        }),
        viewCount: 0,
        isPublished: true,
        publishedAt: dates.RECIPE_PUBLISHED_AT,
        createdAt: dates.RECIPE_CREATED_AT,
        updatedAt: dates.RECIPE_UPDATED_AT,
        steps: [{ stepOrder: 1, description: 'ステップ1' }],
        equipmentIds: [],
        tagIds: [],
      });

      const unpublishedRecipe = Recipe.reconstruct({
        id: RecipeId.fromString('2'),
        title: '非公開レシピ',
        brewingConditions: BrewingConditions.create({
          roastLevel: RoastLevel.MEDIUM,
        }),
        viewCount: 0,
        isPublished: false,
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [],
        equipmentIds: [],
        tagIds: [],
      });

      repository.add(publishedRecipe);
      repository.add(unpublishedRecipe);

      // Act - 公開レシピを検索
      const result = await repository.findPublishedRecipes({
        page: 1,
        limit: 10,
      });

      // Assert - 公開レシピのみ取得されることを確認
      expect(result.recipes).toHaveLength(1);
      expect(result.recipes[0].title).toBe('公開レシピ');
      expect(result.recipes[0].isPublished).toBe(true);
    });
  });

  describe('findByBarista()', () => {
    it('特定のバリスタのレシピのみ取得できること', async () => {
      // Arrange - 異なるバリスタのレシピを準備
      const barista1Recipe = Recipe.reconstruct({
        id: RecipeId.fromString('1'),
        title: 'バリスタ1のレシピ',
        brewingConditions: BrewingConditions.create({
          roastLevel: RoastLevel.MEDIUM,
        }),
        baristaId: '1',
        viewCount: 0,
        isPublished: false,
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [],
        equipmentIds: [],
        tagIds: [],
      });

      const barista2Recipe = Recipe.reconstruct({
        id: RecipeId.fromString('2'),
        title: 'バリスタ2のレシピ',
        brewingConditions: BrewingConditions.create({
          roastLevel: RoastLevel.MEDIUM,
        }),
        baristaId: '2',
        viewCount: 0,
        isPublished: false,
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [],
        equipmentIds: [],
        tagIds: [],
      });

      repository.add(barista1Recipe);
      repository.add(barista2Recipe);

      // Act - バリスタ1のレシピを検索
      const result = await repository.findByBarista('1', {
        page: 1,
        limit: 10,
      });

      // Assert - バリスタ1のレシピのみ取得されることを確認
      expect(result.recipes).toHaveLength(1);
      expect(result.recipes[0].title).toBe('バリスタ1のレシピ');
      expect(result.recipes[0].baristaId).toBe('1');
    });
  });

  describe('exists()', () => {
    it('存在するレシピに対してtrueが返されること', async () => {
      // Arrange - レシピを追加
      repository.add(testRecipe);

      // Act - 存在確認
      const exists = await repository.exists(testRecipe.id);

      // Assert - 存在することを確認
      expect(exists).toBe(true);
    });

    it('存在しないレシピに対してfalseが返されること', async () => {
      // Arrange - 空のリポジトリ

      // Act - 存在確認
      const exists = await repository.exists(RecipeId.fromString('999'));

      // Assert - 存在しないことを確認
      expect(exists).toBe(false);
    });
  });

  describe('findByIds()', () => {
    it('複数のIDからレシピを取得できること', async () => {
      // Arrange - 複数のレシピを追加
      const recipe1 = Recipe.reconstruct({
        id: RecipeId.fromString('1'),
        title: 'レシピ1',
        brewingConditions: BrewingConditions.create({
          roastLevel: RoastLevel.MEDIUM,
        }),
        viewCount: 0,
        isPublished: false,
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [],
        equipmentIds: [],
        tagIds: [],
      });

      const recipe2 = Recipe.reconstruct({
        id: RecipeId.fromString('2'),
        title: 'レシピ2',
        brewingConditions: BrewingConditions.create({
          roastLevel: RoastLevel.MEDIUM,
        }),
        viewCount: 0,
        isPublished: false,
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [],
        equipmentIds: [],
        tagIds: [],
      });

      repository.add(recipe1);
      repository.add(recipe2);

      // Act - 複数IDで取得
      const recipes = await repository.findByIds([
        RecipeId.fromString('1'),
        RecipeId.fromString('2'),
      ]);

      // Assert - 正しいレシピが取得されることを確認
      expect(recipes).toHaveLength(2);
      expect(recipes.map((r) => r.title)).toEqual(['レシピ1', 'レシピ2']);
    });

    it('存在しないIDは無視されること', async () => {
      // Arrange - 1つのレシピのみ追加
      repository.add(testRecipe);

      // Act - 存在するIDと存在しないIDで取得
      const recipes = await repository.findByIds([testRecipe.id, RecipeId.fromString('999')]);

      // Assert - 存在するレシピのみ取得されることを確認
      expect(recipes).toHaveLength(1);
      expect(recipes[0].id.equals(testRecipe.id)).toBe(true);
    });

    it('空の配列を渡すと空の配列が返されること', async () => {
      // Arrange - レシピを追加
      repository.add(testRecipe);

      // Act - 空の配列で取得
      const recipes = await repository.findByIds([]);

      // Assert - 空の配列が返されることを確認
      expect(recipes).toHaveLength(0);
    });
  });

  describe('count()', () => {
    it('全レシピ数の取得が正しく動作すること', async () => {
      // Arrange - 複数のレシピを追加
      const recipe1 = Recipe.reconstruct({
        id: RecipeId.fromString('1'),
        title: 'レシピ1',
        brewingConditions: BrewingConditions.create({
          roastLevel: RoastLevel.MEDIUM,
        }),
        viewCount: 0,
        isPublished: false,
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [],
        equipmentIds: [],
        tagIds: [],
      });

      const recipe2 = Recipe.reconstruct({
        id: RecipeId.fromString('2'),
        title: 'レシピ2',
        brewingConditions: BrewingConditions.create({
          roastLevel: RoastLevel.DARK,
        }),
        viewCount: 0,
        isPublished: false,
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [],
        equipmentIds: [],
        tagIds: [],
      });

      repository.add(recipe1);
      repository.add(recipe2);

      // Act - 全レシピ数を取得
      const totalCount = await repository.count();

      // Assert - 正しい数が返されることを確認
      expect(totalCount).toBe(2);
    });

    it('条件付きカウントが正しく動作すること', async () => {
      // Arrange - 複数のレシピを追加
      const recipe1 = Recipe.reconstruct({
        id: RecipeId.fromString('1'),
        title: 'レシピ1',
        brewingConditions: BrewingConditions.create({
          roastLevel: RoastLevel.MEDIUM,
        }),
        viewCount: 0,
        isPublished: false,
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [],
        equipmentIds: [],
        tagIds: [],
      });

      const recipe2 = Recipe.reconstruct({
        id: RecipeId.fromString('2'),
        title: 'レシピ2',
        brewingConditions: BrewingConditions.create({
          roastLevel: RoastLevel.DARK,
        }),
        viewCount: 0,
        isPublished: false,
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [],
        equipmentIds: [],
        tagIds: [],
      });

      repository.add(recipe1);
      repository.add(recipe2);

      // Act - 条件付きカウントを取得
      const darkRoastCount = await repository.count({
        roastLevel: [RoastLevel.DARK],
      });

      // Assert - 正しい数が返されることを確認
      expect(darkRoastCount).toBe(1);
    });
  });
});
