/**
 * レシピデータマッピング層
 *
 * PrismaモデルとDomainエンティティ間の変換を責任とする
 */

import type {
  RoastLevel,
  GrindSize,
  Post,
  Step,
  Equipment,
  Tag,
  Barista,
  PostTag,
} from '@prisma/client';

import { Recipe, type RecipeStep } from '@/server/domain/recipe/entities/Recipe.entity';
import { BrewingConditions } from '@/server/domain/recipe/value-objects/BrewingConditions';
import { RecipeId } from '@/server/domain/recipe/value-objects/RecipeId';

/**
 * Prisma Post型の拡張（関連データを含む）
 */
export type PrismaRecipeWithRelations = Post & {
  barista?: Barista | null;
  steps: Step[];
  equipment: Equipment[];
  tags: Array<PostTag & { tag: Tag }>;
};

/**
 * RecipeMapper - PrismaモデルとDomainエンティティ間の変換を担当
 */
export class RecipeMapper {
  /**
   * PrismaモデルからDomainエンティティへの変換
   *
   * @param prismaPost - Prisma Post（関連データを含む）
   * @returns Recipe Domain Entity
   */
  static toDomain(prismaPost: PrismaRecipeWithRelations): Recipe {
    // RecipeIdの作成
    const recipeId = RecipeId.fromString(prismaPost.id.toString());

    // BrewingConditionsの作成
    const brewingConditions = BrewingConditions.create({
      roastLevel: prismaPost.roastLevel,
      grindSize: prismaPost.grindSize ?? undefined,
      beanWeight: prismaPost.beanWeight ?? undefined,
      waterAmount: prismaPost.waterAmount ?? undefined,
      waterTemp: prismaPost.waterTemp ?? undefined,
      brewingTime: prismaPost.brewingTime ?? undefined,
    });

    // RecipeStepの変換
    const sortedSteps = [...prismaPost.steps].sort((a, b) => a.stepOrder - b.stepOrder);
    const steps: RecipeStep[] = sortedSteps.map((step) => ({
      stepOrder: step.stepOrder,
      description: step.description,
      timeSeconds: step.timeSeconds ?? undefined,
    }));

    // 器具IDの抽出
    const equipmentIds = prismaPost.equipment.map((equipment) => equipment.id.toString());

    // タグIDの抽出
    const tagIds = prismaPost.tags.map((postTag) => postTag.tag.id.toString());

    // Domainエンティティの再構築
    return Recipe.reconstruct({
      id: recipeId,
      title: prismaPost.title,
      summary: prismaPost.summary ?? undefined,
      remarks: prismaPost.remarks ?? undefined,
      brewingConditions,
      viewCount: prismaPost.viewCount,
      isPublished: prismaPost.isPublished,
      publishedAt: prismaPost.publishedAt ?? undefined,
      createdAt: prismaPost.createdAt,
      updatedAt: prismaPost.updatedAt,
      baristaId: prismaPost.baristaId?.toString() ?? undefined,
      steps,
      equipmentIds,
      tagIds,
    });
  }

  /**
   * 検索条件用のWhere句生成
   *
   * @param criteria - 検索条件
   * @returns Prisma Where句
   */
  static toWhereClause(criteria: {
    searchTerm?: string;
    roastLevel?: RoastLevel[];
    grindSize?: GrindSize[];
    beanWeight?: { min?: number; max?: number };
    waterTemp?: { min?: number; max?: number };
    waterAmount?: { min?: number; max?: number };
    brewingTime?: { min?: number; max?: number };
    equipmentIds?: string[];
    equipmentTypeIds?: string[];
    tagIds?: string[];
    baristaId?: string;
    isPublished?: boolean;
  }): Record<string, unknown> {
    const where: Record<string, unknown> = {};

    this.addTextSearchCondition(where, criteria.searchTerm);
    this.addBasicFilters(where, criteria);
    this.addRangeFilters(where, criteria);
    this.addRelationFilters(where, criteria);
    this.addStatusFilters(where, criteria);

    return where;
  }

  /**
   * テキスト検索条件を追加
   */
  private static addTextSearchCondition(where: Record<string, unknown>, searchTerm?: string): void {
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { summary: { contains: searchTerm, mode: 'insensitive' } },
        { remarks: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }
  }

  /**
   * 基本フィルター条件を追加
   */
  private static addBasicFilters(
    where: Record<string, unknown>,
    criteria: {
      roastLevel?: RoastLevel[];
      grindSize?: GrindSize[];
    }
  ): void {
    if (criteria.roastLevel?.length) {
      where.roastLevel = { in: criteria.roastLevel };
    }

    if (criteria.grindSize?.length) {
      where.grindSize = { in: criteria.grindSize };
    }
  }

  /**
   * 範囲フィルター条件を追加
   */
  private static addRangeFilters(
    where: Record<string, unknown>,
    criteria: {
      beanWeight?: { min?: number; max?: number };
      waterTemp?: { min?: number; max?: number };
      waterAmount?: { min?: number; max?: number };
      brewingTime?: { min?: number; max?: number };
    }
  ): void {
    this.addRangeFilter(where, 'beanWeight', criteria.beanWeight);
    this.addRangeFilter(where, 'waterTemp', criteria.waterTemp);
    this.addRangeFilter(where, 'waterAmount', criteria.waterAmount);
    this.addRangeFilter(where, 'brewingTime', criteria.brewingTime);
  }

  /**
   * 個別の範囲フィルターを追加
   */
  private static addRangeFilter(
    where: Record<string, unknown>,
    field: string,
    range?: { min?: number; max?: number }
  ): void {
    if (range) {
      where[field] = {};
      if (range.min !== undefined) {
        (where[field] as any).gte = range.min;
      }
      if (range.max !== undefined) {
        (where[field] as any).lte = range.max;
      }
    }
  }

  /**
   * 関連エンティティフィルター条件を追加
   */
  private static addRelationFilters(
    where: Record<string, unknown>,
    criteria: {
      equipmentIds?: string[];
      equipmentTypeIds?: string[];
      tagIds?: string[];
      baristaId?: string;
    }
  ): void {
    if (criteria.equipmentIds?.length) {
      where.equipment = {
        some: {
          id: { in: criteria.equipmentIds.map((id) => BigInt(id)) },
        },
      };
    }

    if (criteria.equipmentTypeIds?.length) {
      where.equipment = {
        some: {
          typeId: { in: criteria.equipmentTypeIds.map((id) => BigInt(id)) },
        },
      };
    }

    if (criteria.tagIds?.length) {
      where.tags = {
        some: {
          tagId: { in: criteria.tagIds.map((id) => BigInt(id)) },
        },
      };
    }

    if (criteria.baristaId) {
      where.baristaId = BigInt(criteria.baristaId);
    }
  }

  /**
   * 状態フィルター条件を追加
   */
  private static addStatusFilters(
    where: Record<string, unknown>,
    criteria: {
      isPublished?: boolean;
    }
  ): void {
    if (criteria.isPublished !== undefined) {
      where.isPublished = criteria.isPublished;
    }
  }

  /**
   * ソート条件の変換
   *
   * @param sortBy - ソート項目
   * @param sortOrder - ソート順序
   * @returns Prisma OrderBy句
   */
  static toOrderBy(
    sortBy: 'id' | 'title' | 'viewCount' | 'createdAt' | 'updatedAt' | 'publishedAt' = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Record<string, 'asc' | 'desc'> {
    return {
      [sortBy]: sortOrder,
    };
  }
}
