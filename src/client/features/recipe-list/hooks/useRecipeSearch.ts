'use client';

import { isEqual } from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { RecipeFilters } from '@/client/features/recipe-list/types/api';
import { parseFiltersFromSearchParams } from '@/client/features/recipe-list/utils/filter';
import { buildQueryParams } from '@/client/shared/api/request';

export type UseRecipeSearchReturn = {
  /** 現在の検索キーワード */
  searchValue: string;
  /** pending状態の検索キーワード */
  pendingSearchValue: string;
  /** 現在のフィルター */
  filters: RecipeFilters;
  /** pending状態のフィルター */
  pendingFilters: RecipeFilters;
  /** 検索キーワードの更新 */
  updateSearchValue: (value: string) => void;
  /** フィルターの更新 */
  updateFilter: <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => void;
  /** フィルターの削除 */
  removeFilter: <K extends keyof RecipeFilters>(key: K, itemToRemove?: string) => void;
  /** 検索とフィルターの適用 */
  applySearch: () => void;
  /** 検索とフィルターのリセット */
  resetSearch: () => void;
  /** 検索のみリセット */
  clearSearch: () => void;
  /** ローディング状態 */
  isLoading: boolean;
  /** 変更があるかどうか */
  hasChanges: boolean;
  /** 検索結果数（外部から設定） */
  resultCount: number | undefined;
  /** 検索結果数の設定 */
  setResultCount: (count: number | undefined) => void;
};

/**
 * レシピ検索とフィルタリングの統合フック
 *
 * 検索キーワードとフィルター条件を統合管理し、
 * URLパラメータとの同期を行う。
 *
 * @example
 * ```tsx
 * const {
 *   searchValue,
 *   pendingSearchValue,
 *   updateSearchValue,
 *   applySearch,
 *   resultCount
 * } = useRecipeSearch();
 *
 * return (
 *   <SearchBox
 *     value={pendingSearchValue}
 *     onChange={updateSearchValue}
 *     resultCount={resultCount}
 *   />
 * );
 * ```
 */
export function useRecipeSearch(): UseRecipeSearchReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<RecipeFilters>({});
  const [pendingSearchValue, setPendingSearchValue] = useState('');
  const [resultCount, setResultCount] = useState<number | undefined>(undefined);

  // URLから現在のフィルター状態を取得
  const currentFilters = useMemo(() => parseFiltersFromSearchParams(searchParams), [searchParams]);

  // URLから現在の検索キーワードを取得
  const currentSearchValue = useMemo(() => {
    return searchParams.get('search') ?? '';
  }, [searchParams]);

  // 初期化時にpending状態を現在の状態と同期
  useEffect(() => {
    setPendingFilters((prev) => {
      return !isEqual(currentFilters, prev) ? currentFilters : prev;
    });

    setPendingSearchValue((prev) => {
      return currentSearchValue !== prev ? currentSearchValue : prev;
    });
  }, [currentFilters, currentSearchValue]);

  // 変更があるかどうかをチェック
  const hasChanges = useMemo(() => {
    const filtersChanged = !isEqual(currentFilters, pendingFilters);
    const searchChanged = currentSearchValue !== pendingSearchValue;
    return filtersChanged || searchChanged;
  }, [currentFilters, pendingFilters, currentSearchValue, pendingSearchValue]);

  // 検索キーワード更新関数
  const updateSearchValue = useCallback((value: string) => {
    setPendingSearchValue(value);
  }, []);

  // フィルター更新関数
  const updateFilter = useCallback(
    <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => {
      setPendingFilters((prev) => {
        const newFilters = { ...prev };

        if (
          value == null ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === 'object' &&
            'min' in value &&
            'max' in value &&
            (value as { min?: unknown; max?: unknown }).min === undefined &&
            (value as { min?: unknown; max?: unknown }).max === undefined)
        ) {
          // 値が空の場合はフィルターを削除
          delete newFilters[key];
        } else {
          // 値がある場合はフィルターを設定
          newFilters[key] = value;
        }

        // ページをリセット（フィルター変更時は1ページ目に戻る）
        if (key !== 'page') {
          newFilters.page = 1;
        }

        return newFilters;
      });
    },
    []
  );

  // 検索とフィルター適用関数
  const applySearch = useCallback((): void => {
    setIsLoading(true);

    // 検索キーワードをフィルターに追加
    const searchFilters = { ...pendingFilters };
    if (pendingSearchValue.trim()) {
      searchFilters.search = pendingSearchValue.trim();
    } else {
      delete searchFilters.search;
    }

    // ページを1に戻す
    searchFilters.page = 1;

    const queryParams = buildQueryParams(searchFilters);
    const newUrl = queryParams.toString() ? `?${queryParams.toString()}` : '/';

    router.push(newUrl);

    // ローディング状態を短時間で解除
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [pendingFilters, pendingSearchValue, router]);

  // フィルター削除関数
  const removeFilter = useCallback(
    <K extends keyof RecipeFilters>(key: K, itemToRemove?: string): void => {
      setPendingFilters((prev) => {
        const newFilters = { ...prev };

        if (itemToRemove && Array.isArray(newFilters[key])) {
          // 配列から特定のアイテムを削除
          const currentArray = newFilters[key] as string[];
          const newArray = currentArray.filter((item) => item !== itemToRemove);

          if (newArray.length > 0) {
            newFilters[key] = newArray as RecipeFilters[K];
          } else {
            delete newFilters[key];
          }
        } else {
          // フィルター全体を削除
          delete newFilters[key];
        }

        // ページをリセット
        newFilters.page = 1;

        // 更新された状態を即座にURLに反映
        setIsLoading(true);
        const queryParams = buildQueryParams(newFilters);
        const newUrl = queryParams.toString() ? `?${queryParams.toString()}` : '/';

        // 非同期でURLを更新後にローディング状態を解除
        router.push(newUrl);
        setTimeout(() => setIsLoading(false), 100);

        return newFilters;
      });
    },
    [router]
  );

  // 検索とフィルターリセット関数
  const resetSearch = useCallback((): void => {
    setPendingFilters({});
    setPendingSearchValue('');
    setResultCount(undefined);
    setIsLoading(true);

    router.push('/');

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [router]);

  // 検索のみクリア関数
  const clearSearch = useCallback((): void => {
    setPendingSearchValue('');
    setIsLoading(true);

    // 検索キーワードを除いたフィルターでURL更新
    const filtersWithoutSearch = { ...pendingFilters };
    delete filtersWithoutSearch.search;
    filtersWithoutSearch.page = 1;

    const queryParams = buildQueryParams(filtersWithoutSearch);
    const newUrl = queryParams.toString() ? `?${queryParams.toString()}` : '/';

    router.push(newUrl);

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [pendingFilters, router]);

  return {
    searchValue: currentSearchValue,
    pendingSearchValue,
    filters: currentFilters,
    pendingFilters,
    updateSearchValue,
    updateFilter,
    removeFilter,
    applySearch,
    resetSearch,
    clearSearch,
    isLoading,
    hasChanges,
    resultCount,
    setResultCount,
  };
}
