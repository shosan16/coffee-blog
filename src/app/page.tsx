import { Coffee } from 'lucide-react';
import { type ReadonlyURLSearchParams } from 'next/navigation';

import LazyRecipeFilter from '@/client/features/recipes/components/filter/LazyRecipeFilter';
import RecipeList from '@/client/features/recipes/components/RecipeList';
import HeroSearchSection from '@/client/features/recipes/components/search/HeroSearchSection';
import SearchResultsHeader from '@/client/features/recipes/components/search/SearchResultsHeader';
import { parseFiltersFromSearchParams } from '@/client/features/recipes/utils/filter';
import { fetchRecipes } from '@/client/features/recipes/utils/recipeApi';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  // searchParamsをURLSearchParamsに変換
  const urlSearchParams = new URLSearchParams();
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      urlSearchParams.set(key, value);
    } else if (Array.isArray(value)) {
      urlSearchParams.set(key, value.join(','));
    }
  });

  // レシピ専用のフィルター解析関数を使用
  const filters = parseFiltersFromSearchParams(
    urlSearchParams as unknown as ReadonlyURLSearchParams
  );

  // レシピデータの取得
  const initialData = await fetchRecipes(filters);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Search Section */}
      <HeroSearchSection initialResultCount={initialData.pagination.totalItems} />

      {/* Search Results Header */}
      <SearchResultsHeader resultCount={initialData.pagination.totalItems} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* メインコンテンツ */}
          <div className="min-w-0 flex-1">
            {/* モバイル用フィルター */}
            <div className="mb-6 lg:hidden">
              <LazyRecipeFilter />
            </div>

            <RecipeList initialData={initialData} />
          </div>
          {/* サイドバー（フィルター） */}
          <aside className="hidden w-100 flex-shrink-0 lg:block">
            <div className="top-32">
              <LazyRecipeFilter />
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border bg-background mt-16 border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Coffee className="text-foreground h-5 w-5" />
            <span className="text-foreground font-semibold">Coffee Recipe Collection</span>
          </div>
          <p className="text-muted-foreground text-sm">
            美味しいコーヒーと共に、素敵な時間をお過ごしください
          </p>
        </div>
      </footer>
    </div>
  );
}
