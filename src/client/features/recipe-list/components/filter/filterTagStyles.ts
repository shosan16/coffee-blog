import type { FilterCategory } from '../../utils/filterDisplay';

/**
 * フィルタータグの統一スタイルクラス
 * 全カテゴリで同じデザインを使用し、一貫性のあるUIを提供
 */
const TAG_STYLE =
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border bg-stone-100 text-stone-700 border-stone-200 shadow-sm';

/**
 * フィルタータグのスタイルクラスを返す
 *
 * @param _category - フィルターのカテゴリ（将来の拡張用に残す）
 * @returns Tailwind CSSクラス文字列
 */
export function getFilterTagStyle(_category: FilterCategory): string {
  return TAG_STYLE;
}
