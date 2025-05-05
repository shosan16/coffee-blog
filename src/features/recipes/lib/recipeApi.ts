import { RecipeFilters, RecipeListResponse } from '@/features/recipes/types/api';

export async function fetchRecipes(filters: RecipeFilters = {}): Promise<RecipeListResponse> {
  try {
    // URLSearchParamsオブジェクトを作成
    const params = new URLSearchParams();

    // フィルターパラメータを追加
    if (filters.page !== undefined) params.set('page', filters.page.toString());
    if (filters.limit !== undefined) params.set('limit', filters.limit.toString());
    if (filters.search) params.set('search', filters.search);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.order) params.set('order', filters.order);

    // 配列パラメータの処理
    if (filters.roastLevel?.length) params.set('roastLevel', filters.roastLevel.join(','));
    if (filters.grindSize?.length) params.set('grindSize', filters.grindSize.join(','));
    if (filters.equipment?.length) params.set('equipment', filters.equipment.join(','));

    // オブジェクトパラメータの処理
    if (filters.beanWeight) params.set('beanWeight', JSON.stringify(filters.beanWeight));
    if (filters.waterTemp) params.set('waterTemp', JSON.stringify(filters.waterTemp));

    // APIリクエスト
    const queryString = params.toString();
    const url = `/api/recipes${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error('APIからのレスポンスが正常ではありません');
    }

    return await response.json();
  } catch (error) {
    console.error('レシピ取得エラー:', error);
    // APIがない場合やエラーの場合はモックデータを返す
    return {
      recipes: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
    };
  }
}
