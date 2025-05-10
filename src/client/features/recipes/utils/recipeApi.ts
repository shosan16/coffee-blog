import { RecipeFilters, RecipeListResponse } from '@/client/features/recipes/types/api';
import { apiRequest } from '@/client/shared/api/request';

/**
 * レシピのリストを取得する関数
 */
export async function fetchRecipes(filters: RecipeFilters = {}): Promise<RecipeListResponse> {
  try {
    return await apiRequest<RecipeListResponse>('/api/recipes', {
      params: filters,
      cache: 'no-store',
    });
  } catch (error) {
    console.error('レシピ取得エラー:', error);
    // APIがない場合やエラーの場合はモックデータを返す
    return {
      recipes: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
    };
  }
}
