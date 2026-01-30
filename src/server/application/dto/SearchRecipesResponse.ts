/**
 * レシピ検索レスポンスDTO
 *
 * ドメインエンティティと外部APIレスポンスの変換を担当
 * Clean Architectureの境界を明確にする
 */

import type { IEquipmentRepository } from '@/server/domain/recipe/repositories/IEquipmentRepository';
import type { ITagRepository, TagEntity } from '@/server/domain/recipe/repositories/ITagRepository';
import type { RecipeSummary, RecipeListResponse, RecipeTagSummary } from '@/server/shared/schemas';

/**
 * レシピ検索レスポンスマッパー
 *
 * ドメイン検索結果からAPIレスポンスへの型安全な変換を提供
 */
export class SearchRecipesResponseMapper {
  constructor(
    private readonly equipmentRepository: IEquipmentRepository,
    private readonly tagRepository: ITagRepository
  ) {}

  /**
   * 検索結果からAPIレスポンス形式に変換
   *
   * 器具情報とタグ情報は一括取得によりN+1問題を回避。
   * ブランド名がある場合は「ブランド名 器具名」形式で表示。
   *
   * @param result - ドメイン検索結果
   * @returns APIレスポンス形式のレシピ一覧
   */
  async toResponse(result: SearchResultEntity): Promise<RecipeListResponse> {
    // すべてのレシピの器具IDを収集
    const allEquipmentIds = result.recipes.flatMap((recipe) => recipe.equipmentIds);
    const uniqueEquipmentIds = [...new Set(allEquipmentIds)];

    // すべてのレシピのタグIDを収集
    const allTagIds = result.recipes.flatMap((recipe) => recipe.tagIds);
    const uniqueTagIds = [...new Set(allTagIds)];

    // 器具情報とタグ情報を一括取得
    const [equipmentList, tagList] = await Promise.all([
      this.equipmentRepository.findByIds(uniqueEquipmentIds),
      this.tagRepository.findByIds(uniqueTagIds),
    ]);

    const equipmentMap = new Map(equipmentList.map((eq) => [eq.id, eq]));
    const tagMap = new Map(tagList.map((tag) => [tag.id, tag]));

    return {
      recipes: result.recipes.map((recipe) => this.mapRecipeSummary(recipe, equipmentMap, tagMap)),
      pagination: {
        currentPage: result.pagination.currentPage,
        totalPages: result.pagination.totalPages,
        totalItems: result.pagination.totalItems,
        itemsPerPage: result.pagination.itemsPerPage,
      },
    };
  }

  /**
   * レシピエンティティから要約形式に変換
   *
   * @param recipe - レシピエンティティ
   * @param equipmentMap - 器具IDから器具エンティティへのマップ
   * @param tagMap - タグIDからタグエンティティへのマップ
   * @returns レシピ要約情報
   */
  private mapRecipeSummary(
    recipe: RecipeEntityForSearch,
    equipmentMap: Map<string, { id: string; name: string; brand?: string }>,
    tagMap: Map<string, TagEntity>
  ): RecipeSummary {
    const brewingConditions = recipe.brewingConditions;

    // 器具IDを器具名に変換
    const equipmentNames = this.convertEquipmentIdsToNames(recipe.equipmentIds, equipmentMap);

    // タグIDをタグ情報に変換
    const tags = this.convertTagIdsToTags(recipe.tagIds, tagMap);

    return {
      id: recipe.id.value,
      title: recipe.title,
      summary: recipe.summary ?? '',
      equipment: equipmentNames,
      roastLevel: brewingConditions.roastLevel,
      tags,
      baristaName: recipe.baristaName,
    };
  }

  /**
   * 器具IDリストを器具名リストに変換
   *
   * 器具が見つからない場合はIDをそのまま返す（フォールバック動作）
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

  /**
   * タグIDリストをタグ情報リストに変換
   *
   * タグが見つからない場合はIDをそのままプレースホルダーとして返す
   *
   * @param tagIds - タグIDリスト
   * @param tagMap - タグIDからタグエンティティへのマップ
   * @returns タグ情報リスト
   */
  private convertTagIdsToTags(
    tagIds: readonly string[],
    tagMap: Map<string, TagEntity>
  ): RecipeTagSummary[] {
    if (!Array.isArray(tagIds)) {
      return [];
    }

    return tagIds.map((id) => {
      const tag = tagMap.get(id);
      if (!tag) {
        // タグが見つからない場合はIDをプレースホルダーとして返す
        return {
          id,
          name: id,
          slug: id,
        };
      }
      return {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      };
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
  };
  readonly equipmentIds: readonly string[];
  readonly tagIds: readonly string[];
  readonly baristaName: string | null;
};
