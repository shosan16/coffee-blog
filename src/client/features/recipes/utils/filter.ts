import { RoastLevel, GrindSize } from '@prisma/client';
import { ReadonlyURLSearchParams } from 'next/navigation';

import { RecipeFilters } from '@/client/features/recipes/types/api';
import { parseFiltersFromSearchParams as parseFilters } from '@/client/shared/utils/queryParams';

/**
 * URLのsearchParamsからレシピのフィルター条件を解析する関数
 */
export function parseFiltersFromSearchParams(
  searchParams: ReadonlyURLSearchParams | null
): RecipeFilters {
  return parseFilters<RecipeFilters>(searchParams, {
    // 数値パラメータ
    numberParams: ['page', 'limit'],

    // 文字列パラメータ
    stringParams: ['search', 'sort'],

    // 列挙型パラメータ
    enumParams: {
      order: ['asc', 'desc'],
    },

    // 配列パラメータ
    arrayParams: {
      roastLevel: (level) => level as RoastLevel,
      grindSize: (size) => size as GrindSize,
      equipment: (item) => item,
      equipmentType: (item) => item,
    },

    // JSON形式パラメータ
    jsonParams: ['beanWeight', 'waterTemp', 'waterAmount'],
  });
}
