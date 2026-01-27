/**
 * ソートオプション定数
 *
 * レシピ一覧のソート機能で使用するオプションを定義
 */

export const SORT_OPTIONS = [
  { value: 'publishedAt:desc', label: '新着順' },
  { value: 'viewCount:desc', label: '人気順' },
  { value: 'roastLevel:asc', label: '焙煎度（浅煎り順）' },
  { value: 'roastLevel:desc', label: '焙煎度（深煎り順）' },
] as const;

export type SortOptionValue = (typeof SORT_OPTIONS)[number]['value'];

export const DEFAULT_SORT = 'publishedAt:desc';

/**
 * ソート値をパースしてsortとorderに分割
 *
 * @param value - "sortBy:order" 形式の文字列
 * @returns { sort, order } オブジェクト。不正な値の場合はデフォルト値を返す
 */
export function parseSortValue(value: string): { sort: string; order: 'asc' | 'desc' } {
  const parts = value.split(':');
  if (parts.length !== 2) {
    const defaultParts = DEFAULT_SORT.split(':');
    return { sort: defaultParts[0], order: defaultParts[1] as 'asc' | 'desc' };
  }

  const [sort, orderPart] = parts;
  const order = orderPart === 'asc' || orderPart === 'desc' ? orderPart : 'desc';

  return { sort, order };
}

/**
 * sortとorderを結合してソート値を構築
 *
 * @param sort - ソートフィールド
 * @param order - ソート順
 * @returns "sortBy:order" 形式の文字列
 */
export function buildSortValue(sort: string, order: 'asc' | 'desc'): string {
  return `${sort}:${order}`;
}
