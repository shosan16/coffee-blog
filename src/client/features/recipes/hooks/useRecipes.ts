import useSWR from 'swr';

import { RecipeFilters, RecipeListResponse } from '@/client/features/recipes/types/api';
import { fetchRecipes } from '@/client/features/recipes/utils/recipeApi';

export function useRecipes(filters: RecipeFilters) {
  const { data, error, isLoading, mutate } = useSWR<RecipeListResponse>(
    [`/api/recipes`, filters],

    ([_url, filterValues]: [string, RecipeFilters]) => fetchRecipes(filterValues)
  );

  return {
    recipes: data?.recipes || [],
    pagination: data?.pagination,
    isLoading,
    isError: !!error,
    mutate,
  };
}
