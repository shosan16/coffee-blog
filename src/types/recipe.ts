import { RoastLevel, GrindSize } from '@prisma/client';

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
};

export type RecipeListResponse = {
  recipes: Recipe[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

export type RecipeFilters = {
  page?: number;
  limit?: number;
  roastLevel?: RoastLevel[];
  grindSize?: GrindSize[];
  equipment?: string[];
  beanWeight?: {
    min?: number;
    max?: number;
  };
  waterTemp?: {
    min?: number;
    max?: number;
  };
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};

export type ErrorResponse = {
  code: string;
  message: string;
  details?: Record<string, string[]>;
};
