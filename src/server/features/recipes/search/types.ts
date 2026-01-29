import type { RoastLevel } from '@prisma/client';

import type { RecipeSummary, Pagination } from '@/server/shared/schemas';

// スキーマから型をre-export
export type { RecipeSummary, Pagination, RecipeTagSummary } from '@/server/shared/schemas';

// 検索パラメータの型定義
export type SearchRecipesParams = {
  page: number;
  limit: number;
  roastLevel?: RoastLevel[];
  equipment?: string[];
  equipmentType?: string[];
  tags?: string[];
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};

// 検索結果の型定義
export type SearchRecipesResult = {
  recipes: RecipeSummary[];
  pagination: Pagination;
};

// 器具フィルター条件の型定義
export type EquipmentCondition = {
  equipment: {
    some: {
      name?: {
        in: string[];
      };
      equipmentType?: {
        name: {
          in: string[];
        };
      };
    };
  };
};

// Prismaクエリ用の型定義
export type PrismaWhereClause = {
  isPublished: boolean;
  roastLevel?: {
    in: RoastLevel[];
  };
  equipment?: {
    some: {
      name: {
        in: string[];
      };
    };
  };
  OR?: Array<{
    title?: { contains: string; mode: 'insensitive' };
    summary?: { contains: string; mode: 'insensitive' };
  }>;
  AND?: EquipmentCondition[];
};

export type PrismaOrderByClause = Record<string, 'asc' | 'desc'>;
