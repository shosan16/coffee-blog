import type { RoastLevel, GrindSize } from '@prisma/client';

/**
 * タグ要約型
 */
export type RecipeTagSummary = {
  id: string;
  name: string;
  slug: string;
};

// Recipe型の定義（client側の型と一致させる）
export type Recipe = {
  id: string;
  title: string;
  summary: string;
  equipment: string[];
  roastLevel: RoastLevel;
  grindSize: GrindSize | null;
  beanWeight: number;
  waterTemp: number;
  waterAmount: number;
  tags: RecipeTagSummary[];
  baristaName: string | null;
};

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
  recipes: Recipe[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
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
