/**
 * レシピ詳細レスポンスDTO
 *
 * ドメインエンティティと外部APIレスポンスの変換を担当
 * Clean Architectureの境界を明確にする
 */

import type { PrismaRecipeWithRelations } from '@/server/infrastructure/repositories/mappers/RecipeMapper';

/**
 * バリスタ情報DTO
 */
export type BaristaDto = {
  readonly id: string;
  readonly name: string;
  readonly affiliation?: string;
  readonly socialLinks: Array<{
    readonly id: string;
    readonly platform: string;
    readonly url: string;
  }>;
};

/**
 * レシピステップDTO
 */
export type RecipeStepDto = {
  readonly id: string;
  readonly stepOrder: number;
  readonly timeSeconds?: number;
  readonly description: string;
};

/**
 * 器具詳細DTO
 */
export type DetailedEquipmentDto = {
  readonly id: string;
  readonly name: string;
  readonly brand?: string;
  readonly description?: string;
  readonly affiliateLink?: string;
  readonly equipmentType: {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
  };
};

/**
 * レシピタグDTO
 */
export type RecipeTagDto = {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
};

/**
 * レシピ詳細レスポンスDTO
 */
export type RecipeDetailDto = {
  readonly id: string;
  readonly title: string;
  readonly summary?: string;
  readonly remarks?: string;
  readonly roastLevel: string;
  readonly grindSize?: string;
  readonly beanWeight?: number;
  readonly waterTemp?: number;
  readonly waterAmount?: number;
  readonly viewCount: number;
  readonly isPublished: boolean;
  readonly publishedAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly barista?: BaristaDto;
  readonly steps: RecipeStepDto[];
  readonly equipment: DetailedEquipmentDto[];
  readonly tags: RecipeTagDto[];
};

/**
 * レシピ詳細レスポンスマッパー
 *
 * PrismaデータとDTOの型安全な変換を提供
 */
export class RecipeDetailResponseMapper {
  /**
   * PrismaデータからDTOに変換
   *
   * @param recipe - レシピエンティティ
   * @param prismaData - Prismaから取得した関連データ
   * @returns レシピ詳細DTO
   * @throws Error 無効なエンティティの場合
   */
  static toDto(recipe: RecipeEntity, prismaData?: PrismaRecipeWithRelations): RecipeDetailDto {
    // 型安全な変換
    return {
      id: recipe.id.value,
      title: recipe.title,
      summary: recipe.summary ?? undefined,
      remarks: recipe.remarks ?? undefined,
      roastLevel: recipe.brewingConditions.roastLevel,
      grindSize: recipe.brewingConditions.grindSize ?? undefined,
      beanWeight: recipe.brewingConditions.beanWeight ?? undefined,
      waterTemp: recipe.brewingConditions.waterTemp ?? undefined,
      waterAmount: recipe.brewingConditions.waterAmount ?? undefined,
      viewCount: recipe.viewCount,
      isPublished: recipe.isPublished,
      publishedAt: recipe.publishedAt?.toISOString() ?? undefined,
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
      barista: prismaData?.barista ? this.mapBaristaDto(prismaData.barista) : undefined,
      steps: this.mapStepsDto(recipe.steps),
      equipment: prismaData?.equipment ? this.mapEquipmentDto(prismaData.equipment) : [],
      tags: prismaData?.tags ? this.mapTagsDto(prismaData.tags) : [],
    };
  }

  /**
   * バリスタ情報をDTOに変換
   *
   * @param prismaBarista - Prismaバリスタデータ
   * @returns バリスタDTO
   */
  private static mapBaristaDto(prismaBarista: PrismaBaristaWithSocialLinks): BaristaDto {
    return {
      id: prismaBarista.id.toString(),
      name: prismaBarista.name,
      affiliation: prismaBarista.affiliation ?? undefined,
      socialLinks: prismaBarista.socialLinks.map((link) => ({
        id: link.id.toString(),
        platform: link.platform,
        url: link.url,
      })),
    };
  }

  /**
   * レシピステップをDTOに変換
   *
   * @param steps - レシピステップ配列
   * @returns レシピステップDTO配列
   */
  private static mapStepsDto(steps: readonly RecipeStepEntity[]): RecipeStepDto[] {
    return steps.map((step, index) => ({
      id: `step-${index + 1}`,
      stepOrder: step.stepOrder,
      timeSeconds: step.timeSeconds ?? undefined,
      description: step.description,
    }));
  }

  /**
   * 器具情報をDTOに変換
   *
   * @param prismaEquipment - Prisma器具データ配列
   * @returns 器具詳細DTO配列
   */
  private static mapEquipmentDto(
    prismaEquipment: PrismaEquipmentWithType[]
  ): DetailedEquipmentDto[] {
    return prismaEquipment.map((equipment) => ({
      id: equipment.id.toString(),
      name: equipment.name,
      brand: equipment.brand ?? undefined,
      description: equipment.description ?? undefined,
      affiliateLink: equipment.affiliateLink ?? undefined,
      equipmentType: {
        id: equipment.equipmentType.id.toString(),
        name: equipment.equipmentType.name,
        description: equipment.equipmentType.description ?? undefined,
      },
    }));
  }

  /**
   * タグ情報をDTOに変換
   *
   * @param prismaTags - PrismaタグとPostTagの関連データ配列
   * @returns レシピタグDTO配列
   */
  private static mapTagsDto(prismaTags: PrismaPostTagWithTag[]): RecipeTagDto[] {
    return prismaTags.map((postTag) => ({
      id: postTag.tag.id.toString(),
      name: postTag.tag.name,
      slug: postTag.tag.slug,
    }));
  }
}

/**
 * Prismaデータ型定義
 */
type PrismaBaristaWithSocialLinks = NonNullable<PrismaRecipeWithRelations['barista']>;
type PrismaEquipmentWithType = PrismaRecipeWithRelations['equipment'][number];
type PrismaPostTagWithTag = PrismaRecipeWithRelations['tags'][number];

/**
 * レシピエンティティの型定義
 * Recipe エンティティとの型安全性を保証
 */
type RecipeEntity = {
  readonly id: { readonly value: string };
  readonly title: string;
  readonly summary?: string;
  readonly remarks?: string;
  readonly brewingConditions: {
    readonly roastLevel: string;
    readonly grindSize?: string;
    readonly beanWeight?: number;
    readonly waterTemp?: number;
    readonly waterAmount?: number;
  };
  readonly viewCount: number;
  readonly isPublished: boolean;
  readonly publishedAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly baristaId?: string;
  readonly steps: readonly RecipeStepEntity[];
  readonly equipmentIds: readonly string[];
  readonly tagIds: readonly string[];
};

/**
 * レシピステップエンティティの型定義
 */
type RecipeStepEntity = {
  readonly stepOrder: number;
  readonly timeSeconds?: number;
  readonly description: string;
};
