/**
 * レシピ詳細レスポンスDTO
 *
 * ドメインエンティティと外部APIレスポンスの変換を担当
 * Clean Architectureの境界を明確にする
 */

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
  readonly brewingTime?: number;
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
 * ドメインエンティティからDTOへの型安全な変換を提供
 */
export class RecipeDetailResponseMapper {
  /**
   * レシピエンティティからDTOに変換
   *
   * @param recipe - レシピエンティティ
   * @returns レシピ詳細DTO
   * @throws Error 無効なエンティティの場合
   */
  static toDto(recipe: RecipeEntity): RecipeDetailDto {
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
      brewingTime: recipe.brewingConditions.brewingTime ?? undefined,
      viewCount: recipe.viewCount,
      isPublished: recipe.isPublished,
      publishedAt: recipe.publishedAt?.toISOString() ?? undefined,
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
      barista: recipe.baristaId ? this.mapBaristaDto(recipe.baristaId) : undefined,
      steps: this.mapStepsDto(recipe.steps),
      equipment: this.mapEquipmentDto(recipe.equipmentIds),
      tags: this.mapTagsDto(recipe.tagIds),
    };
  }

  /**
   * バリスタ情報をDTOに変換
   *
   * @param baristaId - バリスタID
   * @returns バリスタDTO（簡略版）
   */
  private static mapBaristaDto(baristaId: string): BaristaDto {
    // YAGNI原則：現時点では簡略化された実装
    // 将来的にはBaristaエンティティから変換予定
    return {
      id: baristaId,
      name: 'Unknown Barista',
      socialLinks: [],
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
   * @param equipmentIds - 器具ID配列
   * @returns 器具詳細DTO配列
   */
  private static mapEquipmentDto(equipmentIds: readonly string[]): DetailedEquipmentDto[] {
    // YAGNI原則：現時点では簡略化された実装
    // 将来的にはEquipmentエンティティから変換予定
    return equipmentIds.map((id) => ({
      id,
      name: 'Unknown Equipment',
      equipmentType: {
        id: 'unknown',
        name: 'Unknown Type',
      },
    }));
  }

  /**
   * タグ情報をDTOに変換
   *
   * @param tagIds - タグID配列
   * @returns レシピタグDTO配列
   */
  private static mapTagsDto(tagIds: readonly string[]): RecipeTagDto[] {
    // YAGNI原則：現時点では簡略化された実装
    // 将来的にはTagエンティティから変換予定
    return tagIds.map((id) => ({
      id,
      name: 'Unknown Tag',
      slug: id.toLowerCase().replace(/\s+/g, '-'),
    }));
  }
}

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
    readonly brewingTime?: number;
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
