import type { BrewingConditions } from '../../value-objects/BrewingConditions';
import type { RecipeId } from '../../value-objects/RecipeId';

import type { RecipeStep } from './Recipe.types';

/**
 * レシピエンティティ
 *
 * レシピのライフサイクルとビジネスルールを管理する
 */
export class Recipe {
  private constructor(
    private readonly _id: RecipeId,
    private readonly _title: string,
    private readonly _brewingConditions: BrewingConditions,
    private readonly _viewCount: number = 0,
    private readonly _isPublished: boolean = false,
    private readonly _createdAt: Date = new Date(),
    private readonly _updatedAt: Date = new Date(),
    private readonly _steps: RecipeStep[] = [],
    private readonly _equipmentIds: string[] = [],
    private readonly _tagIds: string[] = [],
    private readonly _baristaName: string | null = null,
    private readonly _summary?: string,
    private readonly _remarks?: string,
    private readonly _publishedAt?: Date,
    private readonly _baristaId?: string
  ) {}

  /**
   * 既存データからレシピを再構築
   *
   * @param data - レシピデータ
   * @returns Recipe インスタンス
   */
  static reconstruct(data: {
    id: RecipeId;
    title: string;
    summary?: string;
    remarks?: string;
    brewingConditions: BrewingConditions;
    viewCount: number;
    isPublished: boolean;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    baristaId?: string;
    steps?: RecipeStep[];
    equipmentIds?: string[];
    tagIds?: string[];
    baristaName?: string | null;
  }): Recipe {
    return new Recipe(
      data.id,
      data.title,
      data.brewingConditions,
      data.viewCount,
      data.isPublished,
      data.createdAt,
      data.updatedAt,
      data.steps ?? [],
      data.equipmentIds ?? [],
      data.tagIds ?? [],
      data.baristaName ?? null,
      data.summary,
      data.remarks,
      data.publishedAt,
      data.baristaId
    );
  }

  // Getters
  get id(): RecipeId {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get summary(): string | undefined {
    return this._summary;
  }

  get remarks(): string | undefined {
    return this._remarks;
  }

  get brewingConditions(): BrewingConditions {
    return this._brewingConditions;
  }

  get viewCount(): number {
    return this._viewCount;
  }

  get isPublished(): boolean {
    return this._isPublished;
  }

  get publishedAt(): Date | undefined {
    return this._publishedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get baristaId(): string | undefined {
    return this._baristaId;
  }

  get steps(): readonly RecipeStep[] {
    return [...this._steps];
  }

  get equipmentIds(): readonly string[] {
    return [...this._equipmentIds];
  }

  get tagIds(): readonly string[] {
    return [...this._tagIds];
  }

  get baristaName(): string | null {
    return this._baristaName;
  }

  /**
   * エンティティの等価性を判定
   *
   * @param other - 比較対象のRecipe
   * @returns 等価かどうか
   */
  equals(other: Recipe): boolean {
    return this._id.equals(other._id);
  }
}
