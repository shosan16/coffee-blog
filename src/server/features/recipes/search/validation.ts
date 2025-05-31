import { RoastLevel, GrindSize } from '@prisma/client';
import { z } from 'zod';

// 検索クエリパラメータのバリデーションスキーマ
export const searchRecipesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  roastLevel: z.array(z.nativeEnum(RoastLevel)).optional(),
  grindSize: z.array(z.nativeEnum(GrindSize)).optional(),
  equipment: z.array(z.string()).optional(),
  beanWeight: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  waterTemp: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

// バリデーション済みパラメータの型
export type ValidatedSearchParams = z.infer<typeof searchRecipesQuerySchema>;
