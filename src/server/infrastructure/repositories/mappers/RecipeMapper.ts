/**
 * レシピデータマッピング層
 *
 * PrismaモデルとDomainエンティティ間の変換を責任とする
 */

import type {
  RoastLevel,
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
    const recipeId = RecipeId.fromString(prismaPost.id.toString());

    const brewingConditions = BrewingConditions.create({
      roastLevel: prismaPost.roastLevel,
      grindSize: prismaPost.grindSize ?? undefined,
      beanWeight: prismaPost.beanWeight ?? undefined,
      waterAmount: prismaPost.waterAmount ?? undefined,
      waterTemp: prismaPost.waterTemp ?? undefined,
    });

    const sortedSteps = [...prismaPost.steps].sort((a, b) => a.stepOrder - b.stepOrder);
    const steps: RecipeStep[] = sortedSteps.map((step) => ({
      stepOrder: step.stepOrder,
      description: step.description,
      timeSeconds: step.timeSeconds ?? undefined,
    }));

    const equipmentIds = prismaPost.equipment.map((equipment) => equipment.id.toString());

    const tagIds = prismaPost.tags.map((postTag) => postTag.tag.id.toString());

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
      baristaName: prismaPost.barista?.name ?? null,
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
    equipmentNames?: string[];
    equipmentTypeNames?: string[];
    tagIds?: string[];
    baristaId?: string;
    isPublished?: boolean;
  }): Record<string, unknown> {
    const where: Record<string, unknown> = {};

    if (criteria.searchTerm) {
      where.OR = [
        { title: { contains: criteria.searchTerm, mode: 'insensitive' } },
        { summary: { contains: criteria.searchTerm, mode: 'insensitive' } },
        { remarks: { contains: criteria.searchTerm, mode: 'insensitive' } },
      ];
    }

    if (criteria.roastLevel?.length) {
      where.roastLevel = { in: criteria.roastLevel };
    }

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

    if (criteria.isPublished !== undefined) {
      where.isPublished = criteria.isPublished;
    }

    return where;
  }

  /**
   * ソート条件の変換
   *
   * @param sortBy - ソート項目
   * @param sortOrder - ソート順序
   * @returns Prisma OrderBy句
   */
  static toOrderBy(
    sortBy:
      | 'id'
      | 'title'
      | 'viewCount'
      | 'createdAt'
      | 'updatedAt'
      | 'publishedAt'
      | 'roastLevel' = 'publishedAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Record<string, 'asc' | 'desc'> {
    return {
      [sortBy]: sortOrder,
    };
  }
}
