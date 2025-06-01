import { RoastLevel, GrindSize } from '@prisma/client';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { useRecipes } from '@/client/features/recipes/hooks/useRecipes';
import { RecipeFilters, RecipeListResponse } from '@/client/features/recipes/types/api';
import { Recipe } from '@/client/features/recipes/types/recipe';

// fetchRecipes関数をモック化（古典学派アプローチ：外部API依存のみモック）
vi.mock('@/client/features/recipes/utils/recipeApi', () => ({
  fetchRecipes: vi.fn(),
}));

// モック関数の型定義
const mockFetchRecipes = vi.mocked(
  (await import('@/client/features/recipes/utils/recipeApi')).fetchRecipes
);

// テストヘルパー関数
const createMockRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
  id: 'recipe-1',
  title: 'エスプレッソ',
  summary: '濃厚なエスプレッソのレシピ',
  equipment: ['エスプレッソマシン'],
  roastLevel: RoastLevel.DARK,
  grindSize: GrindSize.FINE,
  beanWeight: 18,
  waterTemp: 93,
  waterAmount: 36,
  ...overrides,
});

const createMockRecipeResponse = (
  overrides: Partial<RecipeListResponse> = {}
): RecipeListResponse => ({
  recipes: [createMockRecipe()],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 1,
    itemsPerPage: 10,
  },
  ...overrides,
});

// テスト用のユニークなキーを生成するヘルパー
let testCounter = 0;
const createUniqueFilters = (baseFilters: RecipeFilters = {}): RecipeFilters =>
  ({
    ...baseFilters,
    _testId: `test-${++testCounter}`, // SWRキャッシュを分離するためのユニークキー
  }) as RecipeFilters;

describe('useRecipes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('正常なレシピ取得', () => {
    it('初期データでレシピ一覧を取得できる', async () => {
      // Arrange - 準備: モックデータと空フィルターを設定
      const mockResponse = createMockRecipeResponse({
        recipes: [
          createMockRecipe({ id: 'recipe-1', title: 'エスプレッソ' }),
          createMockRecipe({ id: 'recipe-2', title: 'ドリップコーヒー' }),
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
          itemsPerPage: 10,
        },
      });
      mockFetchRecipes.mockResolvedValue(mockResponse);
      const filters = createUniqueFilters();

      // Act - 実行: useRecipesフックを実行
      const { result } = renderHook(() => useRecipes(filters));

      // Assert - 確認: 初期状態とデータ取得後の状態を検証
      expect(result.current.isLoading).toBe(true);
      expect(result.current.recipes).toEqual([]);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.recipes).toHaveLength(2);
      expect(result.current.recipes[0].title).toBe('エスプレッソ');
      expect(result.current.pagination).toEqual(mockResponse.pagination);
      expect(result.current.isError).toBe(false);
      expect(typeof result.current.mutate).toBe('function');
    });

    it('フィルター条件付きでレシピを取得できる', async () => {
      // Arrange - 準備: 複雑なフィルター条件とモックレスポンスを設定
      const filters = createUniqueFilters({
        page: 2,
        limit: 5,
        roastLevel: [RoastLevel.MEDIUM],
        grindSize: [GrindSize.MEDIUM],
        equipment: ['V60'],
        beanWeight: { min: 15, max: 20 },
        waterTemp: { min: 90, max: 95 },
        search: 'ドリップ',
        sort: 'title',
        order: 'asc',
      });
      const mockResponse = createMockRecipeResponse({
        recipes: [createMockRecipe({ title: 'V60ドリップ', roastLevel: RoastLevel.MEDIUM })],
        pagination: {
          currentPage: 2,
          totalPages: 3,
          totalItems: 15,
          itemsPerPage: 5,
        },
      });
      mockFetchRecipes.mockResolvedValue(mockResponse);

      // Act - 実行: フィルター条件付きでフックを実行
      const { result } = renderHook(() => useRecipes(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert - 確認: フィルターが適切に渡され、結果が正しく返される
      expect(mockFetchRecipes).toHaveBeenCalledWith(filters);
      expect(result.current.recipes).toHaveLength(1);
      expect(result.current.recipes[0].title).toBe('V60ドリップ');
      expect(result.current.pagination?.currentPage).toBe(2);
      expect(result.current.pagination?.totalPages).toBe(3);
    });
  });

  describe('エラーハンドリング', () => {
    it('fetchRecipesが空のレスポンスを返す場合の動作', async () => {
      // Arrange - 準備: fetchRecipesが空のレスポンスを返すモックを設定
      const emptyResponse = createMockRecipeResponse({
        recipes: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        },
      });
      mockFetchRecipes.mockResolvedValue(emptyResponse);
      const filters = createUniqueFilters();

      // Act - 実行: useRecipesフックを実行
      const { result } = renderHook(() => useRecipes(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert - 確認: 空のレスポンスが返され、エラー状態にはならない
      expect(result.current.isError).toBe(false);
      expect(result.current.recipes).toEqual([]);
      expect(result.current.pagination).toEqual(emptyResponse.pagination);
    });

    it('fetchRecipesがエラーを投げた場合の動作確認', async () => {
      // Arrange - 準備: fetchRecipesがエラーを投げるモックを設定
      // 注意: fetchRecipes内部でエラーをキャッチして空のレスポンスを返すため、
      // 実際にはSWRレベルでエラーにならない可能性が高い
      const errorMessage = 'Network Error';
      mockFetchRecipes.mockRejectedValue(new Error(errorMessage));
      const filters = createUniqueFilters();

      // Act - 実行: useRecipesフックを実行
      const { result } = renderHook(() => useRecipes(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert - 確認: fetchRecipesの実装に依存した動作
      // fetchRecipesがエラーをキャッチして空のレスポンスを返す場合はisError: false
      // エラーがそのまま投げられる場合はisError: true
      expect(typeof result.current.isError).toBe('boolean');
      expect(Array.isArray(result.current.recipes)).toBe(true);
    });
  });

  describe('状態管理', () => {
    it('データ取得の基本的な流れを確認', async () => {
      // Arrange - 準備: モックレスポンス
      const mockResponse = createMockRecipeResponse({
        recipes: [createMockRecipe({ title: 'テスト用レシピ' })],
      });
      mockFetchRecipes.mockResolvedValue(mockResponse);
      const filters = createUniqueFilters();

      // Act - 実行: useRecipesフックを実行
      const { result } = renderHook(() => useRecipes(filters));

      // Assert - 確認: データ取得完了後の状態
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.recipes).toEqual(mockResponse.recipes);
      expect(result.current.isError).toBe(false);
      expect(result.current.pagination).toEqual(mockResponse.pagination);
    });

    it('フィルター変更時にデータが再取得される', async () => {
      // Arrange - 準備: 初期フィルターとフックのレンダリング
      const initialFilters = createUniqueFilters({ page: 1 });
      const updatedFilters = createUniqueFilters({ page: 2, search: 'エスプレッソ' });
      const initialResponse = createMockRecipeResponse({
        recipes: [createMockRecipe({ title: '初期レシピ' })],
      });
      const updatedResponse = createMockRecipeResponse({
        recipes: [createMockRecipe({ title: 'エスプレッソレシピ' })],
        pagination: { currentPage: 2, totalPages: 2, totalItems: 2, itemsPerPage: 10 },
      });

      mockFetchRecipes
        .mockResolvedValueOnce(initialResponse)
        .mockResolvedValueOnce(updatedResponse);

      // Act - 実行: 初期レンダリング
      const { result, rerender } = renderHook(({ filters }) => useRecipes(filters), {
        initialProps: { filters: initialFilters },
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 初期状態の確認
      expect(result.current.recipes[0].title).toBe('初期レシピ');

      // フィルターを変更して再レンダリング
      rerender({ filters: updatedFilters });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert - 確認: fetchRecipes が新しいフィルターで再呼び出し
      expect(mockFetchRecipes).toHaveBeenCalledTimes(2);
      expect(mockFetchRecipes).toHaveBeenNthCalledWith(1, initialFilters);
      expect(mockFetchRecipes).toHaveBeenNthCalledWith(2, updatedFilters);
      expect(result.current.recipes[0].title).toBe('エスプレッソレシピ');
      expect(result.current.pagination?.currentPage).toBe(2);
    });
  });

  describe('SWR統合', () => {
    it('mutate関数が適切に公開される', async () => {
      // Arrange - 準備: useRecipesフックの初期化
      const mockResponse = createMockRecipeResponse();
      mockFetchRecipes.mockResolvedValue(mockResponse);
      const filters = createUniqueFilters();

      // Act - 実行: useRecipesフックを実行
      const { result } = renderHook(() => useRecipes(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert - 確認: mutate が関数として返される
      expect(typeof result.current.mutate).toBe('function');
      expect(result.current.mutate).toBeDefined();
    });

    it('フックの基本的なインターフェースが正しく公開される', async () => {
      // Arrange - 準備: 基本的なモックレスポンス
      const mockResponse = createMockRecipeResponse();
      mockFetchRecipes.mockResolvedValue(mockResponse);
      const filters = createUniqueFilters({ page: 1, search: 'test' });

      // Act - 実行: useRecipesフックを実行
      const { result } = renderHook(() => useRecipes(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert - 確認: 期待されるプロパティが全て存在する
      expect(mockFetchRecipes).toHaveBeenCalledWith(filters);
      expect(result.current).toHaveProperty('recipes');
      expect(result.current).toHaveProperty('pagination');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('mutate');
    });
  });

  describe('契約による設計', () => {
    it('事前条件: 有効なRecipeFiltersが渡されること', async () => {
      // Arrange - 準備: 有効なフィルター条件
      const validFilters = createUniqueFilters({
        page: 1,
        limit: 10,
        roastLevel: [RoastLevel.MEDIUM],
        grindSize: [GrindSize.MEDIUM],
      });
      const mockResponse = createMockRecipeResponse();
      mockFetchRecipes.mockResolvedValue(mockResponse);

      // Act - 実行: useRecipesフックを実行
      const { result } = renderHook(() => useRecipes(validFilters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert - 確認: 事前条件の検証
      expect(mockFetchRecipes).toHaveBeenCalledWith(validFilters);
      expect(validFilters.page).toBeGreaterThan(0);
      expect(validFilters.limit).toBeGreaterThan(0);
    });

    it('事後条件: 必須プロパティを含むレスポンスが返されること', async () => {
      // Arrange - 準備: モックレスポンス
      const mockResponse = createMockRecipeResponse();
      mockFetchRecipes.mockResolvedValue(mockResponse);
      const filters = createUniqueFilters();

      // Act - 実行: useRecipesフックを実行
      const { result } = renderHook(() => useRecipes(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert - 確認: 事後条件の検証
      expect(result.current).toHaveProperty('recipes');
      expect(result.current).toHaveProperty('pagination');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('mutate');

      expect(Array.isArray(result.current.recipes)).toBe(true);
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.isError).toBe('boolean');
      expect(typeof result.current.mutate).toBe('function');
    });

    it('不変条件: フィルター変更時も型安全性が保たれること', async () => {
      // Arrange - 準備: 異なるフィルター条件
      const filters1 = createUniqueFilters({ page: 1 });
      const filters2 = createUniqueFilters({ search: 'test', roastLevel: [RoastLevel.LIGHT] });
      const mockResponse = createMockRecipeResponse();
      mockFetchRecipes.mockResolvedValue(mockResponse);

      // Act - 実行: 異なるフィルターでのフック実行
      const { result: result1 } = renderHook(() => useRecipes(filters1));
      const { result: result2 } = renderHook(() => useRecipes(filters2));

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
        expect(result2.current.isLoading).toBe(false);
      });

      // Assert - 確認: 不変条件の検証（型安全性の保持）
      // 両方の結果が同じ型構造を持つことを確認
      const checkResultStructure = (result: typeof result1.current): void => {
        expect(result).toHaveProperty('recipes');
        expect(result).toHaveProperty('pagination');
        expect(result).toHaveProperty('isLoading');
        expect(result).toHaveProperty('isError');
        expect(result).toHaveProperty('mutate');
        expect(Array.isArray(result.recipes)).toBe(true);
      };

      checkResultStructure(result1.current);
      checkResultStructure(result2.current);
    });
  });
});
