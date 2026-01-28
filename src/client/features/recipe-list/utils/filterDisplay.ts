import type { RecipeFilters } from '@/client/features/recipe-list/types/api';
import { getGrindSizeLabel, getRoastLevelLabel } from '@/client/shared/constants/coffee-beans';

/**
 * フィルターのカテゴリ
 * UIでのスタイリングやグループ化に使用
 */
export type FilterCategory = 'roastLevel' | 'grindSize' | 'equipment' | 'tags' | 'search' | 'range';

/**
 * フィルター表示アイテムの型定義
 *
 * @property key - フィルターのキー（roastLevel, grindSize 等）
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

/**
 * 範囲フィルターを表示用文字列にフォーマットする
 *
 * @param label - 表示ラベル（粉量、湯温、水量）
 * @param range - 範囲オブジェクト（min, max）
 * @param unit - 単位（g, ℃, ml）
 * @returns フォーマット済み文字列、または範囲が指定されていない場合は null
 */
export function formatRangeDisplay(
  label: string,
  range: { min?: number; max?: number } | undefined,
  unit: string
): string | null {
  if (!range) return null;
  const { min, max } = range;

  if (min !== undefined && max !== undefined) {
    return `${label}: ${min}-${max}${unit}`;
  }
  if (min !== undefined) {
    return `${label}: ${min}${unit}〜`;
  }
  if (max !== undefined) {
    return `${label}: 〜${max}${unit}`;
  }
  return null;
}

/** 範囲フィルターの設定 */
type RangeFilterConfig = {
  key: keyof Pick<RecipeFilters, 'beanWeight' | 'waterTemp' | 'waterAmount'>;
  label: string;
  unit: string;
};

const RANGE_FILTER_CONFIGS: RangeFilterConfig[] = [
  { key: 'beanWeight', label: '粉量', unit: 'g' },
  { key: 'waterTemp', label: '湯温', unit: '℃' },
  { key: 'waterAmount', label: '水量', unit: 'ml' },
];

/** 配列フィルターのラベル変換関数の型 */
type LabelConverter = (value: string) => string;

/** 配列フィルターの設定 */
type ArrayFilterConfig = {
  key: keyof Pick<RecipeFilters, 'roastLevel' | 'grindSize' | 'equipment' | 'tags'>;
  getLabel: LabelConverter;
  category: FilterCategory;
};

const ARRAY_FILTER_CONFIGS: ArrayFilterConfig[] = [
  {
    key: 'roastLevel',
    getLabel: (v) => getRoastLevelLabel(v as Parameters<typeof getRoastLevelLabel>[0]),
    category: 'roastLevel',
  },
  {
    key: 'grindSize',
    getLabel: (v) => getGrindSizeLabel(v as Parameters<typeof getGrindSizeLabel>[0]),
    category: 'grindSize',
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

  // 範囲フィルターを処理
  for (const config of RANGE_FILTER_CONFIGS) {
    const rangeLabel = formatRangeDisplay(config.label, filters[config.key], config.unit);
    if (rangeLabel) {
      items.push({ key: config.key, label: rangeLabel, category: 'range' });
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
