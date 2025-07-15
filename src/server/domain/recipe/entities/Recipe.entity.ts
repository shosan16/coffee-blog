import { z } from 'zod';

import type { BrewingConditions } from '../value-objects/BrewingConditions';
import type { RecipeId } from '../value-objects/RecipeId';

/**
 * レシピ作成パラメータのZodスキーマ
 */
const RecipeCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Recipe title is required')
    .max(200, 'Recipe title must be 200 characters or less'),
  summary: z.string().trim().max(500, 'Recipe summary must be 500 characters or less').optional(),
  remarks: z.string().trim().max(1000, 'Recipe remarks must be 1000 characters or less').optional(),
  baristaId: z.string().optional(),
});

/**
 * レシピステップのZodスキーマ
 */
const RecipeStepSchema = z.object({
  stepOrder: z.number().int().positive('Step order must be positive'),
  timeSeconds: z.number().int().positive('Time must be positive').optional(),
  description: z.string().min(1, 'Step description is required'),
});

/**
 * レシピエンティティ
 *
 * レシピのライフサイクルとビジネスルールを管理する
 */
export class Recipe {
  private constructor(
    private readonly _id: RecipeId,
    private _title: string,
    private readonly _brewingConditions: BrewingConditions,
    private readonly _viewCount: number = 0,
    private _isPublished: boolean = false,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
    private _steps: RecipeStep[] = [],
    private _equipmentIds: string[] = [],
    private _tagIds: string[] = [],
    private _summary?: string,
    private _remarks?: string,
    private _publishedAt?: Date,
    private readonly _baristaId?: string
  ) {}

  /**
   * 新しいレシピを作成
   *
   * @param params - レシピ作成パラメータ
   * @returns Recipe インスタンス
   * @throws Error 無効な入力の場合
   */
  static create(params: {
    id: RecipeId;
    title: string;
    summary?: string;
    remarks?: string;
    brewingConditions: BrewingConditions;
    baristaId?: string;
  }): Recipe {
    const { id, brewingConditions, ...createParams } = params;

    // Zodスキーマによるバリデーション
    const validatedParams = RecipeCreateSchema.parse(createParams);

    return new Recipe(
      id,
      validatedParams.title,
      brewingConditions,
      0, // 初期ビューカウントは0
      false, // 初期状態は非公開
      new Date(), // 作成日時
      new Date(), // 更新日時
      [], // 初期ステップは空
      [], // 初期器具IDは空
      [], // 初期タグIDは空
      validatedParams.summary,
      validatedParams.remarks,
      undefined, // 公開日時は未設定
      validatedParams.baristaId
    );
  }

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

  /**
   * レシピを公開する
   *
   * @throws Error 既に公開済みの場合
   */
  publish(): void {
    if (this._isPublished) {
      throw new Error('Recipe is already published');
    }

    // 公開前の最終バリデーション
    if (this._steps.length === 0) {
      throw new Error('Cannot publish recipe without steps');
    }

    this._isPublished = true;
    this._publishedAt = new Date();
    this._updatedAt = new Date();
  }

  /**
   * レシピを非公開にする
   *
   * @throws Error 既に非公開の場合
   */
  unpublish(): void {
    if (!this._isPublished) {
      throw new Error('Recipe is already unpublished');
    }

    this._isPublished = false;
    this._publishedAt = undefined;
    this._updatedAt = new Date();
  }

  /**
   * レシピタイトルを更新
   *
   * @param newTitle - 新しいタイトル
   * @throws Error 無効なタイトルの場合
   */
  updateTitle(newTitle: string): void {
    const titleSchema = z
      .string()
      .trim()
      .min(1, 'Recipe title is required')
      .max(200, 'Recipe title must be 200 characters or less');

    const validatedTitle = titleSchema.parse(newTitle);
    this._title = validatedTitle;
    this._updatedAt = new Date();
  }

  /**
   * レシピ概要を更新
   *
   * @param newSummary - 新しい概要
   * @throws Error 無効な概要の場合
   */
  updateSummary(newSummary?: string): void {
    const summarySchema = z
      .string()
      .trim()
      .max(500, 'Recipe summary must be 500 characters or less')
      .optional();

    const validatedSummary = summarySchema.parse(newSummary);
    this._summary = validatedSummary;
    this._updatedAt = new Date();
  }

  /**
   * レシピ備考を更新
   *
   * @param newRemarks - 新しい備考
   * @throws Error 無効な備考の場合
   */
  updateRemarks(newRemarks?: string): void {
    const remarksSchema = z
      .string()
      .trim()
      .max(1000, 'Recipe remarks must be 1000 characters or less')
      .optional();

    const validatedRemarks = remarksSchema.parse(newRemarks);
    this._remarks = validatedRemarks;
    this._updatedAt = new Date();
  }

  /**
   * レシピステップを設定
   *
   * @param steps - レシピステップ配列
   * @throws Error 無効なステップの場合
   */
  setSteps(steps: RecipeStep[]): void {
    // 各ステップのバリデーション
    const validatedSteps = z.array(RecipeStepSchema).parse(steps);

    // ステップの順序をバリデーション
    const sortedSteps = [...validatedSteps].sort((a, b) => a.stepOrder - b.stepOrder);

    for (let i = 0; i < sortedSteps.length; i++) {
      if (sortedSteps[i].stepOrder !== i + 1) {
        throw new Error('Recipe steps must be numbered consecutively starting from 1');
      }
    }

    this._steps = sortedSteps;
    this._updatedAt = new Date();
  }

  /**
   * 器具IDを設定
   *
   * @param equipmentIds - 器具ID配列
   */
  setEquipmentIds(equipmentIds: string[]): void {
    this._equipmentIds = [...equipmentIds];
    this._updatedAt = new Date();
  }

  /**
   * タグIDを設定
   *
   * @param tagIds - タグID配列
   */
  setTagIds(tagIds: string[]): void {
    this._tagIds = [...tagIds];
    this._updatedAt = new Date();
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

/**
 * レシピステップ
 */
export type RecipeStep = {
  readonly stepOrder: number;
  readonly timeSeconds?: number;
  readonly description: string;
};
