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
  EquipmentType,
  SocialLink,
} from '@prisma/client';

import { Recipe, type RecipeStep } from '@/server/domain/recipe/entities/recipe';
import { BrewingConditions } from '@/server/domain/recipe/value-objects/BrewingConditions';
import { RecipeId } from '@/server/domain/recipe/value-objects/RecipeId';

/**
 * Prisma Post型の拡張（関連データを含む）
 */
export type PrismaRecipeWithRelations = Post & {
  barista?:
    | (Barista & {
        socialLinks: SocialLink[];
      })
    | null;
  steps: Step[];
  equipment: (Equipment & {
    equipmentType: EquipmentType;
  })[];
  tags: Array<PostTag & { tag: Tag }>;
};

/**
 * RecipeMapper - PrismaモデルとDomainエンティティ間の変換を担当
 */
export class RecipeMapper {
  /**
   * 安全にBigIntに変換
   * 数値以外の文字列の場合は0を返す
   */
  private static safeBigIntConvert(value: string): bigint {
    try {
      // 数値文字列の場合のみBigIntに変換
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return BigInt(0); // デフォルト値として0を返す
      }
      return BigInt(numValue);
    } catch {
      return BigInt(0);
    }
  }

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
    equipmentNames?: string[];
    equipmentTypeNames?: string[];
    tagIds?: string[];
    baristaId?: string;
    isPublished?: boolean;
  }): Record<string, unknown> {
    const where: Record<string, unknown> = {};

    // テキスト検索
    if (criteria.searchTerm) {
      where.OR = [
        { title: { contains: criteria.searchTerm, mode: 'insensitive' } },
        { summary: { contains: criteria.searchTerm, mode: 'insensitive' } },
        { remarks: { contains: criteria.searchTerm, mode: 'insensitive' } },
      ];
    }

    // 基本フィルター
    if (criteria.roastLevel?.length) {
      where.roastLevel = { in: criteria.roastLevel };
    }
    if (criteria.grindSize?.length) {
      where.grindSize = { in: criteria.grindSize };
    }

    // 範囲フィルター
    this.addRangeFilter(where, 'beanWeight', criteria.beanWeight);
    this.addRangeFilter(where, 'waterTemp', criteria.waterTemp);
    this.addRangeFilter(where, 'waterAmount', criteria.waterAmount);

    // 関連エンティティフィルター
    const andConditions: Array<Record<string, unknown>> = [];

    if (criteria.equipmentNames?.length) {
      andConditions.push({
        equipment: {
          some: {
            name: { in: criteria.equipmentNames },
          },
        },
      });
    }

    if (criteria.equipmentTypeNames?.length) {
      andConditions.push({
        equipment: {
          some: {
            equipmentType: {
              name: { in: criteria.equipmentTypeNames },
            },
          },
        },
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    if (criteria.tagIds?.length) {
      where.tags = {
        some: {
          tagId: { in: criteria.tagIds.map((id) => this.safeBigIntConvert(id)) },
        },
      };
    }

    if (criteria.baristaId) {
      where.baristaId = this.safeBigIntConvert(criteria.baristaId);
    }

    // 状態フィルター
    if (criteria.isPublished !== undefined) {
      where.isPublished = criteria.isPublished;
    }

    return where;
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
      const fieldValue: Record<string, unknown> = {};
      if (range.min !== undefined) {
        fieldValue.gte = range.min;
      }
      if (range.max !== undefined) {
        fieldValue.lte = range.max;
      }
      where[field] = fieldValue;
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
    sortBy: 'id' | 'title' | 'viewCount' | 'createdAt' | 'updatedAt' | 'publishedAt' = 'id',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Record<string, 'asc' | 'desc'> {
    return {
      [sortBy]: sortOrder,
    };
  }
}
