import { Coffee } from 'lucide-react';
import type { ReadonlyURLSearchParams } from 'next/navigation';

import SearchResultsHeader from '@/client/features/recipe-list/components/layout/SearchResultsHeader';
import RecipeList from '@/client/features/recipe-list/components/list/RecipeList';
import HeroSearchSection from '@/client/features/recipe-list/components/search/HeroSearchSection';
import { parseFiltersFromSearchParams } from '@/client/features/recipe-list/utils/filter';
import { fetchRecipes } from '@/client/features/recipe-list/utils/recipeApi';

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
        <div className="flex flex-col gap-4">
          <RecipeList initialData={initialData} />
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
