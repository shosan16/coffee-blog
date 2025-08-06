import type { RoastLevel, GrindSize } from '@prisma/client';
import { useCallback } from 'react';

import { useRecipeFilter } from '@/client/features/recipe-list/hooks/useRecipeFilter';

/**
 * フィルター更新ハンドラーの型定義
 */
export type FilterHandlers = {
  equipmentChangeHandler: (equipment: string[]) => void;
  roastLevelChangeHandler: (levels: RoastLevel[]) => void;
  grindSizeChangeHandler: (sizes: GrindSize[]) => void;
  beanWeightChangeHandler: (range: { min?: number; max?: number }) => void;
  waterTempChangeHandler: (range: { min?: number; max?: number }) => void;
  waterAmountChangeHandler: (range: { min?: number; max?: number }) => void;
};

/**
 * フィルター更新処理を統一化するカスタムフック
 *
 * @description レシピ検索において、複数のフィルター種別（器具・焙煎度・挽き目・重量・温度・湯量）
 * に対して同じパターンの更新処理が必要なため、汎用的なハンドラー生成関数を提供する。
 *
 * @returns フィルター種別ごとの更新ハンドラー群
 * @example
 * ```tsx
 * const { equipmentChangeHandler, roastLevelChangeHandler } = useFilterHandlers();
 * // 器具フィルターの変更
 * equipmentChangeHandler(['grinder', 'dripper']);
 * ```
 */
export function useFilterHandlers(): FilterHandlers {
  const { updateFilter } = useRecipeFilter();

  /**
   * 汎用フィルター更新関数
   *
   * @template T フィルター値の型
   * @param filterKey 更新するフィルターキー
   * @param value 設定する値
   */
  const createFilterHandler = useCallback(
    (filterKey: string) =>
      (value: unknown): void => {
        (updateFilter as (key: string, val: unknown) => void)(filterKey, value);
      },
    [updateFilter]
  );

  // 各フィルター種別のハンドラーをメモ化して生成
  const equipmentChangeHandler = useCallback(
    (equipment: string[]) => createFilterHandler('equipment')(equipment),
    [createFilterHandler]
  );

  const roastLevelChangeHandler = useCallback(
    (levels: RoastLevel[]) => createFilterHandler('roastLevel')(levels),
    [createFilterHandler]
  );

  const grindSizeChangeHandler = useCallback(
    (sizes: GrindSize[]) => createFilterHandler('grindSize')(sizes),
    [createFilterHandler]
  );

  const beanWeightChangeHandler = useCallback(
    (range: { min?: number; max?: number }) => createFilterHandler('beanWeight')(range),
    [createFilterHandler]
  );

  const waterTempChangeHandler = useCallback(
    (range: { min?: number; max?: number }) => createFilterHandler('waterTemp')(range),
    [createFilterHandler]
  );

  const waterAmountChangeHandler = useCallback(
    (range: { min?: number; max?: number }) => createFilterHandler('waterAmount')(range),
    [createFilterHandler]
  );

  return {
    equipmentChangeHandler,
    roastLevelChangeHandler,
    grindSizeChangeHandler,
    beanWeightChangeHandler,
    waterTempChangeHandler,
    waterAmountChangeHandler,
  };
}
