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
  /** 焙煎レベルフィルター（文字列配列） */
  roastLevel?: string[];
  /** 挽き目フィルター（文字列配列） */
  grindSize?: string[];
  equipment?: string[];
  equipmentType?: string[];
  tags?: string[];
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
