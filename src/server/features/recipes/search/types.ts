import type { RoastLevel, GrindSize } from '@prisma/client';

import type { RecipeSummary, Pagination } from '@/server/shared/schemas';

// スキーマから型をre-export
export type { RecipeSummary, Pagination, RecipeTagSummary } from '@/server/shared/schemas';

// 範囲フィルター用の型
export type RangeFilter = {
  min?: number;
  max?: number;
};

// 検索パラメータの型定義
export type SearchRecipesParams = {
  page: number;
  limit: number;
  roastLevel?: RoastLevel[];
  grindSize?: GrindSize[];
  equipment?: string[];
  equipmentType?: string[];
  tags?: string[];
  beanWeight?: RangeFilter;
  waterTemp?: RangeFilter;
  waterAmount?: RangeFilter;
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
  grindSize?: {
    in: GrindSize[];
  };
  equipment?: {
    some: {
      name: {
        in: string[];
      };
    };
  };
  beanWeight?: {
    gte?: number;
    lte?: number;
  };
  waterTemp?: {
    gte?: number;
    lte?: number;
  };
  waterAmount?: {
    gte?: number;
    lte?: number;
  };
  OR?: Array<{
    title?: { contains: string; mode: 'insensitive' };
    summary?: { contains: string; mode: 'insensitive' };
  }>;
  AND?: EquipmentCondition[];
};

export type PrismaOrderByClause = Record<string, 'asc' | 'desc'>;
