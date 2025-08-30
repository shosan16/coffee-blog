import type { MultiComboboxItem } from '@/client/shared/components/multi-combobox/types';

/**
 * 焙煎度の選択肢
 */
export const ROAST_LEVELS: MultiComboboxItem[] = [
  { id: 'LIGHT', label: '浅煎り', value: 'LIGHT' },
  { id: 'LIGHT_MEDIUM', label: '中浅煎り', value: 'LIGHT_MEDIUM' },
  { id: 'MEDIUM', label: '中煎り', value: 'MEDIUM' },
  { id: 'MEDIUM_DARK', label: '中深煎り', value: 'MEDIUM_DARK' },
  { id: 'DARK', label: '深煎り', value: 'DARK' },
  { id: 'FRENCH', label: '極深煎り', value: 'FRENCH' },
];

/**
 * 挽き目の選択肢
 */
export const GRIND_SIZES: MultiComboboxItem[] = [
  { id: 'EXTRA_FINE', label: '極細挽き', value: 'EXTRA_FINE' },
  { id: 'FINE', label: '細挽き', value: 'FINE' },
  { id: 'MEDIUM_FINE', label: '中細挽き', value: 'MEDIUM_FINE' },
  { id: 'MEDIUM', label: '中挽き', value: 'MEDIUM' },
  { id: 'MEDIUM_COARSE', label: '中粗挽き', value: 'MEDIUM_COARSE' },
  { id: 'COARSE', label: '粗挽き', value: 'COARSE' },
  { id: 'EXTRA_COARSE', label: '極粗挽き', value: 'EXTRA_COARSE' },
];

/**
 * 焙煎度の値から対応する日本語ラベルを取得するヘルパー関数
 * @param value - 焙煎度の値（例: "LIGHT", "MEDIUM"）
 * @returns 対応する日本語ラベル、見つからない場合は元の値を返す
 */
export const getRoastLevelLabel = (value: string | null): string => {
  if (!value) return '';
  return ROAST_LEVELS.find((item) => item.value === value)?.label ?? value;
};

/**
 * 挽き目の値から対応する日本語ラベルを取得するヘルパー関数
 * @param value - 挽き目の値（例: "FINE", "COARSE"）
 * @returns 対応する日本語ラベル、見つからない場合は元の値を返す
 */
export const getGrindSizeLabel = (value: string | null): string => {
  if (!value) return '';
  return GRIND_SIZES.find((item) => item.value === value)?.label ?? value;
};
