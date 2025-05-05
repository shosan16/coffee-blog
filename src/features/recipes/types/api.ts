export type { RecipeListResponse, RecipeFilters } from '@/types/recipe';

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};
