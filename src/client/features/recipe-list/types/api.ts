import type { RoastLevel, GrindSize } from '@prisma/client';

import type { Recipe } from '@/client/features/recipe-list/types/recipe';

/**
 * ページネーション情報の型定義
 */
type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

export type RecipeListResponse = {
  recipes: Recipe[];
  pagination: Pagination;
};

export type RecipeFilters = {
  page?: number;
  limit?: number;
  roastLevel?: RoastLevel[];
  grindSize?: GrindSize[];
  equipment?: string[];
  equipmentType?: string[];
  beanWeight?: {
    min?: number;
    max?: number;
  };
  waterTemp?: {
    min?: number;
    max?: number;
  };
  waterAmount?: {
    min?: number;
    max?: number;
  };
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};
