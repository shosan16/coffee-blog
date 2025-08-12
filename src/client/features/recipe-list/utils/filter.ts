import type { RoastLevel, GrindSize } from '@prisma/client';
import type { ReadonlyURLSearchParams } from 'next/navigation';

import type { RecipeFilters } from '@/client/features/recipe-list/types/api';

/**
 * URLのsearchParamsからレシピのフィルター条件を解析する関数
 */
export function parseFiltersFromSearchParams(
  searchParams: ReadonlyURLSearchParams | null
): RecipeFilters {
  const filters = {} as RecipeFilters;

  // searchParamsがnullの場合は空のフィルターを返す
  if (!searchParams) {
    return filters;
  }

  // 文字列パラメータの処理
  const stringParams = ['search', 'sort'];
  stringParams.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      (filters as Record<string, unknown>)[param] = value;
    }
  });

  // 数値パラメータの処理
  const numberParams = ['page', 'limit'];
  numberParams.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        (filters as Record<string, unknown>)[param] = parsed;
      }
    }
  });

  // 列挙型パラメータの処理
  const enumParams = {
    order: ['asc', 'desc'],
  };
  Object.entries(enumParams).forEach(([param, allowedValues]) => {
    const value = searchParams.get(param);
    if (value && allowedValues.includes(value)) {
      (filters as Record<string, unknown>)[param] = value;
    }
  });

  // 配列パラメータの処理
  const arrayParams = {
    roastLevel: (level: string): RoastLevel => level as RoastLevel,
    grindSize: (size: string): GrindSize => size as GrindSize,
    equipment: (item: string): string => item,
    equipmentType: (item: string): string => item,
  };
  Object.entries(arrayParams).forEach(([param, converter]) => {
    const value = searchParams.get(param);
    if (value) {
      (filters as Record<string, unknown>)[param] = value.split(',').map(converter);
    }
  });

  // JSON形式のパラメータの処理
  const jsonParams = ['beanWeight', 'waterTemp', 'waterAmount'];
  jsonParams.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      try {
        (filters as Record<string, unknown>)[param] = JSON.parse(value);
      } catch {
        // JSON解析エラーの場合は無視
      }
    }
  });

  return filters;
}
