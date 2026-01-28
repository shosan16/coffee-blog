/**
 * MemoryRecipeRepository - テスト用インメモリレシピリポジトリ
 *
 * IRecipeRepositoryインターフェースの実装
 * テストでのモック化や高速なテスト実行を目的とする
 */

import type { Recipe } from '@/server/domain/recipe/entities/recipe';
import type {
  IRecipeRepository,
  RecipeSearchCriteria,
  RecipeSearchResult,
  PaginationInfo,
} from '@/server/domain/recipe/repositories/IRecipeRepository';
import type { RecipeId } from '@/server/domain/recipe/value-objects/RecipeId';

/**
 * インメモリレシピリポジトリの実装
 */
export class MemoryRecipeRepository implements IRecipeRepository {
  private readonly recipes: Map<string, Recipe> = new Map();

  /**
   * テスト用のデータクリア
   */
  clear(): void {
    this.recipes.clear();
  }

  /**
   * テスト用のデータ追加
   */
  add(recipe: Recipe): void {
    this.recipes.set(recipe.id.value, recipe);
  }

  /**
   * テスト用のデータ取得
   */
  getAll(): Recipe[] {
    return Array.from(this.recipes.values());
  }

  /**
   * IDによるレシピ取得
   */
  async findById(id: RecipeId): Promise<Recipe | null> {
    return this.recipes.get(id.value) ?? null;
  }

  /**
   * 公開レシピをIDで取得
   */
  async findPublishedById(id: RecipeId): Promise<Recipe | null> {
    const recipe = this.recipes.get(id.value);
    return recipe?.isPublished ? recipe : null;
  }

  /**
   * レシピ検索
   */
  async search(criteria: RecipeSearchCriteria): Promise<RecipeSearchResult> {
    let filteredRecipes = Array.from(this.recipes.values());

    if (criteria.searchTerm) {
      const searchTerm = criteria.searchTerm.toLowerCase();
      filteredRecipes = filteredRecipes.filter((recipe) => {
        return (
          recipe.title.toLowerCase().includes(searchTerm) ||
          (recipe.summary?.toLowerCase().includes(searchTerm) ?? false) ||
          (recipe.remarks?.toLowerCase().includes(searchTerm) ?? false)
        );
      });
    }

    if (criteria.roastLevel?.length) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        (criteria.roastLevel ?? []).includes(recipe.brewingConditions.roastLevel)
      );
    }

    if (criteria.grindSize?.length) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) =>
          recipe.brewingConditions.grindSize &&
          (criteria.grindSize ?? []).includes(recipe.brewingConditions.grindSize)
      );
    }

    if (criteria.beanWeight) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        const beanWeight = recipe.brewingConditions.beanWeight;
        if (beanWeight === undefined) return false;

        return (
          (criteria.beanWeight?.min === undefined || beanWeight >= criteria.beanWeight.min) &&
          (criteria.beanWeight?.max === undefined || beanWeight <= criteria.beanWeight.max)
        );
      });
    }

    if (criteria.waterTemp) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        const waterTemp = recipe.brewingConditions.waterTemp;
        if (waterTemp === undefined) return false;

        return (
          (criteria.waterTemp?.min === undefined || waterTemp >= criteria.waterTemp.min) &&
          (criteria.waterTemp?.max === undefined || waterTemp <= criteria.waterTemp.max)
        );
      });
    }

    if (criteria.waterAmount) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        const waterAmount = recipe.brewingConditions.waterAmount;
        if (waterAmount === undefined) return false;

        return (
          (criteria.waterAmount?.min === undefined || waterAmount >= criteria.waterAmount.min) &&
          (criteria.waterAmount?.max === undefined || waterAmount <= criteria.waterAmount.max)
        );
      });
    }

    if (criteria.equipmentIds?.length) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        (criteria.equipmentIds ?? []).some((equipmentId) =>
          recipe.equipmentIds.includes(equipmentId)
        )
      );
    }

    if (criteria.tagIds?.length) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        (criteria.tagIds ?? []).some((tagId) => recipe.tagIds.includes(tagId))
      );
    }

    if (criteria.baristaId) {
      filteredRecipes = filteredRecipes.filter((recipe) => recipe.baristaId === criteria.baristaId);
    }

    // 状態フィルター
    if (criteria.isPublished !== undefined) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.isPublished === criteria.isPublished
      );
    }

    const sortBy = criteria.sortBy ?? 'createdAt';
    const sortOrder = criteria.sortOrder ?? 'desc';

    filteredRecipes.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case 'id':
          aValue = a.id.value;
          bValue = b.id.value;
          break;
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'viewCount':
          aValue = a.viewCount;
          bValue = b.viewCount;
          break;
        case 'updatedAt':
          aValue = a.updatedAt;
          bValue = b.updatedAt;
          break;
        case 'publishedAt':
          aValue = a.publishedAt ?? new Date(0);
          bValue = b.publishedAt ?? new Date(0);
          break;
        case 'createdAt':
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (sortOrder === 'asc') {
        if (aValue > bValue) return 1;
        if (aValue < bValue) return -1;
        return 0;
      } else {
        if (aValue < bValue) return 1;
        if (aValue > bValue) return -1;
        return 0;
      }
    });

    const totalItems = filteredRecipes.length;
    const totalPages = Math.ceil(totalItems / criteria.limit);
    const startIndex = (criteria.page - 1) * criteria.limit;
    const endIndex = startIndex + criteria.limit;
    const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

    const pagination: PaginationInfo = {
      currentPage: criteria.page,
      totalPages,
      totalItems,
      itemsPerPage: criteria.limit,
    };

    return {
      recipes: paginatedRecipes,
      pagination,
    };
  }

  /**
   * 公開レシピ一覧取得
   */
  async findPublishedRecipes(
    criteria: Omit<RecipeSearchCriteria, 'isPublished'>
  ): Promise<RecipeSearchResult> {
    return this.search({
      ...criteria,
      isPublished: true,
    });
  }

  /**
   * バリスタによるレシピ検索
   */
  async findByBarista(
    baristaId: string,
    criteria: Omit<RecipeSearchCriteria, 'baristaId'>
  ): Promise<RecipeSearchResult> {
    return this.search({
      ...criteria,
      baristaId,
    });
  }

  /**
   * レシピの存在確認
   */
  async exists(id: RecipeId): Promise<boolean> {
    return this.recipes.has(id.value);
  }

  /**
   * 複数レシピのバッチ取得
   */
  async findByIds(ids: RecipeId[]): Promise<Recipe[]> {
    const recipes: Recipe[] = [];

    for (const id of ids) {
      const recipe = this.recipes.get(id.value);
      if (recipe) {
        recipes.push(recipe);
      }
    }

    return recipes;
  }

  /**
   * レシピ数の取得
   */
  async count(criteria: Partial<RecipeSearchCriteria> = {}): Promise<number> {
    if (Object.keys(criteria).length === 0) {
      return this.recipes.size;
    }

    const result = await this.search({
      ...criteria,
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    } as RecipeSearchCriteria);

    return result.pagination.totalItems;
  }
}
