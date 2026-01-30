import type { RoastLevel } from '@prisma/client';
import type { ReadonlyURLSearchParams } from 'next/navigation';

import type { RecipeFilters } from '@/client/features/recipe-list/types/api';

/**
 * 文字列パラメータの解析
 */
function parseStringParams(
  searchParams: ReadonlyURLSearchParams
): Pick<RecipeFilters, 'search' | 'sort'> {
  const result: Pick<RecipeFilters, 'search' | 'sort'> = {};
  const stringParams = ['search', 'sort'] as const;

  for (const param of stringParams) {
    const value = searchParams.get(param);
    if (!value) continue;

    result[param] = value;
  }

  return result;
}

/**
 * 数値パラメータの解析
 */
function parseNumberParams(
  searchParams: ReadonlyURLSearchParams
): Pick<RecipeFilters, 'page' | 'limit'> {
  const result: Pick<RecipeFilters, 'page' | 'limit'> = {};
  const numberParams = ['page', 'limit'] as const;

  for (const param of numberParams) {
    const value = searchParams.get(param);
    if (!value) continue;

    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) continue;

    result[param] = parsed;
  }

  return result;
}

/**
 * 列挙型パラメータの解析
 */
function parseEnumParams(searchParams: ReadonlyURLSearchParams): Pick<RecipeFilters, 'order'> {
  const result: Pick<RecipeFilters, 'order'> = {};
  const enumParams = {
    order: ['asc', 'desc'] as const,
  };

  for (const [param, allowedValues] of Object.entries(enumParams)) {
    const value = searchParams.get(param);
    if (!value) continue;
    if (!allowedValues.includes(value as 'asc' | 'desc')) continue;

    (result as Record<string, unknown>)[param] = value;
  }

  return result;
}

/**
 * 配列パラメータの解析
 */
function parseArrayParams(
  searchParams: ReadonlyURLSearchParams
): Pick<RecipeFilters, 'roastLevel' | 'equipment' | 'equipmentType' | 'tags'> {
  const result: Pick<RecipeFilters, 'roastLevel' | 'equipment' | 'equipmentType' | 'tags'> = {};
  const arrayParams = {
    roastLevel: (level: string): RoastLevel => level as RoastLevel,
    equipment: (item: string): string => item,
    equipmentType: (item: string): string => item,
    tags: (item: string): string => item,
  };

  for (const [param, converter] of Object.entries(arrayParams)) {
    const value = searchParams.get(param);
    if (!value) continue;

    (result as Record<string, unknown>)[param] = value.split(',').map(converter);
  }

  return result;
}

/**
 * URLのsearchParamsからレシピのフィルター条件を解析する関数
 */
export function parseFiltersFromSearchParams(
  searchParams: ReadonlyURLSearchParams | null
): RecipeFilters {
  if (!searchParams) {
    return {};
  }

  return {
    ...parseStringParams(searchParams),
    ...parseNumberParams(searchParams),
    ...parseEnumParams(searchParams),
    ...parseArrayParams(searchParams),
  };
}
