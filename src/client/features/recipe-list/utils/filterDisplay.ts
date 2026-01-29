import type { RecipeFilters } from '@/client/features/recipe-list/types/api';
import { getRoastLevelLabel } from '@/client/shared/constants/coffee-beans';

/**
 * フィルターのカテゴリ
 * UIでのスタイリングやグループ化に使用
 */
export type FilterCategory = 'roastLevel' | 'equipment' | 'tags' | 'search';

/**
 * フィルター表示アイテムの型定義
 *
 * @property key - フィルターのキー（roastLevel, equipment 等）
 * @property label - 表示用ラベル
 * @property itemValue - 配列フィルターの個別値（削除時に使用）
 * @property isSearch - 検索フィルターかどうか
 * @property category - フィルターのカテゴリ（スタイリング用）
 */
export type FilterDisplayItem = {
  key: keyof RecipeFilters;
  label: string;
  itemValue?: string;
  isSearch?: boolean;
  category: FilterCategory;
};

/** 配列フィルターのラベル変換関数の型 */
type LabelConverter = (value: string) => string;

/** 配列フィルターの設定 */
type ArrayFilterConfig = {
  key: keyof Pick<RecipeFilters, 'roastLevel' | 'equipment' | 'tags'>;
  getLabel: LabelConverter;
  category: FilterCategory;
};

const ARRAY_FILTER_CONFIGS: ArrayFilterConfig[] = [
  {
    key: 'roastLevel',
    getLabel: (v) => getRoastLevelLabel(v as Parameters<typeof getRoastLevelLabel>[0]),
    category: 'roastLevel',
  },
  { key: 'equipment', getLabel: (v) => v, category: 'equipment' },
  { key: 'tags', getLabel: (v) => v, category: 'tags' },
];

/**
 * RecipeFilters から表示用アイテムのリストを構築する
 *
 * page, limit, sort, order, equipmentType は表示対象から除外される
 *
 * @param filters - レシピフィルター
 * @returns 表示用アイテムのリスト
 */
export function buildFilterDisplayItems(filters: RecipeFilters): FilterDisplayItem[] {
  const items: FilterDisplayItem[] = [];

  // 配列フィルターを処理
  for (const config of ARRAY_FILTER_CONFIGS) {
    const values = filters[config.key];
    if (values) {
      for (const value of values) {
        items.push({
          key: config.key,
          label: config.getLabel(value),
          itemValue: value,
          category: config.category,
        });
      }
    }
  }

  // 検索フィルター
  if (filters.search) {
    items.push({
      key: 'search',
      label: `検索: "${filters.search}"`,
      isSearch: true,
      category: 'search',
    });
  }

  return items;
}
