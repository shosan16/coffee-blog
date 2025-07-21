/**
 * レシピ検索レスポンスDTO
 *
 * ドメインエンティティと外部APIレスポンスの変換を担当
 * Clean Architectureの境界を明確にする
 */

/**
 * レシピ要約DTO（検索結果用）
 */
export type RecipeSummaryDto = {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly equipment: string[];
  readonly roastLevel: string;
  readonly grindSize?: string;
  readonly beanWeight: number;
  readonly waterTemp: number;
  readonly waterAmount: number;
};

/**
 * ページネーション情報DTO
 */
export type PaginationDto = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly itemsPerPage: number;
};

/**
 * レシピ検索レスポンスDTO
 */
export type SearchRecipesResponseDto = {
  readonly recipes: RecipeSummaryDto[];
  readonly pagination: PaginationDto;
};

/**
 * レシピ検索レスポンスマッパー
 *
 * ドメイン検索結果からDTOへの型安全な変換を提供
 */
export class SearchRecipesResponseMapper {
  /**
   * 検索結果からDTOに変換
   *
   * @param result - ドメイン検索結果
   * @returns 検索レスポンスDTO
   * @throws Error 無効な検索結果の場合
   */
  static toDto(result: SearchResultEntity): SearchRecipesResponseDto {
    // 型ガード：必須プロパティの存在確認
    if (!result) {
      throw new Error('Invalid search result: result must be an object');
    }

    return {
      recipes: result.recipes.map((recipe) => this.mapRecipeSummaryDto(recipe)),
      pagination: {
        currentPage: result.pagination.currentPage,
        totalPages: result.pagination.totalPages,
        totalItems: result.pagination.totalItems,
        itemsPerPage: result.pagination.itemsPerPage,
      },
    };
  }

  /**
   * レシピエンティティから要約DTOに変換
   *
   * @param recipe - レシピエンティティ
   * @returns レシピ要約DTO
   * @throws Error 無効なレシピエンティティの場合
   */
  private static mapRecipeSummaryDto(recipe: RecipeEntityForSearch): RecipeSummaryDto {
    // 型ガード：必須プロパティの存在確認
    if (!recipe || typeof recipe !== 'object') {
      throw new Error('Invalid recipe entity: recipe must be an object');
    }

    if (!recipe.id || typeof recipe.id.value !== 'string') {
      throw new Error('Invalid recipe entity: id is required');
    }

    if (!recipe.title || typeof recipe.title !== 'string') {
      throw new Error('Invalid recipe entity: title is required');
    }

    if (!recipe.brewingConditions || typeof recipe.brewingConditions !== 'object') {
      throw new Error('Invalid recipe entity: brewingConditions is required');
    }

    const brewingConditions = recipe.brewingConditions;
    if (!brewingConditions.roastLevel || typeof brewingConditions.roastLevel !== 'string') {
      throw new Error('Invalid recipe entity: roastLevel is required');
    }

    return {
      id: recipe.id.value,
      title: recipe.title,
      summary: recipe.summary ?? '',
      equipment: Array.isArray(recipe.equipmentIds) ? [...recipe.equipmentIds] : [],
      roastLevel: brewingConditions.roastLevel,
      grindSize: brewingConditions.grindSize ?? undefined,
      beanWeight: brewingConditions.beanWeight ?? 0,
      waterTemp: brewingConditions.waterTemp ?? 0,
      waterAmount: brewingConditions.waterAmount ?? 0,
    };
  }
}

/**
 * 検索結果エンティティの型定義
 * RecipeSearchResult との型安全性を保証
 */
type SearchResultEntity = {
  readonly recipes: readonly RecipeEntityForSearch[];
  readonly pagination: {
    readonly currentPage: number;
    readonly totalPages: number;
    readonly totalItems: number;
    readonly itemsPerPage: number;
  };
};

/**
 * 検索用レシピエンティティの型定義
 * Recipe エンティティの検索に必要な部分のみ
 */
type RecipeEntityForSearch = {
  readonly id: { readonly value: string };
  readonly title: string;
  readonly summary?: string;
  readonly brewingConditions: {
    readonly roastLevel: string;
    readonly grindSize?: string;
    readonly beanWeight?: number;
    readonly waterTemp?: number;
    readonly waterAmount?: number;
  };
  readonly equipmentIds: readonly string[];
};
