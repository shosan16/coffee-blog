'use client';

import { useSearchParams } from 'next/navigation';

import RecipeCard from '@/features/recipes/components/RecipeCard';
import { useRecipes } from '@/features/recipes/hooks/useRecipes';
import { parseFiltersFromSearchParams } from '@/features/recipes/lib/filter';
import { RecipeListResponse } from '@/features/recipes/types/api';

type RecipeListProps = {
  initialData: RecipeListResponse;
};

export default function RecipeList({ initialData }: RecipeListProps) {
  const searchParams = useSearchParams();
  const filters = parseFiltersFromSearchParams(searchParams);

  const { recipes, isLoading } = useRecipes(filters);

  // フィルター変更、ソート変更、ページネーション処理などは後で実装

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4">{/* 検索・フィルター・ソートUIは後で実装 */}</div>

      {isLoading ? (
        <div className="text-center">
          <p>ローディング中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.length > 0
            ? recipes.map((recipe) => <RecipeCard key={recipe.id.toString()} recipe={recipe} />)
            : initialData.recipes.map((recipe) => (
                <RecipeCard key={recipe.id.toString()} recipe={recipe} />
              ))}
        </div>
      )}

      {/* ページネーションは後で実装 */}
    </div>
  );
}
