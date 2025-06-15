import { Coffee, Search } from 'lucide-react';
import { type ReadonlyURLSearchParams } from 'next/navigation';

import LazyRecipeFilter from '@/client/features/recipes/components/filter/LazyRecipeFilter';
import RecipeList from '@/client/features/recipes/components/RecipeList';
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 py-16 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <Coffee className="mb-6 h-16 w-16 text-amber-200" />
            <h1 className="mb-4 text-5xl font-bold tracking-tight">Coffee Recipe Collection</h1>
            <p className="mb-8 max-w-2xl text-xl text-amber-100">
              プロのバリスタが考案した最高のコーヒーレシピで
              <br />
              おうちカフェを極上の体験に
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="sticky top-0 z-10 border-b bg-white/70 py-6 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {initialData.pagination.totalItems}件のレシピが見つかりました
            </span>
          </div>
        </div>
      </div>

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
      <footer className="mt-16 border-t bg-white/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Coffee className="h-5 w-5 text-amber-700" />
            <span className="font-semibold text-gray-800">Coffee Recipe Collection</span>
          </div>
          <p className="text-sm text-gray-600">
            美味しいコーヒーと共に、素敵な時間をお過ごしください
          </p>
        </div>
      </footer>
    </div>
  );
}
