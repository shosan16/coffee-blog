import { RoastLevel, GrindSize } from '@prisma/client';

import RecipeList from '@/features/recipes/components/RecipeList';
import { fetchRecipes } from '@/features/recipes/lib/recipeApi';
import { RecipeFilters } from '@/features/recipes/types/api';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // searchParamsをRecipeFilters型に変換
  const filters: RecipeFilters = {};

  // 基本的なパラメータの変換
  if (searchParams.page) filters.page = Number(searchParams.page as string);
  if (searchParams.limit) filters.limit = Number(searchParams.limit as string);
  if (searchParams.search) filters.search = searchParams.search as string;
  if (searchParams.sort) filters.sort = searchParams.sort as string;
  if (searchParams.order) {
    const orderValue = searchParams.order as string;
    filters.order = orderValue === 'asc' || orderValue === 'desc' ? orderValue : undefined;
  }

  // 配列パラメータの変換
  if (searchParams.roastLevel) {
    const roastLevels = (searchParams.roastLevel as string).split(',') as RoastLevel[];
    filters.roastLevel = roastLevels;
  }

  if (searchParams.grindSize) {
    const grindSizes = (searchParams.grindSize as string).split(',') as GrindSize[];
    filters.grindSize = grindSizes;
  }

  if (searchParams.equipment) {
    const equipment = (searchParams.equipment as string).split(',');
    filters.equipment = equipment;
  }

  // オブジェクトパラメータの変換
  if (searchParams.beanWeight) {
    try {
      filters.beanWeight = JSON.parse(searchParams.beanWeight as string);
    } catch (e) {
      // パースエラーの場合は無視
    }
  }

  if (searchParams.waterTemp) {
    try {
      filters.waterTemp = JSON.parse(searchParams.waterTemp as string);
    } catch (e) {
      // パースエラーの場合は無視
    }
  }

  // 初期データの取得
  const initialData = await fetchRecipes(filters);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-8 text-3xl font-bold">コーヒーレシピ一覧</h1>
      <RecipeList initialData={initialData} />
    </div>
  );
}
