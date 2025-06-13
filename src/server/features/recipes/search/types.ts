import { RoastLevel, GrindSize } from '@prisma/client';

import type { Recipe } from '@/server/features/recipes/types/recipe';

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
  beanWeight?: RangeFilter;
  waterTemp?: RangeFilter;
  waterAmount?: RangeFilter;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};

// 検索結果の型定義
export type SearchRecipesResult = {
  recipes: Recipe[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
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
  AND?: Array<{
    equipment?: {
      some: {
        equipmentType: {
          name: {
            in: string[];
          };
        };
      };
    };
  }>;
};

export type PrismaOrderByClause = Record<string, 'asc' | 'desc'>;
