'use client';

import { useSearchParams } from 'next/navigation';

import RecipeCard from '@/client/features/recipes/components/RecipeCard';
import { useRecipes } from '@/client/features/recipes/hooks/useRecipes';
import { RecipeListResponse } from '@/client/features/recipes/types/api';
import { parseFiltersFromSearchParams } from '@/client/features/recipes/utils/filter';
import RecipePagination from '@/components/Pagination';

type RecipeListProps = {
  initialData: RecipeListResponse;
};

export default function RecipeList({ initialData }: RecipeListProps) {
  const searchParams = useSearchParams();
  const filters = parseFiltersFromSearchParams(searchParams);

  const { recipes, pagination, isLoading } = useRecipes(filters);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!isLoading && recipes.length === 0 && (
          <p className="col-span-full py-10 text-center">レシピが見つかりませんでした。</p>
        )}

        {(isLoading ? initialData.recipes : recipes).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* ページネーション */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8">
          <RecipePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
          />
        </div>
      )}
    </div>
  );
}
