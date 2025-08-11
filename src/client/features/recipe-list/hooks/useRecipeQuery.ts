'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isEqual } from 'lodash';

import type { RecipeFilters } from '../types/api';
import { buildQueryParams } from '@/client/shared/api/request';
import { parseFiltersFromSearchParams } from '../utils/filter';

/**
 * レシピ検索・フィルタリング機能を統合管理するフック
 *
 * 検索キーワードとフィルター条件をURLパラメータと連動して管理し、
 * ユーザーの検索・絞り込み状態を永続化する
 *
 * @returns 検索・フィルター状態と操作メソッド
 */
export interface UseRecipeQueryReturn {
  // 現在の状態（URLベース）
  searchValue: string;
  filters: RecipeFilters;

  // pending状態（確定前）
  pendingSearchValue: string;
  pendingFilters: RecipeFilters;

  // 操作メソッド
  updateSearchValue: (value: string) => void;
  updateFilter: <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => void;
  removeFilter: <K extends keyof RecipeFilters>(key: K, itemToRemove?: string) => void;
  applyChanges: () => void;
  resetAll: () => void;
  clearSearch: () => void;

  // 状態
  isLoading: boolean;
  hasChanges: boolean;
  activeFilterCount: number;
  resultCount?: number;
  setResultCount: (count: number | undefined) => void;
}

/**
 * 有効な値かどうかを判定する関数（KISS原則に従ったシンプルな実装）
 */
const hasValidValue = (value: unknown): boolean => {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object' && 'min' in value && 'max' in value) {
    return value.min !== undefined || value.max !== undefined;
  }
  return true;
};

export function useRecipeQuery(): UseRecipeQueryReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<RecipeFilters>(() => ({}));
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
    setPendingFilters((prev: RecipeFilters) => {
      return !isEqual(currentFilters, prev) ? { ...currentFilters } : prev;
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

  // アクティブなフィルター数をカウント（page/limitは除外）
  const activeFilterCount = useMemo(() => {
    const excludeKeys = ['page', 'limit'];
    return Object.entries(currentFilters).filter(
      ([key, value]) => !excludeKeys.includes(key) && hasValidValue(value)
    ).length;
  }, [currentFilters]);

  // 検索キーワード更新関数
  const updateSearchValue = useCallback((value: string) => {
    setPendingSearchValue(value);
  }, []);

  // フィルター更新関数（pending状態のみ更新）
  const updateFilter = useCallback(
    <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => {
      setPendingFilters((prev: RecipeFilters) => {
        const newFilters = { ...prev };

        if (!hasValidValue(value)) {
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
  const applyChanges = useCallback((): void => {
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
      setPendingFilters((prev: RecipeFilters) => {
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

        return newFilters;
      });

      // 変更を即座にURLに反映
      setTimeout(() => {
        applyChanges();
      }, 0);
    },
    [applyChanges]
  );

  // 全リセット関数
  const resetAll = useCallback((): void => {
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
    filters: currentFilters,
    pendingSearchValue,
    pendingFilters,
    updateSearchValue,
    updateFilter,
    removeFilter,
    applyChanges,
    resetAll,
    clearSearch,
    isLoading,
    hasChanges,
    activeFilterCount,
    resultCount,
    setResultCount,
  };
}
