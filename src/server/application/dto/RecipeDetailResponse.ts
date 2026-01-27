/**
 * レシピ詳細レスポンスDTO
 *
 * ドメインエンティティと外部APIレスポンスの変換を担当
 * Clean Architectureの境界を明確にする
 */

import type { PrismaRecipeWithRelations } from '@/server/infrastructure/repositories/mappers/RecipeMapper';
import type {
  Barista,
  RecipeStep,
  DetailedEquipment,
  RecipeTag,
  RecipeDetail,
} from '@/server/shared/schemas';

/**
 * レシピ詳細レスポンスマッパー
 *
 * PrismaデータとAPIレスポンスの型安全な変換を提供
 */
export class RecipeDetailResponseMapper {
  /**
   * PrismaデータからAPIレスポンス形式に変換
   *
   * prismaDataが未指定の場合、barista/equipment/tagsは空配列となる。
   * 日時はISO 8601文字列に変換され、クライアント側でのタイムゾーン調整が可能。
   *
   * @param recipe - レシピエンティティ（ドメイン層）
   * @param prismaData - 関連データ（取得失敗時はundefined）
   * @returns APIレスポンス形式のレシピ詳細
   */
  static toResponse(recipe: RecipeEntity, prismaData?: PrismaRecipeWithRelations): RecipeDetail {
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
      barista: prismaData?.barista ? this.mapBarista(prismaData.barista) : undefined,
      steps: this.mapSteps(recipe.steps),
      equipment: prismaData?.equipment ? this.mapEquipment(prismaData.equipment) : [],
      tags: prismaData?.tags ? this.mapTags(prismaData.tags) : [],
    };
  }

  /**
   * バリスタ情報を変換
   *
   * @param prismaBarista - Prismaバリスタデータ
   * @returns バリスタ情報
   */
  private static mapBarista(prismaBarista: PrismaBaristaWithSocialLinks): Barista {
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
   * レシピステップを変換
   *
   * @param steps - レシピステップ配列
   * @returns レシピステップ配列
   */
  private static mapSteps(steps: readonly RecipeStepEntity[]): RecipeStep[] {
    return steps.map((step, index) => ({
      id: `step-${index + 1}`,
      stepOrder: step.stepOrder,
      timeSeconds: step.timeSeconds ?? undefined,
      description: step.description,
    }));
  }

  /**
   * 器具情報を変換
   *
   * @param prismaEquipment - Prisma器具データ配列
   * @returns 器具詳細情報配列
   */
  private static mapEquipment(prismaEquipment: PrismaEquipmentWithType[]): DetailedEquipment[] {
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
   * タグ情報を変換
   *
   * @param prismaTags - PrismaタグとPostTagの関連データ配列
   * @returns レシピタグ配列
   */
  private static mapTags(prismaTags: PrismaPostTagWithTag[]): RecipeTag[] {
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
