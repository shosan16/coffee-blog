/**
 * フィルター関連の汎用的な定数定義
 * MultiComboboxやその他のフィルターコンポーネントで使用される選択肢を定義
 */

/**
 * 基本的な選択肢の型定義
 * MultiComboboxItemと互換性を持つ汎用的な型
 */
export type OptionItem = {
  /** アイテムの一意識別子 */
  id: string;
  /** アイテムの表示ラベル */
  label: string;
  /** アイテムの値 */
  value: string;
  /** アイテムが無効化されているかどうか（オプション） */
  disabled?: boolean;
};

/**
 * 焙煎度の選択肢定数
 * Prismaの RoastLevel enum と対応
 */
export const ROAST_LEVELS: OptionItem[] = [
  { id: 'LIGHT', label: 'ライト', value: 'LIGHT' },
  { id: 'LIGHT_MEDIUM', label: 'ライトミディアム', value: 'LIGHT_MEDIUM' },
  { id: 'MEDIUM', label: 'ミディアム', value: 'MEDIUM' },
  { id: 'MEDIUM_DARK', label: 'ミディアムダーク', value: 'MEDIUM_DARK' },
  { id: 'DARK', label: 'ダーク', value: 'DARK' },
  { id: 'FRENCH', label: 'フレンチ', value: 'FRENCH' },
];

/**
 * 挽き目の選択肢定数
 * Prismaの GrindSize enum と対応
 */
export const GRIND_SIZES: OptionItem[] = [
  { id: 'EXTRA_FINE', label: 'エクストラファイン', value: 'EXTRA_FINE' },
  { id: 'FINE', label: 'ファイン', value: 'FINE' },
  { id: 'MEDIUM_FINE', label: 'ミディアムファイン', value: 'MEDIUM_FINE' },
  { id: 'MEDIUM', label: 'ミディアム', value: 'MEDIUM' },
  { id: 'MEDIUM_COARSE', label: 'ミディアムコース', value: 'MEDIUM_COARSE' },
  { id: 'COARSE', label: 'コース', value: 'COARSE' },
  { id: 'EXTRA_COARSE', label: 'エクストラコース', value: 'EXTRA_COARSE' },
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
