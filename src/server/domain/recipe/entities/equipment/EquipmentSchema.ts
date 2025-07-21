import { z } from 'zod';

/**
 * 器具名バリデーションスキーマ
 */
export const EquipmentNameSchema = z
  .string()
  .trim()
  .min(1, 'Equipment name is required')
  .max(200, 'Equipment name must be 200 characters or less');

/**
 * 器具ブランドバリデーションスキーマ
 */
export const EquipmentBrandSchema = z
  .string()
  .trim()
  .max(100, 'Brand name must be 100 characters or less')
  .optional();

/**
 * 器具説明バリデーションスキーマ
 */
export const EquipmentDescriptionSchema = z
  .string()
  .trim()
  .max(1000, 'Equipment description must be 1000 characters or less')
  .optional();

/**
 * アフィリエイトリンクバリデーションスキーマ
 */
export const EquipmentAffiliateLinkSchema = z
  .string()
  .url('Affiliate link must be a valid URL')
  .max(500, 'Affiliate link must be 500 characters or less')
  .optional();

/**
 * 器具タイプバリデーションスキーマ
 */
export const EquipmentTypeSchema = z.object({
  id: z.string().min(1, 'Equipment type ID is required'),
  name: z
    .string()
    .trim()
    .min(1, 'Equipment type name is required')
    .max(100, 'Equipment type name must be 100 characters or less'),
  description: z
    .string()
    .trim()
    .max(500, 'Equipment type description must be 500 characters or less')
    .optional(),
});

/**
 * 器具作成パラメータのZodスキーマ
 */
export const EquipmentCreateSchema = z.object({
  id: z.string().min(1, 'Equipment ID is required'),
  name: EquipmentNameSchema,
  brand: EquipmentBrandSchema,
  description: EquipmentDescriptionSchema,
  affiliateLink: EquipmentAffiliateLinkSchema,
  isAvailable: z.boolean().default(true),
});

/**
 * 器具更新パラメータのZodスキーマ
 */
export const EquipmentUpdateSchema = z.object({
  name: EquipmentNameSchema.optional(),
  brand: EquipmentBrandSchema.nullable(),
  description: EquipmentDescriptionSchema.nullable(),
  affiliateLink: EquipmentAffiliateLinkSchema.nullable(),
});

/**
 * 器具作成パラメータの型定義
 */
export type EquipmentCreateParams = z.infer<typeof EquipmentCreateSchema>;

/**
 * 器具更新パラメータの型定義
 */
export type EquipmentUpdateParams = z.infer<typeof EquipmentUpdateSchema>;

/**
 * 器具タイプの型定義
 */
export type EquipmentType = z.infer<typeof EquipmentTypeSchema>;
