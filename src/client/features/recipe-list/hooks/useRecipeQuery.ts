'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  buildNavigationUrl,
  countActiveFilters,
  removeItemFromArrayFilter,
  type RecipeFilters,
  updateFilterValue,
} from '@/client/features/recipe-list/hooks/filterHelpers';
import { parseFiltersFromSearchParams } from '@/client/features/recipe-list/utils/filter';

/**
 * レシピ検索・フィルタリング機能を統合管理するフック
 *
 * 検索キーワードとフィルター条件をURLパラメータと連動して管理し、
 * ユーザーの検索・絞り込み状態を永続化する
 *
 * @returns 検索・フィルター状態と操作メソッド
 */
export type UseRecipeQueryReturn = {
  // 現在の状態（URLベース）
  searchValue: string;
  filters: RecipeFilters;

  // pending状態（確定前）
  pendingSearchValue: string;
  pendingFilters: RecipeFilters;

  // 操作メソッド
  setSearchValue: (value: string) => void;
  setFilter: <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => void;
  removeFilter: <K extends keyof RecipeFilters>(key: K, itemToRemove?: string) => void;
  applyFilters: (filters: Partial<RecipeFilters>) => void;
  apply: () => void;
  reset: () => void;
  clearSearch: () => void;

  // 状態
  isLoading: boolean;
  hasChanges: boolean;
  activeFilterCount: number;
};

/**
 * ローディング状態付きで非同期操作を実行する共通ヘルパー
 *
 * 操作の前後でローディング状態を自動管理し、
 * ユーザーインターフェースのローディング表示を一元制御する
 *
 * @param setIsLoading - ローディング状態を更新する関数
 * @returns ローディング状態付きで操作を実行する関数
 */
function useLoadingOperation(
  setIsLoading: (loading: boolean) => void
): (operation: () => void) => void {
  return useCallback(
    (operation: () => void) => {
      setIsLoading(true);
      operation();
      setIsLoading(false);
    },
    [setIsLoading]
  );
}

/**
 * URL状態とナビゲーション機能を管理する専用フック
 *
 * URLパラメータから現在のフィルター・検索状態を取得し、
 * ページ遷移とURL更新を担当する。ブラウザの戻る/進むボタンに対応
 *
 * @returns URL状態とナビゲーション関数のオブジェクト
 */
function useUrlState(): {
  currentFilters: RecipeFilters;
  currentSearchValue: string;
  navigateTo: (filters: RecipeFilters, searchValue: string) => void;
  resetUrl: () => void;
} {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilters = useMemo(() => parseFiltersFromSearchParams(searchParams), [searchParams]);
  const currentSearchValue = useMemo(() => searchParams.get('search') ?? '', [searchParams]);

  const navigateTo = useCallback(
    (filters: RecipeFilters, searchValue: string) => {
      const newUrl = buildNavigationUrl(filters, searchValue);
      router.push(newUrl);
    },
    [router]
  );

  const resetUrl = useCallback(() => {
    router.push('/');
  }, [router]);

  return {
    currentFilters,
    currentSearchValue,
    navigateTo,
    resetUrl,
  };
}

/**
 * フォーム状態管理専用フック
 *
 * ユーザーの入力値（検索・フィルター）を一時保持し、
 * URL状態との同期とフォーム操作を担当する。
 * apply実行前の確定待ち状態を管理
 *
 * @param initialFilters - 初期フィルター状態（URL由来）
 * @param initialSearchValue - 初期検索値（URL由来）
 * @returns フォーム状態と操作関数のオブジェクト
 */
function useFormState(
  initialFilters: RecipeFilters,
  initialSearchValue: string
): {
  pendingFilters: RecipeFilters;
  pendingSearchValue: string;
  setSearchValue: (value: string) => void;
  setFilter: <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => void;
  resetForm: () => void;
} {
  const [pendingFilters, setPendingFilters] = useState<RecipeFilters>(() => ({
    ...initialFilters,
  }));
  const [pendingSearchValue, setPendingSearchValue] = useState(initialSearchValue);

  // URL状態が変わったら同期
  useEffect(() => {
    setPendingFilters({ ...initialFilters });
    setPendingSearchValue(initialSearchValue);
  }, [initialFilters, initialSearchValue]);

  const setSearchValue = useCallback((value: string) => {
    setPendingSearchValue(value);
  }, []);

  const setFilter = useCallback(
    <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => {
      setPendingFilters((prev: RecipeFilters) => updateFilterValue(prev, key, value));
    },
    []
  );

  const resetForm = useCallback(() => {
    setPendingFilters({});
    setPendingSearchValue('');
  }, []);

  return {
    pendingFilters,
    pendingSearchValue,
    setSearchValue,
    setFilter,
    resetForm,
  };
}

export function useRecipeQuery(): UseRecipeQueryReturn {
  const [isLoading, setIsLoading] = useState(false);

  // ローディング操作の共通化
  const executeWithLoading = useLoadingOperation(setIsLoading);

  // URL状態管理
  const { currentFilters, currentSearchValue, navigateTo, resetUrl } = useUrlState();

  // フォーム状態管理
  const { pendingFilters, pendingSearchValue, setSearchValue, setFilter, resetForm } = useFormState(
    currentFilters,
    currentSearchValue
  );

  // 変更検出
  const hasChanges = useMemo(() => {
    const searchChanged = currentSearchValue !== pendingSearchValue;
    const filtersChanged = JSON.stringify(currentFilters) !== JSON.stringify(pendingFilters);
    return filtersChanged || searchChanged;
  }, [currentFilters, pendingFilters, currentSearchValue, pendingSearchValue]);

  // アクティブフィルター数カウント
  const activeFilterCount = useMemo(() => countActiveFilters(currentFilters), [currentFilters]);

  // 適用関数
  const apply = useCallback((): void => {
    executeWithLoading(() => {
      navigateTo(pendingFilters, pendingSearchValue);
    });
  }, [executeWithLoading, pendingFilters, pendingSearchValue, navigateTo]);

  // フィルターを即座に適用（setFilterの非同期問題を回避）
  const applyFilters = useCallback(
    (filters: Partial<RecipeFilters>): void => {
      executeWithLoading(() => {
        const newFilters = { ...currentFilters, ...filters, page: 1 };
        navigateTo(newFilters, currentSearchValue);
      });
    },
    [executeWithLoading, currentFilters, currentSearchValue, navigateTo]
  );

  // リセット関数
  const reset = useCallback((): void => {
    executeWithLoading(() => {
      resetForm();
      resetUrl();
    });
  }, [executeWithLoading, resetForm, resetUrl]);

  // フィルター削除（即座に適用、setStateの非同期問題を回避）
  const removeFilter = useCallback(
    <K extends keyof RecipeFilters>(key: K, itemToRemove?: string): void => {
      executeWithLoading(() => {
        const newFilters = removeItemFromArrayFilter(currentFilters, key, itemToRemove);
        navigateTo(newFilters, currentSearchValue);
      });
    },
    [executeWithLoading, currentFilters, currentSearchValue, navigateTo]
  );

  // 検索クリア
  const clearSearch = useCallback((): void => {
    executeWithLoading(() => {
      const filtersWithoutSearch = { ...pendingFilters };
      delete filtersWithoutSearch.search;
      navigateTo(filtersWithoutSearch, '');
    });
  }, [executeWithLoading, pendingFilters, navigateTo]);

  return {
    searchValue: currentSearchValue,
    filters: currentFilters,
    pendingSearchValue,
    pendingFilters,
    setSearchValue,
    setFilter,
    removeFilter,
    applyFilters,
    apply,
    reset,
    clearSearch,
    isLoading,
    hasChanges,
    activeFilterCount,
  };
}
