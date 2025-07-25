import { z } from 'zod';

/**
 * バリスタ名バリデーションスキーマ
 */
export const BaristaNameSchema = z
  .string()
  .trim()
  .min(1, 'Barista name is required')
  .max(100, 'Barista name must be 100 characters or less');

/**
 * バリスタ所属バリデーションスキーマ
 */
export const BaristaAffiliationSchema = z
  .string()
  .trim()
  .max(200, 'Affiliation must be 200 characters or less')
  .optional();

/**
 * バリスタ作成パラメータのZodスキーマ
 */
export const BaristaCreateSchema = z
  .object({
    id: z.string().min(1, 'Barista ID is required'),
    name: BaristaNameSchema,
    affiliation: BaristaAffiliationSchema,
  })
  .strict();

/**
 * バリスタ更新パラメータのZodスキーマ
 */
export const BaristaUpdateSchema = z
  .object({
    name: BaristaNameSchema.optional(),
    affiliation: z
      .string()
      .trim()
      .max(200, 'Affiliation must be 200 characters or less')
      .optional()
      .nullable(),
  })
  .strict();

/**
 * バリスタ作成パラメータの型定義
 */
export type BaristaCreateParams = z.infer<typeof BaristaCreateSchema>;

/**
 * バリスタ更新パラメータの型定義
 */
export type BaristaUpdateParams = z.infer<typeof BaristaUpdateSchema>;
