/**
 * レシピ検索レスポンスDTO
 *
 * ドメインエンティティと外部APIレスポンスの変換を担当
 * Clean Architectureの境界を明確にする
 */

import type { IEquipmentRepository } from '@/server/domain/recipe/repositories/IEquipmentRepository';

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
  constructor(private readonly equipmentRepository: IEquipmentRepository) {}

  /**
   * 検索結果からDTOに変換
   *
   * @param result - ドメイン検索結果
   * @returns 検索レスポンスDTO
   * @throws Error 無効な検索結果の場合
   */
  async toDto(result: SearchResultEntity): Promise<SearchRecipesResponseDto> {
    // すべてのレシピの器具IDを収集
    const allEquipmentIds = result.recipes.flatMap((recipe) => recipe.equipmentIds);
    const uniqueEquipmentIds = [...new Set(allEquipmentIds)];

    // 器具情報を一括取得
    const equipmentList = await this.equipmentRepository.findByIds(uniqueEquipmentIds);
    const equipmentMap = new Map(equipmentList.map((eq) => [eq.id, eq]));

    return {
      recipes: result.recipes.map((recipe) => this.mapRecipeSummaryDto(recipe, equipmentMap)),
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
   * @param equipmentMap - 器具IDから器具エンティティへのマップ
   * @returns レシピ要約DTO
   * @throws Error 無効なレシピエンティティの場合
   */
  private mapRecipeSummaryDto(
    recipe: RecipeEntityForSearch,
    equipmentMap: Map<string, { id: string; name: string; brand?: string }>
  ): RecipeSummaryDto {
    const brewingConditions = recipe.brewingConditions;

    // 器具IDを器具名に変換
    const equipmentNames = this.convertEquipmentIdsToNames(recipe.equipmentIds, equipmentMap);

    return {
      id: recipe.id.value,
      title: recipe.title,
      summary: recipe.summary ?? '',
      equipment: equipmentNames,
      roastLevel: brewingConditions.roastLevel,
      grindSize: brewingConditions.grindSize ?? undefined,
      beanWeight: brewingConditions.beanWeight ?? 0,
      waterTemp: brewingConditions.waterTemp ?? 0,
      waterAmount: brewingConditions.waterAmount ?? 0,
    };
  }

  /**
   * 器具IDリストを器具名リストに変換
   *
   * @param equipmentIds - 器具IDリスト
   * @param equipmentMap - 器具IDから器具エンティティへのマップ
   * @returns 器具名リスト
   */
  private convertEquipmentIdsToNames(
    equipmentIds: readonly string[],
    equipmentMap: Map<string, { id: string; name: string; brand?: string }>
  ): string[] {
    if (!Array.isArray(equipmentIds)) {
      return [];
    }

    return equipmentIds.map((id) => {
      const equipment = equipmentMap.get(id);
      if (!equipment) {
        return id; // 器具が見つからない場合はIDをそのまま返す
      }

      // ブランドがある場合は「ブランド名 器具名」、なければ「器具名」のみ
      return equipment.brand ? `${equipment.brand} ${equipment.name}` : equipment.name;
    });
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
