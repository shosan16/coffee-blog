/**
 * レシピ一覧用スキーマ
 *
 * レシピ検索結果のレスポンス型を定義
 * Zodスキーマから型を導出することで、型の一元管理を実現
 */

import { z } from 'zod';

import { PaginationSchema } from './pagination.schema';

/**
 * タグ要約情報のZodスキーマ
 *
 * レシピ一覧表示に必要な最小限のタグ情報を定義。
 */
export const RecipeTagSummarySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  })
  .strict();

/**
 * タグ要約情報の型
 */
export type RecipeTagSummary = z.infer<typeof RecipeTagSummarySchema>;

/**
 * レシピ要約情報のZodスキーマ
 *
 * レシピ一覧表示に必要な情報を定義。
 * strict()により未知のプロパティを拒否し、型安全性を確保。
 */
export const RecipeSummarySchema = z
  .object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    equipment: z.array(z.string()),
    roastLevel: z.string(),
    tags: z.array(RecipeTagSummarySchema),
    /** バリスタ未設定の場合はnull */
    baristaName: z.string().nullable(),
  })
  .strict();

/**
 * レシピ要約情報の型
 *
 * ZodスキーマからTypeScript型を導出
 */
export type RecipeSummary = z.infer<typeof RecipeSummarySchema>;

/**
 * レシピ一覧レスポンスのZodスキーマ
 *
 * レシピ検索APIのレスポンス全体の構造を定義。
 */
export const RecipeListResponseSchema = z
  .object({
    recipes: z.array(RecipeSummarySchema),
    pagination: PaginationSchema,
  })
  .strict();

/**
 * レシピ一覧レスポンスの型
 *
 * ZodスキーマからTypeScript型を導出
 */
export type RecipeListResponse = z.infer<typeof RecipeListResponseSchema>;
