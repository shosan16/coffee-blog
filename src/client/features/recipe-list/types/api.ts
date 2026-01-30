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
  equipment?: string[];
  equipmentType?: string[];
  tags?: string[];
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};
