import useSWR from 'swr';

import { fetchRecipes } from '@/features/recipes/lib/recipeApi';
import { RecipeFilters, RecipeListResponse } from '@/features/recipes/types/api';

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
