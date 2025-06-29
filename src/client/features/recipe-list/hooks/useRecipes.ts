import useSWR from 'swr';

import { RecipeFilters, RecipeListResponse } from '@/client/features/recipe-list/types/api';
import { fetchRecipes } from '@/client/features/recipe-list/utils/recipeApi';

export function useRecipes(filters: RecipeFilters): {
  recipes: RecipeListResponse['recipes'];
  pagination: RecipeListResponse['pagination'] | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: () => Promise<RecipeListResponse | undefined>;
} {
  const { data, error, isLoading, mutate } = useSWR<RecipeListResponse>(
    [`/api/recipes`, filters],
    async ([_url, filterValues]: [string, RecipeFilters]) => {
      return await fetchRecipes(filterValues);
    }
  );

  return {
    recipes: data?.recipes ?? [],
    pagination: data?.pagination,
    isLoading,
    isError: !!error,
    mutate,
  };
}
