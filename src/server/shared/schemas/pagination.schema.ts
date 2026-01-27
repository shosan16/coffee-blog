/**
 * ページネーションスキーマ
 *
 * APIレスポンスのページネーション情報を定義
 * Zodスキーマから型を導出することで、型の一元管理を実現
 */

import { z } from 'zod';

/**
 * ページネーション情報のZodスキーマ
 *
 * APIレスポンスにおけるページネーション情報の構造を定義。
 * strict()により未知のプロパティを拒否し、型安全性を確保。
 */
export const PaginationSchema = z
  .object({
    currentPage: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
    totalItems: z.number().int().nonnegative(),
    itemsPerPage: z.number().int().positive(),
  })
  .strict();

/**
 * ページネーション情報の型
 *
 * ZodスキーマからTypeScript型を導出
 */
export type Pagination = z.infer<typeof PaginationSchema>;
