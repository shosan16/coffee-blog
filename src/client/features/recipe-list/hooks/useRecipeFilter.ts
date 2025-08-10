'use client';

import { isEqual } from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useMemo } from 'react';

import type { RecipeFilters } from '@/client/features/recipe-list/types/api';
import { parseFiltersFromSearchParams } from '@/client/features/recipe-list/utils/filter';
import { buildQueryParams } from '@/client/shared/api/request';

export type UseRecipeFilterReturn = {
  filters: RecipeFilters;
  pendingFilters: RecipeFilters;
  updateFilter: <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  isLoading: boolean;
  hasChanges: boolean;
  activeFilterCount: number;
};

export function useRecipeFilter(): UseRecipeFilterReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<RecipeFilters>({});

  // URLから現在のフィルター状態を取得
  const currentFilters = useMemo(() => parseFiltersFromSearchParams(searchParams), [searchParams]);

  // 初期化時に pendingFilters を currentFilters と同期
  // isEqualを使って深い比較を行い、実際に変更があった場合のみ更新
  useEffect(() => {
    setPendingFilters((prev) => {
      return !isEqual(currentFilters, prev) ? currentFilters : prev;
    });
  }, [currentFilters]);

  // 変更があるかどうかをチェック
  const hasChanges = useMemo(() => {
    return !isEqual(currentFilters, pendingFilters);
  }, [currentFilters, pendingFilters]);

  // アクティブなフィルター数をカウント（page/limitは除外）
  const activeFilterCount = useMemo(() => {
    const excludeKeys = ['page', 'limit'];
    return Object.entries(currentFilters).filter(
      ([key, value]) => !excludeKeys.includes(key) && Boolean(value)
    ).length;
  }, [currentFilters]);

  // フィルター更新関数（pending状態のみ更新）
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

  // フィルター適用関数
  const applyFilters = useCallback((): void => {
    setIsLoading(true);

    const queryParams = buildQueryParams(pendingFilters);
    const newUrl = queryParams.toString() ? `?${queryParams.toString()}` : '/';

    router.push(newUrl);

    // ローディング状態を短時間で解除
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [pendingFilters, router]);

  // フィルターリセット関数
  const resetFilters = useCallback((): void => {
    setPendingFilters({});
    setIsLoading(true);

    router.push('/');

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [router]);

  return {
    filters: currentFilters,
    pendingFilters,
    updateFilter,
    applyFilters,
    resetFilters,
    isLoading,
    hasChanges,
    activeFilterCount,
  };
}
