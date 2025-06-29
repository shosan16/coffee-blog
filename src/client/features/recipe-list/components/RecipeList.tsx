'use client';

import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import RecipeCard from '@/client/features/recipe-list/components/RecipeCard';
import { useRecipes } from '@/client/features/recipe-list/hooks/useRecipes';
import { RecipeListResponse } from '@/client/features/recipe-list/types/api';
import { parseFiltersFromSearchParams } from '@/client/features/recipe-list/utils/filter';
import RecipePagination from '@/components/Pagination';

type RecipeListProps = {
  initialData: RecipeListResponse;
};

export default function RecipeList({ initialData }: RecipeListProps) {
  const searchParams = useSearchParams();
  const filters = parseFiltersFromSearchParams(searchParams);

  const { recipes, pagination, isLoading } = useRecipes(filters);

  return (
    <div className="space-y-8">
      {/* レシピグリッド */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        {!isLoading && recipes.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black bg-white">
                <Search className="h-8 w-8 text-black" />
              </div>
              <div>
                <p className="mb-2 text-lg font-medium text-black">レシピが見つかりませんでした</p>
                <p className="text-sm text-black">検索条件を変更してお試しください</p>
              </div>
            </div>
          </div>
        )}

        {(isLoading ? initialData.recipes : recipes).map((recipe, index) => (
          <div
            key={recipe.id}
            className="animate-fade-in"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both',
            }}
          >
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>

      {/* ローディング状態 */}
      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          {Array.from({ length: 8 }, () => ({ id: crypto.randomUUID() })).map((item) => (
            <div key={item.id} className="animate-pulse">
              <div className="space-y-4 rounded-xl border border-black bg-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-black" />
                    <div className="h-3 w-full rounded bg-black" />
                    <div className="h-3 w-2/3 rounded bg-black" />
                  </div>
                  <div className="h-12 w-12 rounded-full bg-black" />
                </div>
                <div className="space-y-3">
                  <div className="h-12 rounded-lg border border-black bg-white" />
                  <div className="h-12 rounded-lg border border-black bg-white" />
                  <div className="h-12 rounded-lg border border-black bg-white" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 rounded bg-black" />
                  <div className="h-6 w-12 rounded bg-black" />
                </div>
                <div className="h-8 rounded bg-black" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ページネーション */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <div className="rounded-xl border border-black bg-white p-4 shadow-lg">
            <RecipePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
            />
          </div>
        </div>
      )}
    </div>
  );
}
