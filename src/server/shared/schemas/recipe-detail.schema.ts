/**
 * レシピ詳細用スキーマ
 *
 * レシピ詳細取得のレスポンス型を定義
 * Zodスキーマから型を導出することで、型の一元管理を実現
 */

import { z } from 'zod';

/**
 * SNSリンク情報のZodスキーマ
 *
 * バリスタのソーシャルメディアプロフィールを定義。
 */
export const SocialLinkSchema = z
  .object({
    id: z.string(),
    platform: z.string(),
    url: z.string(),
  })
  .strict();

/**
 * SNSリンク情報の型
 */
export type SocialLink = z.infer<typeof SocialLinkSchema>;

/**
 * バリスタ情報のZodスキーマ
 *
 * レシピ作成者（バリスタ）のプロフィール情報を定義。
 */
export const BaristaSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    affiliation: z.string().optional(),
    socialLinks: z.array(SocialLinkSchema),
  })
  .strict();

/**
 * バリスタ情報の型
 */
export type Barista = z.infer<typeof BaristaSchema>;

/**
 * レシピステップのZodスキーマ
 *
 * 抽出手順の各ステップを定義。stepOrderで順序を保証。
 */
export const RecipeStepSchema = z
  .object({
    id: z.string(),
    stepOrder: z.number().int().positive(),
    /** 省略可能（待機ステップ等、時間が不要な場合） */
    timeSeconds: z.number().int().nonnegative().optional(),
    description: z.string(),
  })
  .strict();

/**
 * レシピステップの型
 */
export type RecipeStep = z.infer<typeof RecipeStepSchema>;

/**
 * 器具タイプ情報のZodスキーマ
 *
 * 器具のカテゴリ（ドリッパー、ケトル等）を定義。
 */
export const EquipmentTypeSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
  })
  .strict();

/**
 * 器具タイプ情報の型
 */
export type EquipmentType = z.infer<typeof EquipmentTypeSchema>;

/**
 * 詳細な器具情報のZodスキーマ
 *
 * レシピ詳細画面で表示する器具情報。アフィリエイトリンク対応。
 */
export const DetailedEquipmentSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    brand: z.string().optional(),
    description: z.string().optional(),
    affiliateLink: z.string().optional(),
    equipmentType: EquipmentTypeSchema,
  })
  .strict();

/**
 * 詳細な器具情報の型
 */
export type DetailedEquipment = z.infer<typeof DetailedEquipmentSchema>;

/**
 * レシピタグのZodスキーマ
 *
 * レシピのカテゴリ分類用タグ。slugはURL生成に使用。
 */
export const RecipeTagSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  })
  .strict();

/**
 * レシピタグの型
 */
export type RecipeTag = z.infer<typeof RecipeTagSchema>;

/**
 * レシピ詳細情報のZodスキーマ
 *
 * レシピ詳細画面の全情報を定義。日時はISO 8601文字列。
 */
export const RecipeDetailSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    summary: z.string().optional(),
    remarks: z.string().optional(),
    roastLevel: z.string(),
    /** ドリップ以外の抽出方法では省略可能 */
    grindSize: z.string().optional(),
    beanWeight: z.number().optional(),
    waterTemp: z.number().optional(),
    waterAmount: z.number().optional(),
    viewCount: z.number().int().nonnegative(),
    isPublished: z.boolean(),
    publishedAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    barista: BaristaSchema.optional(),
    steps: z.array(RecipeStepSchema),
    equipment: z.array(DetailedEquipmentSchema),
    tags: z.array(RecipeTagSchema),
  })
  .strict();

/**
 * レシピ詳細情報の型
 */
export type RecipeDetail = z.infer<typeof RecipeDetailSchema>;

/**
 * レシピ詳細取得レスポンスのZodスキーマ
 *
 * 詳細取得時にviewCountをインクリメントし、更新後の値をnewViewCountで返却。
 */
export const RecipeDetailResponseSchema = z
  .object({
    recipe: RecipeDetailSchema,
    newViewCount: z.number().int().nonnegative(),
  })
  .strict();

/**
 * レシピ詳細取得レスポンスの型
 */
export type RecipeDetailResponse = z.infer<typeof RecipeDetailResponseSchema>;
