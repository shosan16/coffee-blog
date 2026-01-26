import type { RecipeFilters } from '@/client/features/recipe-list/types/api';
import { buildQueryParams } from '@/client/shared/api/request';

export type { RecipeFilters };

/**
 * 有効な値かどうかを判定する関数
 *
 * フィルター値の有効性を検証し、空の配列や未定義値を無効とする
 * 範囲オブジェクトの場合は min または max のいずれかが定義されていれば有効
 *
 * @param value - 検証対象の値
 * @returns 有効な値の場合は true、無効な場合は false
 */
export const hasValidValue = (value: unknown): boolean => {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object' && 'min' in value && 'max' in value) {
    return value.min !== undefined || value.max !== undefined;
  }
  return true;
};

/**
 * アクティブなフィルター数をカウントする関数
 *
 * ページネーション・ソート関連のパラメータを除外し、
 * 有効な値を持つフィルターの数をカウントする
 *
 * @param filters - カウント対象のフィルターオブジェクト
 * @returns アクティブなフィルターの数
 */
export const countActiveFilters = (filters: RecipeFilters): number => {
  const excludeKeys = ['page', 'limit', 'sort', 'order'];
  return Object.entries(filters).filter(
    ([key, value]) => !excludeKeys.includes(key) && hasValidValue(value)
  ).length;
};

/**
 * 配列フィルターから指定要素を削除する
 *
 * 配列が空になった場合はキーごと削除し、pageを1にリセットする
 * itemToRemove が undefined の場合はキー全体を削除する
 *
 * @param filters - 元のフィルターオブジェクト
 * @param key - 削除対象のキー
 * @param itemToRemove - 削除する要素（省略時はキー全体を削除）
 * @returns 新しいフィルターオブジェクト
 */
export const removeItemFromArrayFilter = <K extends keyof RecipeFilters>(
  filters: RecipeFilters,
  key: K,
  itemToRemove?: string
): RecipeFilters => {
  const newFilters = { ...filters, page: 1 };

  if (itemToRemove === undefined) {
    delete newFilters[key];
    return newFilters;
  }

  const currentValue = filters[key];
  if (Array.isArray(currentValue)) {
    const newArray = currentValue.filter((item) => item !== itemToRemove);
    if (newArray.length === 0) {
      delete newFilters[key];
    } else {
      (newFilters[key] as string[]) = newArray;
    }
  } else {
    delete newFilters[key];
  }

  return newFilters;
};

/**
 * フィルター値を更新する
 *
 * 無効な値の場合はキーを削除し、page以外の変更時はpageを1にリセットする
 *
 * @param filters - 元のフィルターオブジェクト
 * @param key - 更新対象のキー
 * @param value - 新しい値
 * @returns 新しいフィルターオブジェクト
 */
export const updateFilterValue = <K extends keyof RecipeFilters>(
  filters: RecipeFilters,
  key: K,
  value: RecipeFilters[K]
): RecipeFilters => {
  const newFilters = { ...filters };

  if (hasValidValue(value)) {
    newFilters[key] = value;
  } else {
    delete newFilters[key];
  }

  if (key !== 'page') {
    newFilters.page = 1;
  }

  return newFilters;
};

/**
 * フィルターと検索値からナビゲーション用URLを構築する
 *
 * pageは常に1を設定し、検索値が空の場合はsearchを含めない
 *
 * @param filters - フィルターオブジェクト
 * @param searchValue - 検索値
 * @returns URL文字列
 */
export const buildNavigationUrl = (filters: RecipeFilters, searchValue: string): string => {
  const urlFilters: RecipeFilters = { ...filters, page: 1 };
  const trimmedSearch = searchValue.trim();

  if (trimmedSearch) {
    urlFilters.search = trimmedSearch;
  } else {
    delete urlFilters.search;
  }

  const queryParams = buildQueryParams(urlFilters);
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '/';
};
