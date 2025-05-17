import { type ReadonlyURLSearchParams } from 'next/navigation';

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
    <main className="container mx-auto p-4">
      <h1 className="mb-8 text-3xl font-bold">コーヒーレシピ一覧</h1>
      <RecipeList initialData={initialData} />
    </main>
  );
}
